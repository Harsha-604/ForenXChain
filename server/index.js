// server/index.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ─── Middleware ───────────────────────────
app.use(cors());
app.use(express.json());

// ─── Database Connection ──────────────────
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.log('❌ MongoDB error:', err));

// ─── Routes ──────────────────────────────
const authRoutes = require('./routes/auth');
const evidenceRoutes = require('./routes/evidence');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/evidence', evidenceRoutes);
app.use('/api/admin', adminRoutes);

// ─── Health Check ─────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'ForenXChain API running' });
});

// ─── Start Server ─────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
