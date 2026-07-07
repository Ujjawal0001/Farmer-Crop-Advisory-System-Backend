const mongoose = require('mongoose');

/**
 * Crop Schema
 * Stores ideal growing conditions and metadata for crops.
 * Used by the rule-based advisor engine to match soil/weather data.
 */
const cropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Crop name is required'],
    unique: true,
    trim: true,
  },
  emoji: {
    type: String,
    default: '🌾',
  },
  idealSoilTypes: {
    type: [String],
    required: [true, 'Ideal soil types are required'],
  },
  idealPhRange: {
    min: { type: Number, required: true, min: 0, max: 14 },
    max: { type: Number, required: true, min: 0, max: 14 },
  },
  idealNitrogen: {
    min: { type: Number, required: true, min: 0 },
    max: { type: Number, required: true, min: 0 },
  },
  idealPhosphorus: {
    min: { type: Number, required: true, min: 0 },
    max: { type: Number, required: true, min: 0 },
  },
  idealPotassium: {
    min: { type: Number, required: true, min: 0 },
    max: { type: Number, required: true, min: 0 },
  },
  idealMoisture: {
    min: { type: Number, required: true, min: 0, max: 100 },
    max: { type: Number, required: true, min: 0, max: 100 },
  },
  idealTempRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  seasons: {
    type: [String],
    required: [true, 'Growing seasons are required'],
  },
  waterRequirement: {
    type: String,
    required: [true, 'Water requirement description is required'],
  },
  growingDuration: {
    type: String,
    required: [true, 'Growing duration description is required'],
  },
  baseYield: {
    type: String,
    required: [true, 'Base yield description is required'],
  },
  fertilizers: {
    type: [String],
    required: [true, 'Fertilizers list is required'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Crop', cropSchema);
