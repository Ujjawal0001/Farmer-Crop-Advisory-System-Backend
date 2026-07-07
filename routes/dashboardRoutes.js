// ============================================
// Dashboard Routes
// ============================================
const express = require('express');
const router = express.Router();
const { getDashboard } = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

// GET /api/dashboard - Get dashboard data
router.get('/', protect, getDashboard);

module.exports = router;
