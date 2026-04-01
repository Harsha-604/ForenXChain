// server/routes/auth.js

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper: generate a JWT token for a user
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'   // Token expires in 7 days
  });
};

// ─────────────────────────────────────────
// POST /api/auth/register
// Creates a new user account
// ─────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { name, email, password, role, walletAddress } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user (password is auto-hashed by the pre-save hook in User model)
    const user = await User.create({ 
  name, 
  email, 
  password, 
  role: role || 'investigator', 
  walletAddress: walletAddress || null   // empty string becomes null
});

    // Respond with user info + token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      walletAddress: user.walletAddress,
      token: generateToken(user._id)
    });

  }catch (error) {
    console.error('REGISTER ERROR:', error);
    // Mongoose validation error (e.g. password too short, missing required field)
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    // Duplicate email (unique constraint)
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────
// POST /api/auth/login
// Logs in a user and returns a token
// ─────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // Check user exists AND password matches
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        walletAddress: user.walletAddress,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }

  } catch (error) {
    console.error('LOGIN ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
