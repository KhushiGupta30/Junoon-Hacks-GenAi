const { db } = require("../firebase.js");
const { FieldValue, Timestamp } = require("firebase-admin/firestore");
const BaseService = require("./BaseService.js");
const { bucket } = require("../gcsClient");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

async function uploadImageToGCS(file) {
  if (!file) return null;
  const uniqueFilename = `${uuidv4()}${path.extname(file.originalname)}`;
  const blob = bucket.file(`product_images/${uniqueFilename}`);
  const blobStream = blob.createWriteStream({
    resumable: false,
    contentType: file.mimetype,
  });
  return new Promise((resolve, reject) => {
    blobStream.on("error", (err) => {
      console.error("GCS Upload Error:", err);
      reject(new Error("Could not upload image."));
    });
    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
      console.log(`Image uploaded to ${publicUrl}`);
      resolve(publicUrl);
    });
    blobStream.end(file.buffer);
  });
}

class ProductService extends BaseService {
  constructor() {
    super("products");
  }

  async create(productData) {
    const dataToCreate = {
      ...productData,
      stats: { views: 0, likes: 0, shares: 0, saves: 0 },
      averageRating: 0,
      totalReviews: 0,
      reviews: [],
    };
    return await super.create(dataToCreate);
  }

  async createWithImage(productData, file) {
    const imageUrl = await uploadImageToGCS(file);
    if (!imageUrl) throw new Error("Image upload failed or no image provided.");
    productData.images = [
      { url: imageUrl, alt: productData.name || "Product Image" },
    ];
    return await this.create(productData);
  }

  async updateWithImage(id, updateData, file) {
    const imageUrl = await uploadImageToGCS(file);
    if (imageUrl)
      updateData.images = [
        { url: imageUrl, alt: updateData.name || "Product Image" },
      ];
    return await this.update(id, updateData);
  }

  async findActive(filters = {}, options = {}) {
    return await this.findMany({ ...filters, status: "active" }, options);
  }

  async findByArtisan(artisanId, options = {}) {
    return await this.findMany({ artisan: artisanId }, options);
  }

  async findByCategory(category, options = {}) {
    return await this.findMany({ category }, options);
  }

  async searchProducts(searchTerm, options = {}) {
    return await this.findMany({}, options);
  }

  async incrementViews(productId) {
    const productRef = this.collectionRef.doc(productId);
    const productSnap = await productRef.get();
    if (productSnap.exists) {
      await productRef.update({ "stats.views": FieldValue.increment(1) });
      const data = productSnap.data();
      return {
        ...data,
        stats: { ...data.stats, views: (data.stats?.views || 0) + 1 },
      };
    }
    return null;
  }

