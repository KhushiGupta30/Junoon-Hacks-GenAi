const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const DiscussionService = require('../services/DiscussionService');

// Get all discussions
router.get('/', auth, async (req, res) => {
  try {
    const discussions = await DiscussionService.getAllDiscussions();
    res.json(discussions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single discussion
router.get('/:id', auth, async (req, res) => {
  try {
    const discussion = await DiscussionService.getDiscussionById(req.params.id);
    res.json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new discussion
router.post('/', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    // req.user.id should come from your auth middleware after verifying the token
    const discussion = await DiscussionService.createDiscussion(title, content, req.user.id);
    res.status(201).json(discussion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a reply to a discussion
router.post('/:id/replies', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const reply = await DiscussionService.addReplyToDiscussion(req.params.id, content, req.user.id);
    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;