// backend/routes/logistics.js
const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const LogisticsAdvisorService = require('../services/LogisticsAdvisorService');
const { db } = require('../firebase');

const router = express.Router();

// Helper function to get the latest status from the timeline
const getOrderStatus = (order) => {
  if (Array.isArray(order.timeline) && order.timeline.length > 0) {
    return order.timeline[order.timeline.length - 1].status || "unknown";
  }
  return "unknown";
};

router.get('/', [auth, authorize('artisan')], async (req, res) => {
  try {
    const allArtisanOrders = [];
    const shippableStatuses = ['pending', 'confirmed', 'processing'];

    // 1. Fetch ALL orders for the artisan, regardless of status
    const ordersSnapshot = await db.collection('orders')
      .where('artisanIds', 'array-contains', req.user.id)
      .orderBy('createdAt', 'desc')
      .get();
      
    ordersSnapshot.forEach(doc => {
        allArtisanOrders.push({ ...doc.data(), id: doc.id });
    });

    // 2. Filter the results in JavaScript, just like the frontend does
    const pendingOrders = allArtisanOrders.filter(order => 
        shippableStatuses.includes(getOrderStatus(order))
    );

    // 3. Generate recommendations for the filtered orders
    const ordersWithRecommendations = pendingOrders.map(order => {
        const recommendations = LogisticsAdvisorService.getRecommendations(order);
        const existingLogistics = order.logistics || {};
        return { ...order, logistics: { ...existingLogistics, recommendations } };
    });

    res.json({ ordersAwaitingShipment: ordersWithRecommendations });

  } catch (error) {
    console.error('Logistics Hub error:', error);
    res.status(500).json({ message: 'Error fetching logistics information' });
  }
});

module.exports = router;