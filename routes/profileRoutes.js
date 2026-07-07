// ============================================
// Profile Routes
// ============================================
const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

// GET /api/profile - Get user profile
router.get('/', protect, getProfile);

// PUT /api/profile - Update user profile
router.put('/', protect, updateProfile);

module.exports = router;
