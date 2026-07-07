// ============================================
// Soil Controller - Add & retrieve soil data
// ============================================
const Soil = require('../models/Soil');

/**
 * @desc    Add new soil data entry
 * @route   POST /api/soil
 * @access  Private
 */
const addSoil = async (req, res, next) => {
  try {
    const { soilType, ph, nitrogen, phosphorus, potassium, moisture, landArea, season } = req.body;

    // Validate required fields
    if (!soilType || ph === undefined || !nitrogen || !phosphorus || !potassium || !moisture || !landArea || !season) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required soil data fields'
      });
    }

    const soil = await Soil.create({
      userId: req.user._id,
      soilType,
      ph: Number(ph),
      nitrogen: Number(nitrogen),
      phosphorus: Number(phosphorus),
      potassium: Number(potassium),
      moisture: Number(moisture),
      landArea: Number(landArea),
      season
    });

    res.status(201).json({
      success: true,
      data: soil
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all soil data entries for the logged-in user
 * @route   GET /api/soil
 * @access  Private
 */
const getSoilData = async (req, res, next) => {
  try {
    const soils = await Soil.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      data: soils
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { addSoil, getSoilData };
