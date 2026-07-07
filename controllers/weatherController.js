// ============================================
// Weather Controller
// Proxies requests to OpenWeather API
// ============================================
const axios = require('axios');

/**
 * @desc    Get current weather for a city
 * @route   GET /api/weather/:city
 * @access  Private
 */
const getWeather = async (req, res, next) => {
  try {
    const { city } = req.params;

    if (!city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a city name'
      });
    }

    const apiKey = process.env.WEATHER_API_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    const response = await axios.get(url);
    const data = response.data;

    // Extract and format weather data
    const weatherData = {
      city: data.name,
      country: data.sys.country,
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      tempMin: Math.round(data.main.temp_min),
      tempMax: Math.round(data.main.temp_max),
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      windDeg: data.wind.deg,
      weatherCondition: data.weather[0].main,
      weatherDescription: data.weather[0].description,
      weatherIcon: data.weather[0].icon,
      rainfall: data.rain ? data.rain['1h'] || data.rain['3h'] || 0 : 0,
      visibility: data.visibility ? data.visibility / 1000 : 0, // Convert to km
      clouds: data.clouds.all,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset
    };

    res.json({
      success: true,
      data: weatherData
    });
  } catch (error) {
    // Handle OpenWeather API errors
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        success: false,
        message: 'City not found. Please check the city name.'
      });
    }
    if (error.response && error.response.status === 401) {
      return res.status(500).json({
        success: false,
        message: 'Weather API key is invalid'
      });
    }
    next(error);
  }
};

module.exports = { getWeather };
