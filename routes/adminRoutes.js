const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Soil = require('../models/Soil');
const Recommendation = require('../models/Recommendation');
const { protect, admin } = require('../middleware/auth');

// Apply protection & admin checking middleware to all routes in this router
router.use(protect, admin);

/**
 * @desc    Get all registered users (farmers only, excluding admins)
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Toggle account active status (isActive toggle)
 * @route   PUT /api/admin/users/:userId/toggle-status
 * @access  Private/Admin
 */
router.put('/users/:userId/toggle-status', async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Toggle active status
    user.isActive = !user.isActive;
    await user.save();

    res.json({
      success: true,
      message: `Account status successfully updated for ${user.name}`,
      data: {
        id: user._id,
        name: user.name,
        isActive: user.isActive
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Get all reports (Soils & Advisories) for a specific user
 * @route   GET /api/admin/users/:userId/reports
 * @access  Private/Admin
 */
router.get('/users/:userId/reports', async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Fetch user's soils and recommendations
    const soils = await Soil.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    const recommendations = await Recommendation.find({ userId })
      .sort({ createdAt: -1 })
      .populate('soilId')
      .lean();

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        },
        soils,
        recommendations
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
