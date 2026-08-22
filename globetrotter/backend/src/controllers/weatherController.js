export const getWeatherForecast = (req, res) => {
  try {
    const { city } = req.params;
    const cityName = city || 'Mumbai';

    const forecasts = {
      Mumbai: { temp: 31, condition: 'Partly Cloudy', humidity: 72, windSpeed: 14, icon: 'CloudSun', advisory: 'Pleasant evening sea breeze along Marine Drive.' },
      Goa: { temp: 29, condition: 'Sunny & Coastal', humidity: 78, windSpeed: 12, icon: 'Sun', advisory: 'Great beach weather. High UV index around noon.' },
      Jaipur: { temp: 26, condition: 'Clear Skies', humidity: 40, windSpeed: 8, icon: 'Sun', advisory: 'Cool evenings, ideal for hilltop fort visits and rooftop dining.' },
      Manali: { temp: 14, condition: 'Crisp Mountain Breeze', humidity: 55, windSpeed: 10, icon: 'CloudFog', advisory: 'Light woolens recommended for morning viewpoints.' },
      Kerala: { temp: 28, condition: 'Tropical Warmth', humidity: 82, windSpeed: 9, icon: 'CloudRain', advisory: 'Occasional pleasant passing drizzle in the backwaters.' },
      Tokyo: { temp: 18, condition: 'Mild & Sunny', humidity: 50, windSpeed: 11, icon: 'Sun', advisory: 'Clear visibility over Tokyo Skytree and Shinjuku gardens.' },
      Paris: { temp: 16, condition: 'Breezy & Fair', humidity: 62, windSpeed: 15, icon: 'CloudSun', advisory: 'Perfect strolling temperature along the Seine.' },
    };

    const weather = forecasts[cityName] || {
      temp: 27,
      condition: 'Sunny & Clear',
      humidity: 60,
      windSpeed: 10,
      icon: 'Sun',
      advisory: 'Favorable conditions for daytime sightseeing and dining.',
    };

    return res.json({
      success: true,
      city: cityName,
      weather,
      forecast: [
        { day: 'Today', temp: weather.temp, condition: weather.condition },
        { day: 'Tomorrow', temp: weather.temp + 1, condition: 'Sunny' },
        { day: 'Day 3', temp: weather.temp - 1, condition: 'Partly Cloudy' },
        { day: 'Day 4', temp: weather.temp, condition: 'Sunny' },
      ],
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default { getWeatherForecast };
