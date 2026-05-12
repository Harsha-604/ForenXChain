// server/models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,       // No two users with same email
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['investigator', 'admin'],   // Only these two roles allowed
    default: 'investigator'
  },
  walletAddress: {
    type: String,
    default: null       // Their MetaMask/Ethereum address
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Runs BEFORE saving — automatically hashes the password
// Note: Mongoose 7+ async middleware uses native promises — no next() needed
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;  // Only hash if password changed
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// A method to compare passwords during login
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
