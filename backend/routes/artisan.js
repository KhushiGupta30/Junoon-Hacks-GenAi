const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const UserService = require("../services/UserService");

router.put("/profile", auth, async (req, res) => {
  try {
    if (!req.user || !req.user.uid) {
      return res.status(401).json({ message: "Authentication error" });
    }

    const userId = req.user.uid;
    const profileData = req.body;

    await UserService.updateArtisanProfile(userId, profileData);

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Failed to update profile:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
});

module.exports = router;
