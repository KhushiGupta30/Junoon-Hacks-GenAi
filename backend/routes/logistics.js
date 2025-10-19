const express = require('express');
const { auth, authorize } = require('../middleware/auth');
const router = express.Router();

// Mock logistics data - In production, this would come from a database
const getLogisticsData = () => ({
  featuredPartner: {
    name: "Delhivery",
    logoUrl: "https://www.delhivery.com/wp-content/uploads/2023/04/Delhivery_logo.svg",
    summary: "India's leading logistics provider with nationwide coverage and competitive rates."
  },
  bestFitSuggestion: {
    scenario: "For lightweight handicrafts (under 2kg) shipping within India:",
    partner: "India Post",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/India_Post_Logo.svg/320px-India_Post_Logo.svg.png",
    reason: "Most affordable for lightweight items with extensive rural reach. Perfect for artisan products.",
    cost: "₹40-80 for standard delivery (4-7 days)"
  },
  domesticPartners: [
    {
      _id: "1",
      name: "Delhivery",
      logoUrl: "https://www.delhivery.com/wp-content/uploads/2023/04/Delhivery_logo.svg",
      summary: "Fast and reliable delivery across 17,000+ pin codes in India.",
      strengths: ["Express delivery options", "Real-time tracking", "COD available"]
    },
    {
      _id: "2",
      name: "India Post",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/India_Post_Logo.svg/320px-India_Post_Logo.svg.png",
      summary: "Government postal service with the widest reach in rural India.",
      strengths: ["Lowest rates", "Rural penetration", "Registered & Speed Post options"]
    },
    {
      _id: "3",
      name: "BlueDart",
      logoUrl: "https://www.bluedart.com/graphics/bluedart-logo-2023.svg",
      summary: "Premium express delivery service with time-definite solutions.",
      strengths: ["Time-guaranteed delivery", "Priority handling", "Temperature-controlled logistics"]
    },
    {
      _id: "4",
      name: "DTDC",
      logoUrl: "https://www.dtdc.in/themes/custom/dtdc/dtdc-logo.svg",
      summary: "Affordable courier service with good network coverage.",
      strengths: ["Budget-friendly rates", "Student discounts", "Franchise network"]
    }
  ],
  internationalPartners: [
    {
      _id: "5",
      name: "DHL Express",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/DHL_Logo.svg/320px-DHL_Logo.svg.png",
      summary: "World's leading international express delivery service.",
      strengths: ["220+ countries", "Express worldwide", "Customs expertise"]
    },
    {
      _id: "6",
      name: "FedEx",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/FedEx_Corporation_-_2016_Logo.svg/320px-FedEx_Corporation_-_2016_Logo.svg.png",
      summary: "Global courier delivery services with excellent US connectivity.",
      strengths: ["Fast US delivery", "Money-back guarantee", "Advanced tracking"]
    },
    {
      _id: "7",
      name: "UPS",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/United_Parcel_Service_logo_2014.svg/320px-United_Parcel_Service_logo_2014.svg.png",
      summary: "Reliable worldwide shipping with strong European network.",
      strengths: ["Europe specialist", "Carbon neutral options", "Flexible delivery"]
    },
    {
      _id: "8",
      name: "Aramex",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Aramex_logo.svg/320px-Aramex_logo.svg.png",
      summary: "Middle East specialist with competitive rates to Gulf countries.",
      strengths: ["Middle East expert", "Shop & Ship service", "Competitive rates"]
    }
  ]
});

// GET /api/logistics
router.get('/', [auth, authorize('artisan')], async (req, res) => {
  try {
    const logisticsData = getLogisticsData();
    res.json(logisticsData);
  } catch (error) {
    console.error('Logistics route error:', error);
    res.status(500).json({ message: 'Error fetching logistics information' });
  }
});

module.exports = router;