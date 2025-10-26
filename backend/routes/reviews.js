// Create new file: backend/routes/reviews.js
const express = require('express');
const router = express.Router();
const { db } = require('../firebase');
const { auth } = require('../middleware/auth');


// GET reviews for a specific artisan
router.get('/artisan/:id', auth, async (req, res) => {
  try {
    const artisanId = req.params.id;
    const limit = parseInt(req.query.limit, 10) || 10;

    // Assumes your collection is named 'reviews'
    const reviewsRef = db.collection('reviews');
    // Assumes reviews have an 'artisanId' field
    const snapshot = await reviewsRef
      .where('artisanId', '==', artisanId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    if (snapshot.empty) {
      return res.json([]);
    }

    const reviews = [];
    snapshot.forEach(doc => {
      reviews.push({ id: doc.id, ...doc.data() });
    });

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching artisan reviews:', error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;