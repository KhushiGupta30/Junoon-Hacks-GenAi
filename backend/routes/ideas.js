const express = require('express');
const { body, validationResult } = require('express-validator');
const Idea = require('../models/Idea');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, category, sortBy = 'votes.upvotes' } = req.query;

    const filter = { status: 'published' };
    if (category) filter.category = category;

    const skip = (page - 1) * limit;
    const ideas = await Idea.find(filter)
      .populate('artisan', 'name profile.avatar')
      .sort({ [sortBy]: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Idea.countDocuments(filter);

    res.json({
      ideas,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalIdeas: total
      }
    });
  } catch (error) {
    console.error('Get ideas error:', error);
    res.status(500).json({ message: 'Server error while fetching ideas' });
  }
});

router.post('/', [auth, authorize('artisan')], [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title is required and must be under 200 characters'),
  body('description').isLength({ min: 10, max: 1000 }).withMessage('Description must be between 10 and 1000 characters'),
  body('category').isIn(['Pottery', 'Textiles', 'Painting', 'Woodwork', 'Metalwork', 'Sculpture', 'Jewelry', 'Other']).withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const idea = new Idea({
      ...req.body,
      artisan: req.user.id
    });

    await idea.save();

    const populatedIdea = await Idea.findById(idea._id)
      .populate('artisan', 'name profile.avatar');

    res.status(201).json({
      message: 'Idea created successfully',
      idea: populatedIdea
    });
  } catch (error) {
    console.error('Create idea error:', error);
    res.status(500).json({ message: 'Server error while creating idea' });
  }
});

router.post('/:id/vote', auth, [
  body('vote').isIn(['up', 'down']).withMessage('Vote must be "up" or "down"')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const idea = await Idea.findById(req.params.id);
    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    const existingVoteIndex = idea.votes.voters.findIndex(
      voter => voter.user.toString() === req.user.id
    );

    const { vote } = req.body;

    if (existingVoteIndex !== -1) {
      const existingVote = idea.votes.voters[existingVoteIndex];
      
      // Remove old vote counts
      if (existingVote.vote === 'up') {
        idea.votes.upvotes -= 1;
      } else {
        idea.votes.downvotes -= 1;
      }

      // Update vote
      idea.votes.voters[existingVoteIndex].vote = vote;
      idea.votes.voters[existingVoteIndex].date = new Date();
    } else {
      // Add new vote
      idea.votes.voters.push({
        user: req.user.id,
        vote
      });
    }

    // Add new vote counts
    if (vote === 'up') {
      idea.votes.upvotes += 1;
    } else {
      idea.votes.downvotes += 1;
    }

    await idea.save();

    res.json({
      message: 'Vote recorded successfully',
      votes: {
        upvotes: idea.votes.upvotes,
        downvotes: idea.votes.downvotes,
        userVote: vote
      }
    });
  } catch (error) {
    console.error('Vote on idea error:', error);
    res.status(500).json({ message: 'Server error while voting' });
  }
});

module.exports = router;