// backend/routes/logistics.js
const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const OrderService = require('../services/OrderService');
const LogisticsAdvisorService = require('../services/LogisticsAdvisorService'); // Import our new service

const router = express.Router();

// This endpoint now returns pending orders with shipping recommendations
router.get('/', [auth, authorize('artisan')], async (req, res) => {
  try {
    // 1. Fetch pending orders for the logged-in artisan
    const pendingOrders = await OrderService.findMany({
        'items.artisan': req.user.id,
        'status': { $in: ['pending', 'confirmed', 'processing'] } // Get all shippable orders
    });

    // 2. Generate recommendations for each order
    const ordersWithRecommendations = pendingOrders.map(order => {
        const recommendations = LogisticsAdvisorService.getRecommendations(order);
        return { ...order, logistics: { ...order.logistics, recommendations } };
    });

    res.json({ ordersAwaitingShipment: ordersWithRecommendations });

  } catch (error) {
    console.error('Logistics Hub error:', error);
    res.status(500).json({ message: 'Error fetching logistics information' });
  }
});

module.exports = router;