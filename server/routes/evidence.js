// server/routes/evidence.js

const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth'); // Combined imports at the top
const Evidence = require('../models/Evidence');

// ─────────────────────────────────────────
// POST /api/evidence/upload
// ─────────────────────────────────────────
// server/routes/evidence.js

router.post('/upload', protect, async (req, res) => {
  const { caseId, fileName, fileType, fileHash, txHash, blockNumber } = req.body;
  console.log(`POST /upload - Case: ${caseId} by ${req.user.name}`);

  try {
    // Save to MongoDB
    const evidence = await Evidence.create({
      caseId,
      fileName,
      fileType,
      fileHash,
      uploadedBy: req.user._id,
      txHash,
      blockNumber
    });

    console.log(`✅ Success: Evidence ${caseId} saved to database`);
    res.status(201).json({ message: 'Evidence stored successfully', evidence });
  } catch (error) {
    // If MongoDB finds the combination of caseId + fileHash already exists:
    if (error.code === 11000) {
      return res.status(400).json({ message: '⚠️ This specific file is already secured for this case.' });
    }
    console.error('❌ MONGODB UPLOAD ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


// ─────────────────────────────────────────
// GET /api/evidence/mine - FETCH OWN RECORDS
// ─────────────────────────────────────────
router.get('/mine', protect, async (req, res) => {
  console.log(`GET /api/evidence/mine - Requested by User: ${req.user.name}`);
  try {
    const evidence = await Evidence.find({ uploadedBy: req.user._id }).sort({ timestamp: -1 });
    res.json(evidence);
  } catch (error) {
    console.error('MINE FETCH ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────
// GET /api/evidence/all - FETCH ALL RECORDS (ADMIN)
// ─────────────────────────────────────────
router.get('/all', protect, adminOnly, async (req, res) => {
  console.log(`GET /api/evidence/all - Requested by ADMIN: ${req.user.name}`);
  try {
    const evidence = await Evidence.find().populate('uploadedBy', 'name email').sort({ timestamp: -1 });
    res.json(evidence);
  } catch (error) {
    console.error('ALL FETCH ERROR:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────
// POST /api/evidence/verify
// ─────────────────────────────────────────
router.post('/verify', protect, async (req, res) => {
  const { caseId, fileHash } = req.body;
  try {
    const evidence = await Evidence.findOne({ caseId });
    if (!evidence) return res.status(404).json({ message: 'No evidence found' });

    const isMatch = evidence.fileHash === fileHash;
    res.json({ caseId, isMatch, storedHash: evidence.fileHash, submittedHash: fileHash, txHash: evidence.txHash });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ─────────────────────────────────────────
// DELETE /api/evidence/:id (ADMIN)
// ─────────────────────────────────────────
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Evidence.findByIdAndDelete(req.params.id);
    res.json({ message: 'Evidence record deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
