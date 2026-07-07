const mongoose = require('mongoose');

/**
 * Soil Schema
 * Stores soil analysis data submitted by farmers.
 * Each entry is linked to a user and contains nutrient levels,
 * soil characteristics, and growing season information.
 */
const soilSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  soilType: {
    type: String,
    required: [true, 'Soil type is required'],
    enum: {
      values: ['Alluvial', 'Black', 'Red', 'Laterite', 'Sandy', 'Clay', 'Loamy', 'Silt'],
      message: '{VALUE} is not a valid soil type',
    },
  },
  ph: {
    type: Number,
    required: [true, 'pH level is required'],
    min: [0, 'pH cannot be less than 0'],
    max: [14, 'pH cannot be more than 14'],
  },
  nitrogen: {
    type: Number,
    required: [true, 'Nitrogen level is required (mg/kg)'],
  },
  phosphorus: {
    type: Number,
    required: [true, 'Phosphorus level is required (mg/kg)'],
  },
  potassium: {
    type: Number,
    required: [true, 'Potassium level is required (mg/kg)'],
  },
  moisture: {
    type: Number,
    required: [true, 'Moisture level is required (percentage)'],
  },
  landArea: {
    type: Number,
    required: [true, 'Land area is required (acres)'],
  },
  season: {
    type: String,
    required: [true, 'Season is required'],
    enum: {
      values: ['Kharif', 'Rabi', 'Zaid', 'Whole Year'],
      message: '{VALUE} is not a valid season',
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Soil', soilSchema);