  /**
   * --- REFINED addReview with LOGGING ---
   */
  async addReview(productId, reviewInput) {
    const { rating, comment, userId, userName } = reviewInput;
    console.log(
      `[addReview DEBUG] Starting addReview for product: ${productId}, user: ${userId}`
    ); // LOG 1

    if (!userId) {
      console.error(
        "[addReview DEBUG] Error: userId is missing in reviewInput"
      );
      throw new Error("User ID is required to add a review.");
    }

    const productRef = this.collectionRef.doc(productId);

    try {
      // Using a transaction ensures both updates succeed or fail together
      const denormalizedReviewDataForResponse = await db.runTransaction(
        async (transaction) => {
          console.log("[addReview DEBUG] Entered transaction"); // LOG 2
          const productSnap = await transaction.get(productRef);

          if (!productSnap.exists) {
            console.error(
              `[addReview DEBUG] Product ${productId} not found within transaction.`
            );
            throw new Error("Product not found");
          }

          const product = productSnap.data();
          const artisanId = product.artisan;

          if (!artisanId) {
            console.error(
              `[addReview DEBUG] Product ${productId} is missing artisan ID.`
            );
            throw new Error(
              "Cannot add review, product owner information is missing."
            );
          }
          console.log(
            `[addReview DEBUG] Found product, artisanId: ${artisanId}`
          ); // LOG 3

          const hasReviewed = product.reviews?.some((r) => r.userId === userId);
          if (hasReviewed) {
            console.warn(
              `[addReview DEBUG] User ${userId} already reviewed product ${productId}.`
            );
            throw new Error("You have already reviewed this product.");
          }

          // Generate ID for the denormalized doc in 'reviews' collection
          const newReviewRef = db.collection("reviews").doc();
          const reviewTimestamp = Timestamp.now();
          const reviewDateISO = reviewTimestamp.toDate().toISOString();

          console.log(
            `[addReview DEBUG] Generated new review ID: ${newReviewRef.id}`
          ); // LOG 4

          // Data for the nested review array in the product document
          const nestedReviewData = {
            _id: newReviewRef.id,
            userId: userId,
            userName: userName || "Anonymous",
            rating: rating,
            comment: comment || "",
            date: reviewDateISO, // Use consistent ISO string
            reply: null,
          };

          // Data for the top-level 'reviews' collection (denormalized)
          const reviewDocData = {
            artisanId: artisanId, // CRITICAL: Ensure this is correct
            productId: productId,
            productName: product.name || "Untitled Product",
            productImage: product.images?.[0]?.url || null,
            customerId: userId,
            customerName: userName || "Anonymous",
            rating: rating,
            comment: comment || "",
            reply: null,
            createdAt: reviewTimestamp, // Firestore Timestamp
            date: reviewDateISO, // ISO string for consistency if needed elsewhere
            // Make sure the ID used here is correct
            id: newReviewRef.id, // Explicitly adding ID for clarity, though it's the doc ID
          };
          console.log(
            "[addReview DEBUG] Prepared reviewDocData:",
            JSON.stringify(reviewDocData, null, 2)
          ); // LOG 5

          // --- Transactional Updates ---
          const currentTotalReviews = product.totalReviews || 0;
          const currentAverageRating = product.averageRating || 0;
          const newTotalReviews = currentTotalReviews + 1;
          const newAverageRating =
            (currentAverageRating * currentTotalReviews + rating) /
            newTotalReviews;

          console.log("[addReview DEBUG] Updating product document..."); // LOG 6
          transaction.update(productRef, {
            reviews: FieldValue.arrayUnion(nestedReviewData),
            totalReviews: newTotalReviews,
            averageRating: newAverageRating,
          });

          console.log(
            `[addReview DEBUG] Setting denormalized review document ${newReviewRef.id}...`
          ); // LOG 7
          transaction.set(newReviewRef, reviewDocData);
          // --- End Transactional Updates ---

          console.log("[addReview DEBUG] Transaction operations queued."); // LOG 8
          // Return the denormalized data, including the ID, for the API response
          return { id: newReviewRef.id, ...reviewDocData };
        }
      );

      console.log("[addReview DEBUG] Transaction committed successfully."); // LOG 9
      // runTransaction returns the value from the transaction function
      return denormalizedReviewDataForResponse; // Return the full denormalized review data
    } catch (error) {
      console.error(
        `[addReview DEBUG] Add review transaction error for product ${productId}:`,
        error
      ); // LOG 10 (Error)
      throw error; // Re-throw
    }
  }

  // --- replyToReview remains the same ---
  static async replyToReview(reviewId, replyText, artisanId) {
    const reviewRef = db.collection("reviews").doc(reviewId);
    const reviewSnap = await reviewRef.get();
    if (!reviewSnap.exists) throw new Error("Review not found.");
    const review = reviewSnap.data();
    if (review.artisanId !== artisanId) throw new Error("Permission denied.");
    const reply = {
      text: replyText,
      date: Timestamp.now().toDate().toISOString(),
    };
    await reviewRef.update({ reply: reply });
    const productRef = db.collection("products").doc(review.productId);
    const productSnap = await productRef.get();
    if (productSnap.exists) {
      const product = productSnap.data();
      const reviewIndex = product.reviews?.findIndex((r) => r._id === reviewId);
      if (reviewIndex > -1) {
        const updatedReviews = [...product.reviews];
        if (updatedReviews[reviewIndex]) {
          updatedReviews[reviewIndex].reply = reply;
          await productRef.update({ reviews: updatedReviews });
        } else {
          console.warn(
            `Nested review ${reviewId} not found in product ${review.productId}`
          );
        }
      } else {
        console.warn(
          `Nested review ${reviewId} not found in product ${review.productId}`
        );
      }
    } else {
      console.warn(`Product ${review.productId} not found during reply`);
    }
    return { ...review, reply };
  }

