const express = require("express");
const { auth } = require("../middleware/auth");
const RawMaterialService = require("../services/RawMaterialService");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const { q, refresh } = req.query;

  if (!q) {
    return res.status(400).json({ message: "A search query (q) is required." });
  }

  const forceRefresh = refresh === "true";

  try {
    const materials = await RawMaterialService.getMaterials(q, forceRefresh);
    res.json(materials);
  } catch (error) {
    console.error("Error fetching materials:", error.message);
    res.status(500).json({ message: "Server error retrieving materials" });
  }
});

module.exports = router;
