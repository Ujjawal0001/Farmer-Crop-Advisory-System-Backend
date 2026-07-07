// ============================================
// Weather Routes
// ============================================
const express = require('express');
const router = express.Router();
const { getWeather } = require('../controllers/weatherController');
const { protect } = require('../middleware/auth');

// GET /api/weather/:city - Get weather for a city
router.get('/:city', protect, getWeather);

module.exports = router;
