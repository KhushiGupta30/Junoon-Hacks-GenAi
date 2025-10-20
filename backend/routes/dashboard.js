const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const OrderService = require('../services/OrderService');
const ProductService = require('../services/ProductService');
const IdeaService = require('../services/IdeaService');
const UserService = require('../services/UserService');

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
        const stats = {
            mentored: 12,
            events: 4,
            impactScore: 2800
        };
        const myArtisans = [
            { name: 'Priya S.', craft: 'Textile Weaver', imageUrl: 'https://placehold.co/100x100/DB4437/FFFFFF?text=PS' },
            { name: 'Anand V.', craft: 'Pottery Artist', imageUrl: 'https://placehold.co/100x100/0F9D58/FFFFFF?text=AV' },
            { name: 'Sita Devi', craft: 'Madhubani Painter', imageUrl: 'https://placehold.co/100x100/F4B400/FFFFFF?text=SD' },
        ];
        const nearbyAmbassadors = [
            { name: 'Isha Verma', location: 'Gurgaon', distance: '25 km away' },
            { name: 'Rohan Gupta', location: 'Noida', distance: '30 km away' },
            { name: 'Meera Singh', location: 'Faridabad', distance: '35 km away' },
        ];

        res.json({
            stats,
            myArtisans,
            nearbyAmbassadors
        });
    } catch (error) {
        console.error('Ambassador dashboard error:', error);
        res.status(500).json({ message: 'Server error while fetching ambassador dashboard data' });
    }
});


module.exports = router;