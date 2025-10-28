const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const OrderService = require('../services/OrderService');
const ProductService = require('../services/ProductService');
const { db } = require('../firebase'); // Import db for direct queries

const router = express.Router();

router.get('/artisan-stats', [auth, authorize('artisan')], async (req, res) => {
  try {
    const artisanId = req.user.id;

    // --- 1. Calculate Sales Data for the last 7 days ---
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Fetch all delivered orders in the last week
    const recentOrdersSnapshot = await db.collection('orders')
      .where('artisanIds', 'array-contains', artisanId)
      .where('status', '==', 'delivered')
      .where('createdAt', '>=', sevenDaysAgo)
      .get();

    // Process orders into daily totals
    const dailySales = new Map();
    const dateLabels = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString('en-US', { weekday: 'short' }); // e.g., "Mon"
        dateLabels.push(label);
        dailySales.set(label, 0);
    }
    
    recentOrdersSnapshot.forEach(doc => {
        const order = doc.data();
        const orderDate = order.createdAt.toDate();
        const dayLabel = orderDate.toLocaleDateString('en-US', { weekday: 'short' });
        if (dailySales.has(dayLabel)) {
            dailySales.set(dayLabel, dailySales.get(dayLabel) + (order.pricing.total || 0));
        }
    });
    
    const salesDataForChart = {
        labels: dateLabels,
        data: dateLabels.map(label => dailySales.get(label))
    };

    // --- 2. Get Views for the Top 7 Most Viewed Products ---
    const topViewedProductsSnapshot = await db.collection('products')
        .where('artisan', '==', artisanId)
        .orderBy('stats.views', 'desc')
        .limit(7)
        .get();
        
    const productViewsLabels = [];
    const productViewsData = [];
    topViewedProductsSnapshot.forEach(doc => {
        const product = doc.data();
        // Truncate long product names for the chart label
        const productName = product.name.length > 15 ? product.name.substring(0, 12) + '...' : product.name;
        productViewsLabels.push(productName);
        productViewsData.push(product.stats.views || 0);
    });

    const viewsDataForChart = {
        labels: productViewsLabels,
        data: productViewsData
    };

    // --- 3. Fetch Core Stats (Orders, Low Inventory, Top Products) using efficient queries ---
    const [
        pendingOrdersSnapshot,
        lowStockSnapshot,
        topProductsSnapshot
    ] = await Promise.all([
        db.collection('orders')
          .where('artisanIds', 'array-contains', artisanId)
          .where('status', 'in', ['pending', 'confirmed', 'processing'])
          .get(),
        db.collection('products')
          .where('artisan', '==', artisanId)
          .where('inventory.isUnlimited', '==', false)
          .where('inventory.quantity', '<', 5)
          .get(),
        db.collection('products')
          .where('artisan', '==', artisanId)
          .orderBy('stats.views', 'desc')
          .limit(3)
          .get()
    ]);

    const topProducts = [];
    topProductsSnapshot.forEach(doc => topProducts.push({ id: doc.id, ...doc.data() }));

    // --- 4. Assemble and Send the Final Response ---
    res.json({
      stats: {
        orders: pendingOrdersSnapshot.size,
        lowInventory: lowStockSnapshot.size,
      },
      salesData: salesDataForChart,
      viewsData: viewsDataForChart,
      topProducts: topProducts,
    });

  } catch (error) {
    console.error('Artisan dashboard error:', error);
    res.status(500).json({ message: 'Server error while fetching artisan dashboard data' });
  }
});

// ... (other dashboard routes like ambassador-stats)

module.exports = router;