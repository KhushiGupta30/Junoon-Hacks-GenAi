const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const DiscussionService = require("../services/DiscussionService");

router.get("/", auth, async (req, res) => {
  try {
    const discussions = await DiscussionService.getAllDiscussions();
    res.json(discussions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const discussion = await DiscussionService.getDiscussionById(req.params.id);
    res.json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const discussion = await DiscussionService.createDiscussion(
      title,
      content,
      req.user.id
    );
    res.status(201).json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:id/replies", auth, async (req, res) => {
  try {
    const { content } = req.body;
    const reply = await DiscussionService.addReplyToDiscussion(
      req.params.id,
      content,
      req.user.id
    );
    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
