const express = require('express');
const { body, validationResult } = require('express-validator');
const UserService = require('../services/UserService');
const ProductService = require('../services/ProductService');
const { auth, authorize } = require('../middleware/auth');
const MentorshipService = require('../services/MentorshipService');

const router = express.Router();

router.get('/profile', auth, async (req, res) => {
  try {
    const user = await UserService.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(UserService.toJSON(user));
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error while fetching profile' });
  }
});

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

    const user = await UserService.update(req.user.id, updates);

    res.json({
      message: 'Profile updated successfully',
      user: UserService.toJSON(user)
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error while updating profile' });
  }
});

router.get('/artisans', async (req, res) => {
  try {
    const { page = 1, limit = 12, location, specialty } = req.query;

    const filter = { role: 'artisan' };
    if (location) filter['profile.location.city'] = location;
    if (specialty) filter['artisanProfile.craftSpecialty'] = specialty;

    const options = {
      limit: parseInt(limit),
      offset: (page - 1) * limit
    };

    const artisans = await UserService.findMany(filter, options);
    const sanitizedArtisans = artisans.map(user => UserService.toJSON(user));

    const total = await UserService.count(filter);

    res.json({
      artisans: sanitizedArtisans,
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

router.get('/artisans/:id', async (req, res) => {
  try {
    const artisan = await UserService.findById(req.params.id);

    if (!artisan || artisan.role !== 'artisan') {
      return res.status(404).json({ message: 'Artisan not found' });
    }

    const products = await ProductService.findActive({ 
      artisan: req.params.id
    }, {
      limit: 50
    });

    await UserService.incrementProfileViews(artisan.id);

    res.json({
      artisan: UserService.toJSON(artisan),
      products
    });
  } catch (error) {
    console.error('Get artisan error:', error);
    res.status(500).json({ message: 'Server error while fetching artisan' });
  }
});

router.get('/my-products', [auth, authorize('artisan')], async (req, res) => {
  try {
    const { page = 1, limit = 12, status } = req.query;

    const filter = { artisan: req.user.id };
    if (status) filter.status = status;

    const options = {
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };

    const products = await ProductService.findMany(filter, options);
    const total = await ProductService.count(filter);

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

router.get('/artisans/unmentored', auth, async (req, res) => {
  try {
      const allArtisans = await UserService.findMany({ role: 'artisan' });
      const allMentorships = await MentorshipService.findMany({ status: 'active' });
      
      const mentoredArtisanIds = new Set(allMentorships.map(m => m.artisanId));
      
      const unmentoredArtisans = allArtisans.filter(artisan => !mentoredArtisanIds.has(artisan.id));

      res.json({ artisans: unmentoredArtisans.map(UserService.toJSON) });
  } catch (error) {
      console.error("Error fetching unmentored artisans:", error);
      res.status(500).json({ message: "Server error" });
  }
});

router.get('/artisans', auth, async (req, res) => {
  try {
      const allArtisans = await UserService.findMany({ role: 'artisan' });
      const filteredArtisans = allArtisans.filter(artisan => artisan.id !== req.user.id);
      res.json({ artisans: filteredArtisans.map(UserService.toJSON) });
  } catch (error) {
      console.error("Error fetching all artisans:", error);
      res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;