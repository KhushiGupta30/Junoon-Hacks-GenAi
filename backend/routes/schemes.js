const express = require("express");
const { auth } = require("../middleware/auth");
const GoogleSchemesService = require("../services/GovernmentSchemesService");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const schemes = await GoogleSchemesService.getGovernmentSchemes(
      req.user.id,
      false
    );
    res.json(schemes);
  } catch (error) {
    console.error("Error fetching schemes:", error.message);
    res.status(500).json({ message: "Server error retrieving schemes" });
  }
});

router.post("/refresh", auth, async (req, res) => {
  try {
    const schemes = await GoogleSchemesService.getGovernmentSchemes(
      req.user.id,
      true
    );
    res.json(schemes);
  } catch (error) {
    console.error("Error refreshing schemes:", error.message);
    res.status(500).json({ message: "Server error retrieving schemes" });
  }
});

module.exports = router;
