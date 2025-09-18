const express = require('express');
const { body, validationResult } = require('express-validator');
const Investment = require('../models/Investment');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', [auth, authorize('investor')], [
  body('artisan').isMongoId().withMessage('Invalid artisan ID'),
  body('type').isIn(['grant', 'micro_loan', 'equity_investment', 'pre_order_funding']).withMessage('Invalid investment type'),
  body('amount').isFloat({ min: 1 }).withMessage('Amount must be at least $1'),
  body('purpose').isLength({ min: 10, max: 1000 }).withMessage('Purpose must be between 10 and 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const artisan = await User.findById(req.body.artisan);
    if (!artisan || artisan.role !== 'artisan') {
      return res.status(400).json({ message: 'Invalid artisan' });
    }

    const investment = new Investment({
      ...req.body,
      investor: req.user.id
    });

    await investment.save();

    const populatedInvestment = await Investment.findById(investment._id)
      .populate('investor', 'name profile.avatar')
      .populate('artisan', 'name profile.avatar artisanProfile');

    res.status(201).json({
      message: 'Investment created successfully',
      investment: populatedInvestment
    });
  } catch (error) {
    console.error('Create investment error:', error);
    res.status(500).json({ message: 'Server error while creating investment' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, type } = req.query;

    let filter = {};
    if (req.user.role === 'investor') {
      filter.investor = req.user.id;
    } else if (req.user.role === 'artisan') {
      filter.artisan = req.user.id;
    }

    if (status) filter.status = status;
    if (type) filter.type = type;

    const skip = (page - 1) * limit;
    const investments = await Investment.find(filter)
      .populate('investor', 'name profile.avatar')
      .populate('artisan', 'name profile.avatar artisanProfile.craftSpecialty')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Investment.countDocuments(filter);

    res.json({
      investments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalInvestments: total
      }
    });
  } catch (error) {
    console.error('Get investments error:', error);
    res.status(500).json({ message: 'Server error while fetching investments' });
  }
});

module.exports = router;