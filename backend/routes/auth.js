const express = require('express');
const { body, validationResult } = require('express-validator');
const UserService = require('../services/UserService');
const { auth } = require('../middleware/auth');
const { admin } = require('../firebase');

const router = express.Router();

router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('role').isIn(['artisan', 'buyer', 'investor', 'ambassador']).withMessage('Invalid role'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, role } = req.body;
    
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(idToken);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const firebaseUid = decodedToken.uid;

    const existingUserByEmail = await UserService.findByEmail(email);
    const existingUserByUid = await UserService.findByUID(firebaseUid);

    if (existingUserByEmail || existingUserByUid) {
      return res.status(400).json({ message: 'User already exists with this email or Firebase UID' });
    }

    const user = await UserService.create({
      name,
      email,
      role,
      firebaseUid,
      unmentored: true,
      uninvested: true,
      city: "",
      state: ""
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: UserService.toJSON(user)
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

router.get('/me', auth, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/logout', auth, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router;