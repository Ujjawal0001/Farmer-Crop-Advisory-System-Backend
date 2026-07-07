// ============================================
// Recommendation Model - Stores crop recommendations
// ============================================
const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  soilId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Soil',
    required: true
  },
  crops: [
    {
      cropName: { type: String, required: true },
      score: { type: Number, required: true },
      fertilizer: { type: String },
      waterRequirement: { type: String },
      expectedYield: { type: String },
      growingDuration: { type: String },
      reason: { type: String },
      cropImage: { type: String } // emoji representation
    }
  ],
  city: {
    type: String,
    required: true
  },
  weatherData: {
    temp: Number,
    humidity: Number,
    rainfall: Number,
    windSpeed: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recommendation', recommendationSchema);
