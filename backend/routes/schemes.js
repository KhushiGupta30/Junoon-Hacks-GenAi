const express = require('express');
const { auth } = require('../middleware/auth'); // Assuming auth middleware
const GoogleSchemesService = require('../services/GovernmentSchemesService');

const router = express.Router();

// GET schemes (cached)
router.get('/', auth, async (req, res) => {
  try {
    // **FIX:** Corrected function name from getSchemes to getGovernmentSchemes
    const schemes = await GoogleSchemesService.getGovernmentSchemes(req.user.id, false);
    res.json(schemes);
  } catch (error) {
    console.error('Error fetching schemes:', error.message);
    res.status(500).json({ message: 'Server error retrieving schemes' });
  }
});

// POST to refresh schemes (bypasses cache)
router.post('/refresh', auth, async (req, res) => {
  try {
    // **FIX:** Corrected function name from getSchemes to getGovernmentSchemes
    const schemes = await GoogleSchemesService.getGovernmentSchemes(req.user.id, true);
    res.json(schemes);
  } catch (error) {
    console.error('Error refreshing schemes:', error.message);
    res.status(500).json({ message: 'Server error retrieving schemes' });
  }
});

module.exports = router;

