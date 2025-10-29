const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");
const InvestmentService = require("../services/InvestmentService");
const UserService = require("../services/UserService");

router.get("/stats", [auth, authorize("investor")], async (req, res) => {
  try {
    const investorId = req.user.id;
    const stats = await InvestmentService.getInvestmentStats(investorId);

    const investments = await InvestmentService.findByInvestor(investorId);
    const uniqueArtisans = new Set(investments.map((inv) => inv.artisan));
    stats.artisansSupported = uniqueArtisans.size;

    res.json(stats);
  } catch (error) {
    console.error("Failed to fetch investor stats:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
