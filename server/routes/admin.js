// server/routes/admin.js

const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const User = require('../models/User');

// ─────────────────────────────────────────
// GET /api/admin/users
// ─────────────────────────────────────────
router.get('/users', protect, adminOnly, async (req, res) => {
  console.log(`GET /api/admin/users - Requested by ADMIN: ${req.user.name}`);
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    console.error('ADMIN USERS FETCH ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
