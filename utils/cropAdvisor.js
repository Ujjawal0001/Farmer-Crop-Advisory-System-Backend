// ============================================
// Crop Advisory Engine
// Rule-based recommendation system that scores
// crops based on soil data and weather conditions
// ============================================

// Comprehensive crop database with ideal growing conditions
const CROPS_DATABASE = [
  {
    name: 'Rice',
    emoji: '🌾',
    idealSoilTypes: ['Alluvial', 'Clay', 'Loamy'],
    idealPhRange: { min: 5.5, max: 7.0 },
    idealNitrogen: { min: 80, max: 200 },
    idealPhosphorus: { min: 30, max: 80 },
    idealPotassium: { min: 40, max: 120 },
    idealMoisture: { min: 60, max: 90 },
    idealTempRange: { min: 20, max: 35 },
    seasons: ['Kharif', 'Whole Year'],
    waterRequirement: 'High (1200-1600 mm)',
    growingDuration: '120-150 days',
    baseYield: '4-6 tonnes/hectare',
    fertilizers: ['Urea', 'DAP', 'MOP', 'Zinc Sulphate']
  },
  {
    name: 'Wheat',
    emoji: '🌾',
    idealSoilTypes: ['Alluvial', 'Loamy', 'Clay'],
    idealPhRange: { min: 6.0, max: 7.5 },
    idealNitrogen: { min: 100, max: 250 },
    idealPhosphorus: { min: 40, max: 100 },
    idealPotassium: { min: 50, max: 130 },
    idealMoisture: { min: 40, max: 65 },
    idealTempRange: { min: 10, max: 25 },
    seasons: ['Rabi', 'Whole Year'],
    waterRequirement: 'Moderate (400-650 mm)',
    growingDuration: '120-150 days',
    baseYield: '3-5 tonnes/hectare',
    fertilizers: ['Urea', 'DAP', 'MOP', 'Ammonium Sulphate']
  },
  {
    name: 'Maize',
    emoji: '🌽',
    idealSoilTypes: ['Loamy', 'Alluvial', 'Sandy'],
    idealPhRange: { min: 5.5, max: 7.5 },
    idealNitrogen: { min: 120, max: 280 },
    idealPhosphorus: { min: 50, max: 120 },
    idealPotassium: { min: 60, max: 150 },
    idealMoisture: { min: 50, max: 75 },
    idealTempRange: { min: 18, max: 32 },
    seasons: ['Kharif', 'Rabi', 'Whole Year'],
    waterRequirement: 'Moderate (500-800 mm)',
    growingDuration: '90-120 days',
    baseYield: '5-8 tonnes/hectare',
    fertilizers: ['Urea', 'DAP', 'MOP', 'Zinc Sulphate']
  },
  {
    name: 'Sugarcane',
    emoji: '🎋',
    idealSoilTypes: ['Alluvial', 'Loamy', 'Black'],
    idealPhRange: { min: 6.0, max: 8.0 },
    idealNitrogen: { min: 150, max: 300 },
    idealPhosphorus: { min: 60, max: 150 },
    idealPotassium: { min: 80, max: 200 },
    idealMoisture: { min: 60, max: 85 },
    idealTempRange: { min: 20, max: 38 },
    seasons: ['Kharif', 'Whole Year'],
    waterRequirement: 'Very High (1500-2500 mm)',
    growingDuration: '270-365 days',
    baseYield: '60-100 tonnes/hectare',
    fertilizers: ['Urea', 'SSP', 'MOP', 'FYM']
  },
  {
    name: 'Cotton',
    emoji: '☁️',
    idealSoilTypes: ['Black', 'Alluvial', 'Loamy'],
    idealPhRange: { min: 6.0, max: 8.0 },
    idealNitrogen: { min: 80, max: 200 },
    idealPhosphorus: { min: 40, max: 100 },
    idealPotassium: { min: 40, max: 120 },
    idealMoisture: { min: 40, max: 65 },
    idealTempRange: { min: 21, max: 35 },
    seasons: ['Kharif', 'Whole Year'],
    waterRequirement: 'Moderate (700-1200 mm)',
    growingDuration: '150-180 days',
    baseYield: '1.5-3 tonnes/hectare',
    fertilizers: ['Urea', 'DAP', 'MOP', 'Sulphur']
  },
  {
    name: 'Soybean',
    emoji: '🫘',
    idealSoilTypes: ['Loamy', 'Black', 'Alluvial'],
    idealPhRange: { min: 6.0, max: 7.5 },
    idealNitrogen: { min: 20, max: 80 },
    idealPhosphorus: { min: 40, max: 100 },
    idealPotassium: { min: 40, max: 120 },
    idealMoisture: { min: 50, max: 75 },
    idealTempRange: { min: 20, max: 30 },
    seasons: ['Kharif', 'Whole Year'],
    waterRequirement: 'Moderate (450-700 mm)',
    growingDuration: '90-120 days',
    baseYield: '2-3 tonnes/hectare',
    fertilizers: ['DAP', 'SSP', 'Rhizobium Culture']
  },
  {
    name: 'Potato',
    emoji: '🥔',
    idealSoilTypes: ['Loamy', 'Sandy', 'Alluvial'],
    idealPhRange: { min: 5.0, max: 6.5 },
    idealNitrogen: { min: 100, max: 250 },
    idealPhosphorus: { min: 60, max: 150 },
    idealPotassium: { min: 80, max: 200 },
    idealMoisture: { min: 60, max: 80 },
    idealTempRange: { min: 15, max: 25 },
    seasons: ['Rabi', 'Whole Year'],
    waterRequirement: 'Moderate (500-700 mm)',
    growingDuration: '75-120 days',
    baseYield: '20-30 tonnes/hectare',
    fertilizers: ['Urea', 'DAP', 'MOP', 'FYM']
  },
  {
    name: 'Tomato',
    emoji: '🍅',
    idealSoilTypes: ['Loamy', 'Sandy', 'Red'],
    idealPhRange: { min: 6.0, max: 7.0 },
    idealNitrogen: { min: 100, max: 200 },
    idealPhosphorus: { min: 50, max: 120 },
    idealPotassium: { min: 60, max: 150 },
    idealMoisture: { min: 50, max: 70 },
    idealTempRange: { min: 18, max: 30 },
    seasons: ['Kharif', 'Rabi', 'Whole Year'],
    waterRequirement: 'Moderate (400-600 mm)',
    growingDuration: '60-90 days',
    baseYield: '25-40 tonnes/hectare',
    fertilizers: ['Urea', 'DAP', 'MOP', 'Calcium Nitrate']
  },
  {
    name: 'Onion',
    emoji: '🧅',
    idealSoilTypes: ['Loamy', 'Alluvial', 'Sandy'],
    idealPhRange: { min: 6.0, max: 7.5 },
    idealNitrogen: { min: 80, max: 180 },
    idealPhosphorus: { min: 50, max: 120 },
    idealPotassium: { min: 60, max: 140 },
    idealMoisture: { min: 40, max: 60 },
    idealTempRange: { min: 13, max: 28 },
    seasons: ['Rabi', 'Kharif', 'Whole Year'],
    waterRequirement: 'Moderate (350-550 mm)',
    growingDuration: '90-150 days',
    baseYield: '15-25 tonnes/hectare',
    fertilizers: ['Urea', 'SSP', 'MOP', 'Sulphur']
  },
  {
    name: 'Groundnut',
    emoji: '🥜',
    idealSoilTypes: ['Sandy', 'Loamy', 'Red'],
    idealPhRange: { min: 5.5, max: 7.0 },
    idealNitrogen: { min: 20, max: 80 },
    idealPhosphorus: { min: 30, max: 80 },
    idealPotassium: { min: 30, max: 100 },
    idealMoisture: { min: 40, max: 65 },
    idealTempRange: { min: 22, max: 32 },
    seasons: ['Kharif', 'Zaid', 'Whole Year'],
    waterRequirement: 'Low-Moderate (400-600 mm)',
    growingDuration: '100-130 days',
    baseYield: '1.5-2.5 tonnes/hectare',
    fertilizers: ['SSP', 'Gypsum', 'Rhizobium Culture']
  },
  {
    name: 'Mustard',
    emoji: '🌿',
    idealSoilTypes: ['Loamy', 'Alluvial', 'Sandy'],
    idealPhRange: { min: 6.0, max: 7.5 },
    idealNitrogen: { min: 60, max: 150 },
    idealPhosphorus: { min: 30, max: 80 },
    idealPotassium: { min: 30, max: 90 },
    idealMoisture: { min: 30, max: 55 },
    idealTempRange: { min: 10, max: 25 },
    seasons: ['Rabi', 'Whole Year'],
    waterRequirement: 'Low (250-400 mm)',
    growingDuration: '110-140 days',
    baseYield: '1-2 tonnes/hectare',
    fertilizers: ['Urea', 'SSP', 'Sulphur']
  },
  {
    name: 'Chickpea',
    emoji: '🫘',
    idealSoilTypes: ['Loamy', 'Black', 'Alluvial'],
    idealPhRange: { min: 6.0, max: 8.0 },
    idealNitrogen: { min: 20, max: 60 },
    idealPhosphorus: { min: 40, max: 100 },
    idealPotassium: { min: 30, max: 80 },
    idealMoisture: { min: 30, max: 50 },
    idealTempRange: { min: 10, max: 28 },
    seasons: ['Rabi', 'Whole Year'],
    waterRequirement: 'Low (250-350 mm)',
    growingDuration: '90-120 days',
    baseYield: '1.5-2.5 tonnes/hectare',
    fertilizers: ['DAP', 'Rhizobium Culture', 'PSB']
  },
  {
    name: 'Barley',
    emoji: '🌾',
    idealSoilTypes: ['Loamy', 'Alluvial', 'Sandy'],
    idealPhRange: { min: 6.0, max: 8.5 },
    idealNitrogen: { min: 60, max: 150 },
    idealPhosphorus: { min: 30, max: 80 },
    idealPotassium: { min: 30, max: 90 },
    idealMoisture: { min: 30, max: 55 },
    idealTempRange: { min: 8, max: 22 },
    seasons: ['Rabi', 'Whole Year'],
    waterRequirement: 'Low (250-400 mm)',
    growingDuration: '100-130 days',
    baseYield: '3-4 tonnes/hectare',
    fertilizers: ['Urea', 'DAP', 'MOP']
  },
  {
    name: 'Millet',
    emoji: '🌿',
    idealSoilTypes: ['Sandy', 'Loamy', 'Red', 'Laterite'],
    idealPhRange: { min: 5.5, max: 7.5 },
    idealNitrogen: { min: 40, max: 120 },
    idealPhosphorus: { min: 20, max: 60 },
    idealPotassium: { min: 30, max: 80 },
    idealMoisture: { min: 20, max: 50 },
    idealTempRange: { min: 25, max: 35 },
    seasons: ['Kharif', 'Whole Year'],
    waterRequirement: 'Low (300-500 mm)',
    growingDuration: '65-90 days',
    baseYield: '1.5-3 tonnes/hectare',
    fertilizers: ['Urea', 'DAP', 'MOP']
  },
  {
    name: 'Sunflower',
    emoji: '🌻',
    idealSoilTypes: ['Loamy', 'Black', 'Alluvial'],
    idealPhRange: { min: 6.0, max: 7.5 },
    idealNitrogen: { min: 60, max: 150 },
    idealPhosphorus: { min: 40, max: 100 },
    idealPotassium: { min: 40, max: 100 },
    idealMoisture: { min: 40, max: 65 },
    idealTempRange: { min: 18, max: 30 },
    seasons: ['Kharif', 'Rabi', 'Zaid', 'Whole Year'],
    waterRequirement: 'Moderate (500-700 mm)',
    growingDuration: '80-115 days',
    baseYield: '1.5-2.5 tonnes/hectare',
    fertilizers: ['Urea', 'SSP', 'MOP', 'Boron']
  },
  {
    name: 'Jute',
    emoji: '🌿',
    idealSoilTypes: ['Alluvial', 'Loamy', 'Clay'],
    idealPhRange: { min: 5.5, max: 7.0 },
    idealNitrogen: { min: 80, max: 180 },
    idealPhosphorus: { min: 30, max: 80 },
    idealPotassium: { min: 40, max: 100 },
    idealMoisture: { min: 70, max: 90 },
    idealTempRange: { min: 24, max: 37 },
    seasons: ['Kharif', 'Whole Year'],
    waterRequirement: 'High (1000-1500 mm)',
    growingDuration: '120-150 days',
    baseYield: '2-3 tonnes/hectare',
    fertilizers: ['Urea', 'SSP', 'MOP', 'FYM']
  },
  {
    name: 'Tea',
    emoji: '🍵',
    idealSoilTypes: ['Laterite', 'Red', 'Loamy'],
    idealPhRange: { min: 4.5, max: 6.0 },
    idealNitrogen: { min: 100, max: 300 },
    idealPhosphorus: { min: 30, max: 80 },
    idealPotassium: { min: 50, max: 120 },
    idealMoisture: { min: 60, max: 85 },
    idealTempRange: { min: 15, max: 30 },
    seasons: ['Whole Year'],
    waterRequirement: 'High (1200-2000 mm)',
    growingDuration: '365+ days (perennial)',
    baseYield: '1.5-3 tonnes/hectare',
    fertilizers: ['Urea', 'SSP', 'MOP', 'Dolomite']
  }
];

