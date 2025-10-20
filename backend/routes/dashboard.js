const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const OrderService = require('../services/OrderService');
const ProductService = require('../services/ProductService');
const IdeaService = require('../services/IdeaService');
const UserService = require('../services/UserService');
const MentorshipService = require('../services/MentorshipService');

const router = express.Router();

router.get('/artisan-stats', [auth, authorize('artisan')], async (req, res) => {
  try {
    const artisanId = req.user.id;

    const orders = await OrderService.findByArtisan(artisanId);
    const activeOrders = orders.filter(order => ['pending', 'confirmed', 'processing'].includes(order.status));

    const products = await ProductService.findByArtisan(artisanId);
    const lowStockItems = products.filter(p => !p.inventory.isUnlimited && p.inventory.quantity < 5);

    const mockSalesData = {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [12, 19, 3, 5, 2, 3, 9],
    };
    const mockViewsData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        data: [30, 25, 40, 35, 50, 45, 60],
    };

    const topProducts = products.sort((a, b) => (b.stats?.views || 0) - (a.stats?.views || 0)).slice(0, 3);

    res.json({
      stats: {
        orders: activeOrders.length,
        lowInventory: lowStockItems.length,
      },
      salesData: mockSalesData,
      viewsData: mockViewsData,
      topProducts: topProducts,
    });
  } catch (error) {
    console.error('Artisan dashboard error:', error);
    res.status(500).json({ message: 'Server error while fetching artisan dashboard data' });
  }
});


router.get('/ambassador-stats', [auth, authorize('ambassador')], async (req, res) => {
    try {
        const ambassadorId = req.user.id;

        // Get count of mentored artisans from the new service
        const mentoredArtisans = await MentorshipService.findArtisansByAmbassador(ambassadorId);

        // This is still mock data, but you can build an `EventService` next
        const eventsHosted = 4; // Placeholder
        const communityRating = 4.8; // Placeholder

        // You could calculate a real sales growth figure by checking orders
        // from mentored artisans over time.
        const artisanSalesGrowth = 15; // Placeholder

        res.json({
            mentoredArtisans: mentoredArtisans.length,
            eventsHosted,
            communityRating,
            artisanSalesGrowth
        });
    } catch (error) {
        console.error('Ambassador dashboard error:', error);
        res.status(500).json({ message: 'Server error while fetching ambassador dashboard data' });
    }
});

module.exports = router;