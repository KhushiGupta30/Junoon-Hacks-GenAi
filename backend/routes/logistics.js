// --- START OF FILE routes/logistics.js ---

const express = require('express');
const LogisticsPartner = require('../models/LogisticsPartner');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/logistics
// @desc    Get all logistics partners and featured partner
// @access  Private (for artisans)
router.get('/', auth, async (req, res) => {
  try {
    const partners = await LogisticsPartner.find().sort({ name: 1 });

    const featuredPartner = partners.find(p => p.isFeatured) || partners[0] || null;
    const domesticPartners = partners.filter(p => p.type === 'domestic');
    const internationalPartners = partners.filter(p => p.type === 'international');

    // AI suggestion can be a separate, more complex route later.
    // For now, we'll return a static suggestion.
    const bestFitSuggestion = {
      scenario: "For a 250g fragile ceramic shipped from Delhi to Bangalore:",
      partner: "Delhivery",
      reason: "Offers specialized handling for fragile items at a competitive price point for this route.",
      cost: "Approx. ₹75",
      logo: "https://www.delhivery.com/wp-content/uploads/2021/06/delhivery-white-background-logo.png"
    };
    
    // The packaging tips can remain static on the frontend or be stored in the DB as well.
    // For simplicity, we'll assume they remain on the frontend for now.

    res.json({
      featuredPartner,
      domesticPartners,
      internationalPartners,
      bestFitSuggestion
    });

  } catch (error) {
    console.error('Logistics route error:', error);
    res.status(500).json({ message: 'Server error while fetching logistics data.' });
  }
});

module.exports = router;