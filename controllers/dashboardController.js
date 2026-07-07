// ============================================
// Dashboard Controller
// Aggregates stats for the farmer dashboard
// ============================================
const Soil = require('../models/Soil');
const Recommendation = require('../models/Recommendation');

/**
 * @desc    Get dashboard data for the logged-in user
 * @route   GET /api/dashboard
 * @access  Private
 */
const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Get counts
    const soilCount = await Soil.countDocuments({ userId });
    const recommendationCount = await Recommendation.countDocuments({ userId });

    // Get latest soil entry
    const latestSoil = await Soil.findOne({ userId })
      .sort({ createdAt: -1 })
      .lean();

    // Get latest recommendation
    const latestRecommendation = await Recommendation.findOne({ userId })
      .sort({ createdAt: -1 })
      .populate('soilId')
      .lean();

    // Get recent recommendations (last 5)
    const recentRecommendations = await Recommendation.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('soilId')
      .lean();

    res.json({
      success: true,
      data: {
        soilCount,
        recommendationCount,
        latestSoil,
        latestRecommendation,
        recentRecommendations,
        user: {
          name: req.user.name,
          email: req.user.email,
          createdAt: req.user.createdAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };
