// --- START OF FILE models/LogisticsPartner.js ---

const mongoose = require('mongoose');

const logisticsPartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  logoUrl: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
    maxlength: 500,
  },
  type: {
    type: String,
    enum: ['domestic', 'international'],
    required: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  strengths: [String],
  // You can add more fields like avgCostPer500g, websiteUrl etc.
}, {
  timestamps: true
});

module.exports = mongoose.model('LogisticsPartner', logisticsPartnerSchema);