/**
 * Calculate how well a value falls within an ideal range
 * Returns a score from 0 to maxPoints
 */
function rangeScore(value, min, max, maxPoints) {
  if (value >= min && value <= max) return maxPoints;
  const range = max - min;
  const midpoint = (min + max) / 2;
  const distance = Math.abs(value - midpoint);
  const tolerance = range * 1.5; // Allow 1.5x range as tolerance
  const score = Math.max(0, maxPoints * (1 - distance / tolerance));
  return Math.round(score * 10) / 10;
}

/**
 * Main recommendation function
 * Scores each crop and returns top matches
 *
 * @param {Object} soilData - Soil information from database
 * @param {Object} weatherData - Weather data from API
 * @returns {Array} Top 6 crop recommendations sorted by score
 */
function getRecommendations(soilData, weatherData) {
  const results = CROPS_DATABASE.map((crop) => {
    let totalScore = 0;
    const reasons = [];

    // ========== 1. Soil Type Match (0-20 points) ==========
    if (crop.idealSoilTypes.includes(soilData.soilType)) {
      totalScore += 20;
      reasons.push(`${soilData.soilType} soil is ideal for ${crop.name}`);
    } else {
      // Check if there's any partial match based on general compatibility
      const generalCompat = ['Loamy', 'Alluvial'];
      if (
        generalCompat.some(
          (s) =>
            crop.idealSoilTypes.includes(s) || soilData.soilType === s
        )
      ) {
        totalScore += 8;
        reasons.push(`${soilData.soilType} soil has moderate compatibility`);
      } else {
        reasons.push(`${soilData.soilType} soil is not ideal — consider soil amendments`);
      }
    }

    // ========== 2. pH Compatibility (0-20 points) ==========
    const phScore = rangeScore(
      soilData.ph,
      crop.idealPhRange.min,
      crop.idealPhRange.max,
      20
    );
    totalScore += phScore;
    if (phScore >= 15) {
      reasons.push(`Soil pH ${soilData.ph} is in the optimal range (${crop.idealPhRange.min}-${crop.idealPhRange.max})`);
    } else if (phScore >= 8) {
      reasons.push(`Soil pH ${soilData.ph} is acceptable but not optimal`);
    } else {
      reasons.push(`Soil pH ${soilData.ph} needs adjustment for best results`);
    }

    // ========== 3. NPK Compatibility (0-20 points) ==========
    const nScore = rangeScore(soilData.nitrogen, crop.idealNitrogen.min, crop.idealNitrogen.max, 7);
    const pScore = rangeScore(soilData.phosphorus, crop.idealPhosphorus.min, crop.idealPhosphorus.max, 7);
    const kScore = rangeScore(soilData.potassium, crop.idealPotassium.min, crop.idealPotassium.max, 6);
    const npkTotal = nScore + pScore + kScore;
    totalScore += npkTotal;

    if (npkTotal >= 16) {
      reasons.push('NPK levels are well-suited for this crop');
    } else if (npkTotal >= 10) {
      reasons.push('NPK levels are moderate — supplemental fertilization recommended');
    } else {
      reasons.push('NPK levels need significant supplementation');
    }

    // ========== 4. Moisture Compatibility (0-20 points) ==========
    const moistureScore = rangeScore(
      soilData.moisture,
      crop.idealMoisture.min,
      crop.idealMoisture.max,
      20
    );
    totalScore += moistureScore;
    if (moistureScore >= 15) {
      reasons.push(`Soil moisture ${soilData.moisture}% is optimal`);
    } else if (moistureScore >= 8) {
      reasons.push(`Soil moisture ${soilData.moisture}% is acceptable`);
    }

    // ========== 5. Temperature & Season (0-20 points) ==========
    let tempSeasonScore = 0;

    // Temperature check (0-12 points)
    if (weatherData && weatherData.temp !== undefined) {
      const tempScore = rangeScore(
        weatherData.temp,
        crop.idealTempRange.min,
        crop.idealTempRange.max,
        12
      );
      tempSeasonScore += tempScore;
      if (tempScore >= 9) {
        reasons.push(`Current temperature ${weatherData.temp}°C is ideal`);
      } else if (tempScore >= 5) {
        reasons.push(`Temperature ${weatherData.temp}°C is within acceptable range`);
      }
    } else {
      tempSeasonScore += 6; // Neutral if no weather data
    }

    // Season check (0-8 points)
    if (crop.seasons.includes(soilData.season) || crop.seasons.includes('Whole Year')) {
      tempSeasonScore += 8;
      reasons.push(`${soilData.season} season is suitable for growing`);
    } else {
      reasons.push(`${soilData.season} is not the typical growing season`);
    }

    totalScore += tempSeasonScore;

    // ========== Generate fertilizer recommendation ==========
    const fertilizerRecs = [];
    if (soilData.nitrogen < crop.idealNitrogen.min) {
      fertilizerRecs.push(`Add nitrogen-rich fertilizer (Urea/Ammonium Sulphate) — deficit: ${crop.idealNitrogen.min - soilData.nitrogen}mg/kg`);
    }
    if (soilData.phosphorus < crop.idealPhosphorus.min) {
      fertilizerRecs.push(`Add phosphorus (DAP/SSP) — deficit: ${crop.idealPhosphorus.min - soilData.phosphorus}mg/kg`);
    }
    if (soilData.potassium < crop.idealPotassium.min) {
      fertilizerRecs.push(`Add potassium (MOP) — deficit: ${crop.idealPotassium.min - soilData.potassium}mg/kg`);
    }
    if (fertilizerRecs.length === 0) {
      fertilizerRecs.push('Current NPK levels are sufficient. Use ' + crop.fertilizers.slice(0, 2).join(', ') + ' for maintenance.');
    }

    // ========== Calculate expected yield ==========
    const yieldMultiplier = totalScore / 100;
    const yieldNote =
      yieldMultiplier >= 0.75
        ? `${crop.baseYield} (Excellent conditions)`
        : yieldMultiplier >= 0.5
        ? `${crop.baseYield} (Moderate - may be ~${Math.round(yieldMultiplier * 100)}% of optimal)`
        : `Below average yield expected (~${Math.round(yieldMultiplier * 100)}% of optimal)`;

    // Round total score
    totalScore = Math.min(100, Math.round(totalScore));

    return {
      cropName: crop.name,
      cropImage: crop.emoji,
      score: totalScore,
      fertilizer: fertilizerRecs.join('; '),
      waterRequirement: crop.waterRequirement,
      expectedYield: yieldNote,
      growingDuration: crop.growingDuration,
      reason: reasons.join('. ') + '.'
    };
  });

  // Sort by score descending and return top 6
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

module.exports = { getRecommendations, CROPS_DATABASE };