  // --- Other methods remain the same ---
  async updateReview(productId, reviewIndex, reviewData) {
    // ... (implementation as before)
    const productRef = this.collectionRef.doc(productId);
    const productSnap = await productRef.get();
    if (!productSnap.exists) throw new Error("Product not found");
    const product = productSnap.data();
    if (!product.reviews || !product.reviews[reviewIndex])
      throw new Error("Review not found");

    const reviews = [...product.reviews];
    const oldRating = reviews[reviewIndex].rating;
    reviews[reviewIndex] = {
      ...reviews[reviewIndex],
      ...reviewData,
      date: Timestamp.now().toDate().toISOString(),
    };
    const newRating = reviews[reviewIndex].rating;

    const currentTotalReviews = product.totalReviews || reviews.length;
    const currentSum = (product.averageRating || 0) * currentTotalReviews;
    const newSum = currentSum - oldRating + newRating;
    const newAverageRating =
      currentTotalReviews > 0 ? newSum / currentTotalReviews : 0;

    await productRef.update({ reviews, averageRating: newAverageRating });
    const updatedSnap = await productRef.get();
    return updatedSnap.data();
  }

  async deleteReview(productId, reviewDataToDelete) {
    // ... (implementation as before)
    const productRef = this.collectionRef.doc(productId);
    try {
      await db.runTransaction(async (transaction) => {
        const productSnap = await transaction.get(productRef);
        if (!productSnap.exists) throw new Error("Product not found");
        const product = productSnap.data();
        const reviews = product.reviews || [];
        const reviewIdToDelete = reviewDataToDelete._id;
        const reviewToDelete = reviews.find((r) => r._id === reviewIdToDelete);
        if (!reviewToDelete) throw new Error("Review not found in product");
        const updatedReviews = reviews.filter(
          (r) => r._id !== reviewIdToDelete
        );
        const currentTotalReviews = product.totalReviews || reviews.length;
        const currentSum = (product.averageRating || 0) * currentTotalReviews;
        const newTotalReviews = Math.max(0, currentTotalReviews - 1);
        const newSum = currentSum - reviewToDelete.rating;
        const newAverageRating =
          newTotalReviews > 0 ? newSum / newTotalReviews : 0;
        transaction.update(productRef, {
          reviews: updatedReviews,
          totalReviews: newTotalReviews,
          averageRating: newAverageRating,
        });
        const reviewRef = db.collection("reviews").doc(reviewIdToDelete);
        transaction.delete(reviewRef);
      });
      console.log(
        `Review ${reviewDataToDelete._id} deleted successfully from product ${productId}`
      );
      const finalSnap = await productRef.get();
      return finalSnap.exists ? finalSnap.data() : null;
    } catch (error) {
      console.error(
        `Error deleting review ${reviewDataToDelete._id} for product ${productId}:`,
        error
      );
      throw error;
    }
  }

  async updateInventory(productId, quantityChange) {
    // ... (implementation as before)
    const productRef = this.collectionRef.doc(productId);
    await productRef.update({
      "inventory.quantity": FieldValue.increment(quantityChange),
    });
    const updatedSnap = await productRef.get();
    return updatedSnap.data();
  }

  async reserveInventory(productId, quantity) {
    // ... (implementation as before)
    const productRef = this.collectionRef.doc(productId);
    try {
      await db.runTransaction(async (transaction) => {
        const productSnap = await transaction.get(productRef);
        if (!productSnap.exists) throw new Error("Product not found");
        const product = productSnap.data();
        const currentQuantity = product.inventory?.quantity || 0;
        const currentReserved = product.inventory?.reservedQuantity || 0;
        const availableQuantity = currentQuantity - currentReserved;
        if (availableQuantity < quantity)
          throw new Error("Insufficient available inventory");
        transaction.update(productRef, {
          "inventory.reservedQuantity": currentReserved + quantity,
        });
      });
      const updatedSnap = await productRef.get();
      return updatedSnap.data();
    } catch (error) {
      console.error(`Error reserving inventory for ${productId}:`, error);
      throw error;
    }
  }

  async releaseInventory(productId, quantity) {
    // ... (implementation as before)
    const productRef = this.collectionRef.doc(productId);
    try {
      await db.runTransaction(async (transaction) => {
        const productSnap = await transaction.get(productRef);
        if (!productSnap.exists) throw new Error("Product not found");
        const product = productSnap.data();
        const currentReserved = product.inventory?.reservedQuantity || 0;
        const newReservedQuantity = Math.max(0, currentReserved - quantity);
        transaction.update(productRef, {
          "inventory.reservedQuantity": newReservedQuantity,
        });
      });
      const updatedSnap = await productRef.get();
      return updatedSnap.data();
    } catch (error) {
      console.error(`Error releasing inventory for ${productId}:`, error);
      throw error;
    }
  }
}

module.exports = new ProductService();
