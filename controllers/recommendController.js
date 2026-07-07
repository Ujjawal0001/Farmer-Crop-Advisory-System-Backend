// ============================================
// Recommendation Controller
// Generates and retrieves crop recommendations
// ============================================
const Soil = require('../models/Soil');
const Recommendation = require('../models/Recommendation');
const axios = require('axios');
const { getRecommendations } = require('../utils/cropAdvisor');

/**
 * @desc    Generate crop recommendations based on soil and weather data
 * @route   POST /api/recommend
 * @access  Private
 */
const getRecommendation = async (req, res, next) => {
  try {
    const { soilId, city } = req.body;

    if (!soilId || !city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide soilId and city'
      });
    }

    // Fetch soil data
    const soil = await Soil.findById(soilId);
    if (!soil) {
      return res.status(404).json({
        success: false,
        message: 'Soil data not found'
      });
    }

    // Verify soil belongs to user
    if (soil.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this soil data'
      });
    }

    // Fetch weather data
    let weatherData = { temp: 25, humidity: 60, rainfall: 0, windSpeed: 5 };
    try {
      const apiKey = process.env.WEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
      const weatherResponse = await axios.get(url);
      const wd = weatherResponse.data;
      weatherData = {
        temp: Math.round(wd.main.temp),
        humidity: wd.main.humidity,
        rainfall: wd.rain ? wd.rain['1h'] || wd.rain['3h'] || 0 : 0,
        windSpeed: wd.wind.speed
      };
    } catch (weatherError) {
      console.log('Weather API error, using default values:', weatherError.message);
    }

    // Generate recommendations using the crop advisor engine
    const soilData = {
      soilType: soil.soilType,
      ph: soil.ph,
      nitrogen: soil.nitrogen,
      phosphorus: soil.phosphorus,
      potassium: soil.potassium,
      moisture: soil.moisture,
      season: soil.season
    };

    const crops = getRecommendations(soilData, weatherData);

    // Save recommendation to database
    const recommendation = await Recommendation.create({
      userId: req.user._id,
      soilId: soil._id,
      crops,
      city,
      weatherData
    });

    // Populate soil data in response
    await recommendation.populate('soilId');

    res.status(201).json({
      success: true,
      data: recommendation
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get recommendation history for the logged-in user
 * @route   GET /api/recommend/history
 * @access  Private
 */
const getHistory = async (req, res, next) => {
  try {
    const recommendations = await Recommendation.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('soilId')
      .lean();

    res.json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getRecommendation, getHistory };
