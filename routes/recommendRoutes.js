// ============================================
// Recommendation Routes
// ============================================
const express = require('express');
const router = express.Router();
const { getRecommendation, getHistory } = require('../controllers/recommendController');
const { protect } = require('../middleware/auth');

// POST /api/recommend - Generate new recommendations
router.post('/', protect, getRecommendation);

// GET /api/recommend/history - Get recommendation history
router.get('/history', protect, getHistory);

module.exports = router;
