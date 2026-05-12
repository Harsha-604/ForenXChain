// server/models/Evidence.js

const mongoose = require('mongoose');

const EvidenceSchema = new mongoose.Schema({
  caseId: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    required: true
  },
  fileHash: {
    type: String,
    required: true   // SHA-256 hash of the file
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // ⛓️ Blockchain Data
  txHash: {
    type: String,
    default: null
  },
  blockNumber: {
    type: Number,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});
// server/models/Evidence.js — Add at the bottom

// This index ensures a file can only be registered once PER CASE ID
EvidenceSchema.index({ caseId: 1, fileHash: 1 }, { unique: true });

module.exports = mongoose.model('Evidence', EvidenceSchema);