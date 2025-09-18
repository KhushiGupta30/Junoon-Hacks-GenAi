const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', [auth, authorize('buyer')], [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.product').isMongoId().withMessage('Invalid product ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress.name').notEmpty().withMessage('Shipping name is required'),
  body('shippingAddress.addressLine1').notEmpty().withMessage('Shipping address is required'),
  body('shippingAddress.city').notEmpty().withMessage('Shipping city is required'),
  body('payment.method').isIn(['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash_on_delivery']).withMessage('Invalid payment method')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, shippingAddress, billingAddress, payment } = req.body;

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(400).json({ message: `Product ${item.product} not found` });
      }

      if (product.status !== 'active') {
        return res.status(400).json({ message: `Product ${product.name} is not available` });
      }

      if (product.inventory.quantity < item.quantity && !product.inventory.isUnlimited) {
        return res.status(400).json({ 
          message: `Insufficient inventory for ${product.name}. Available: ${product.inventory.quantity}` 
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        artisan: product.artisan,
        quantity: item.quantity,
        priceAtTime: product.price,
        customization: item.customization || {}
      });

      if (!product.inventory.isUnlimited) {
        product.inventory.reservedQuantity += item.quantity;
        await product.save();
      }
    }

    const tax = subtotal * 0.08; 
    const shipping = subtotal > 100 ? 0 : 15; 
    const total = subtotal + tax + shipping;

    const order = new Order({
      buyer: req.user.id,
      items: orderItems,
      pricing: {
        subtotal,
        tax,
        shipping,
        total
      },
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      payment
    });

    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('items.product', 'name images')
      .populate('items.artisan', 'name profile.avatar');

    res.status(201).json({
      message: 'Order created successfully',
      order: populatedOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error while creating order' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    let filter = {};
    if (req.user.role === 'buyer') {
      filter.buyer = req.user.id;
    } else if (req.user.role === 'artisan') {
      filter['items.artisan'] = req.user.id;
    }

    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const orders = await Order.find(filter)
      .populate('buyer', 'name profile.avatar')
      .populate('items.product', 'name images')
      .populate('items.artisan', 'name profile.avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalOrders: total
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('buyer', 'name email profile')
      .populate('items.product')
      .populate('items.artisan', 'name profile.avatar profile.location');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const hasAccess = order.buyer._id.toString() === req.user.id ||
                     order.items.some(item => item.artisan._id.toString() === req.user.id) ||
                     req.user.role === 'admin';

    if (!hasAccess) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).json({ message: 'Server error while fetching order' });
  }
});

router.put('/:id/status', auth, [
  body('status').isIn(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes must be under 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const isArtisan = req.user.role === 'artisan' && 
                     order.items.some(item => item.artisan.toString() === req.user.id);
    const isAdmin = req.user.role === 'admin';

    if (!isArtisan && !isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status, notes } = req.body;

    order.status = status;
    if (notes) order.notes = notes;

    order.timeline.push({
      status,
      note: notes,
      updatedBy: req.user.id
    });

    await order.save();

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error while updating order' });
  }
});

module.exports = router;