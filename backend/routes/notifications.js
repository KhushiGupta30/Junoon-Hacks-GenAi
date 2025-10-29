const express = require("express");
const { auth } = require("../middleware/auth");
const NotificationService = require("../services/NotificationService");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const notifications = await NotificationService.findByUser(req.user.id);
    res.json({ notifications });
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/read-all", auth, async (req, res) => {
  try {
    await NotificationService.markAllAsRead(req.user.id);
    res.status(200).json({ message: "All notifications marked as read." });
  } catch (error) {
    console.error("Failed to mark notifications as read:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
