const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Soil = require('../models/Soil');
const Recommendation = require('../models/Recommendation');
const Crop = require('../models/Crop');
const { protect, admin } = require('../middleware/auth');

// Apply protection & admin checking middleware to all routes in this router
router.use(protect, admin);

/**
 * @desc    Get system-wide stats and recent registrations for admin dashboard
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
router.get('/stats', async (req, res, next) => {
  try {
    const totalFarmers = await User.countDocuments({ role: 'user' });
    const activeFarmers = await User.countDocuments({ role: 'user', isActive: true });
    const totalSoils = await Soil.countDocuments();
    const totalCrops = await Crop.countDocuments();

    const recentFarmers = await User.find({ role: 'user' })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      success: true,
      data: {
        totalFarmers,
        activeFarmers,
        totalSoils,
        totalCrops,
        recentFarmers
      }
    });
  } catch (error) {
    next(error);
  }
});

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

/**
 * @desc    Get all crop rules
 * @route   GET /api/admin/crops
 * @access  Private/Admin
 */
router.get('/crops', async (req, res, next) => {
  try {
    const crops = await Crop.find().sort({ name: 1 }).lean();
    res.json({
      success: true,
      data: crops
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Add a new crop rule
 * @route   POST /api/admin/crops
 * @access  Private/Admin
 */
router.post('/crops', async (req, res, next) => {
  try {
    const crop = await Crop.create(req.body);
    res.status(201).json({
      success: true,
      data: crop
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Update a crop rule
 * @route   PUT /api/admin/crops/:id
 * @access  Private/Admin
 */
router.put('/crops/:id', async (req, res, next) => {
  try {
    const crop = await Crop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop rule not found'
      });
    }
    res.json({
      success: true,
      data: crop
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Delete a crop rule
 * @route   DELETE /api/admin/crops/:id
 * @access  Private/Admin
 */
router.delete('/crops/:id', async (req, res, next) => {
  try {
    const crop = await Crop.findByIdAndDelete(req.params.id);
    if (!crop) {
      return res.status(404).json({
        success: false,
        message: 'Crop rule not found'
      });
    }
    res.json({
      success: true,
      message: 'Crop rule successfully deleted'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @desc    Get all soil logs in the system
 * @route   GET /api/admin/soils
 * @access  Private/Admin
 */
router.get('/soils', async (req, res, next) => {
  try {
    const soils = await Soil.find()
      .populate('userId', 'name email location')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: soils
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
