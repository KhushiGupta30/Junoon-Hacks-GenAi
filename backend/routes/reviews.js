const express = require("express");
const router = express.Router();
const { db } = require("../firebase");
const { auth } = require("../middleware/auth");
const { FieldValue } = require("firebase-admin/firestore");

router.get("/artisan/:id", auth, async (req, res) => {
  try {
    const artisanId = req.params.id;
    const limit = parseInt(req.query.limit, 10) || 10;

    const reviewsRef = db.collection("reviews");
    const snapshot = await reviewsRef
      .where("artisanId", "==", artisanId)
      .orderBy("createdAt", "desc")
      .limit(limit)
      .get();

    if (snapshot.empty) {
      return res.json([]);
    }

    const reviews = [];
    snapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() });
    });

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching artisan reviews:", error);
    res.status(500).send("Server Error");
  }
});

router.get("/artisan/:id", auth, async (req, res) => {
  try {
    const artisanId = req.params.id;
    const limit = parseInt(req.query.limit, 10) || 100;

    console.log(`REVIEWS: Fetching reviews for artisan: ${artisanId}`);

    const productsRef = db.collection("products");
    const productsSnapshot = await productsRef
      .where("artisanId", "==", artisanId)
      .get();

    if (productsSnapshot.empty) {
      console.log("REVIEWS: No products found for this artisan.");
      return res.json([]);
    }

    const productIds = productsSnapshot.docs.map((doc) => doc.id);
    console.log(`REVIEWS: Found ${productIds.length} products:`, productIds);

    if (productIds.length === 0) {
      return res.json([]);
    }

    const reviewsRef = db.collection("reviews");
    const queryPromises = [];

    for (let i = 0; i < productIds.length; i += 30) {
      const chunk = productIds.slice(i, i + 30);
      console.log(
        `REVIEWS: Querying for reviews in product chunk ${
          Math.floor(i / 30) + 1
        }`
      );
      queryPromises.push(reviewsRef.where("productId", "in", chunk).get());
    }

    const queryResults = await Promise.all(queryPromises);

    const reviews = [];
    queryResults.forEach((snapshot) => {
      snapshot.forEach((doc) => {
        reviews.push({ id: doc.id, ...doc.data() });
      });
    });

    if (reviews.length === 0) {
      console.log("REVIEWS: No reviews found for these products.");
      return res.json([]);
    }

    reviews.sort((a, b) => {
      const dateA = a.createdAt?.toDate
        ? a.createdAt.toDate()
        : new Date(a.createdAt);
      const dateB = b.createdAt?.toDate
        ? b.createdAt.toDate()
        : new Date(b.createdAt);
      return dateB - dateA;
    });

    const limitedReviews = reviews.slice(0, limit);

    console.log(`REVIEWS: Returning ${limitedReviews.length} reviews.`);
    res.json(limitedReviews);
  } catch (error) {
    console.error("Error fetching artisan reviews:", error);
    res.status(500).send("Server Error");
  }
});

router.put("/:id/reply", auth, async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { text } = req.body;
    const userId = req.user.id;

    if (!text) {
      return res.status(400).json({ message: "Reply text is required" });
    }

    const reviewRef = db.collection("reviews").doc(reviewId);
    const reviewDoc = await reviewRef.get();

    if (!reviewDoc.exists) {
      return res.status(404).json({ message: "Review not found" });
    }

    const reply = {
      text,
      date: FieldValue.serverTimestamp(),
      userId,
    };

    await reviewRef.update({ reply });

    res.status(200).json({ message: "Reply posted successfully", reply });
  } catch (error) {
    console.error("Error posting reply:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
