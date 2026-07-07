// ============================================
// Soil Routes
// ============================================
const express = require('express');
const router = express.Router();
const { addSoil, getSoilData } = require('../controllers/soilController');
const { protect } = require('../middleware/auth');

// POST /api/soil - Add new soil data
router.post('/', protect, addSoil);

// GET /api/soil - Get all soil data for user
router.get('/', protect, getSoilData);

module.exports = router;
