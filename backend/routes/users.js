const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Product = require('../models/Product');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user's profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const allowedUpdates = [
      'name', 'profile', 'artisanProfile', 'investorProfile', 
      'ambassadorProfile', 'settings'
    ];
    
    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});

// @route   GET /api/users/artisans
// @desc    Get all artisans
// @access  Public
router.get('/artisans', async (req, res) => {
  try {
    const { page = 1, limit = 12, location, specialty } = req.query;

    const filter = { role: 'artisan' };
    if (location) filter['profile.location.city'] = new RegExp(location, 'i');
    if (specialty) filter['artisanProfile.craftSpecialty'] = { $in: [specialty] };

    const skip = (page - 1) * limit;
    const artisans = await User.find(filter)
      .select('-password')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(filter);

    res.json({
      artisans,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalArtisans: total
      }
    });
  } catch (error) {
    console.error('Get artisans error:', error);
    res.status(500).json({ message: 'Server error while fetching artisans' });
  }
});

// @route   GET /api/users/artisans/:id
// @desc    Get artisan profile and their products
// @access  Public
router.get('/artisans/:id', async (req, res) => {
  try {
    const artisan = await User.findById(req.params.id).select('-password');
    
    if (!artisan || artisan.role !== 'artisan') {
      return res.status(404).json({ message: 'Artisan not found' });
    }

    const products = await Product.find({ 
      artisan: req.params.id, 
      status: 'active' 
    }).select('name images price category averageRating totalReviews');

    // Increment profile views
    artisan.stats.profileViews += 1;
    await artisan.save();

    res.json({
      artisan,
      products
    });
  } catch (error) {
    console.error('Get artisan error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Artisan not found' });
    }
    res.status(500).json({ message: 'Server error while fetching artisan' });
  }
});

// @route   GET /api/users/my-products
// @desc    Get current user's products (artisans only)
// @access  Private (Artisan only)
router.get('/my-products', [auth, authorize('artisan')], async (req, res) => {
  try {
    const { page = 1, limit = 12, status } = req.query;

    const filter = { artisan: req.user.id };
    if (status) filter.status = status;

    const skip = (page - 1) * limit;
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total
      }
    });
  } catch (error) {
    console.error('Get my products error:', error);
    res.status(500).json({ message: 'Server error while fetching products' });
  }
});

module.exports = router;
