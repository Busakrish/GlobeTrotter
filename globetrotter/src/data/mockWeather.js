export const mockWeatherData = {
  'Mumbai': {
    city: 'Mumbai',
    temp: 29,
    feelsLike: 32,
    condition: 'Partly Sunny & Humid',
    icon: 'Sun',
    humidity: 78,
    precipitationProbability: 20,
    windSpeed: '14 km/h',
    advice: 'Light cotton clothing recommended. Keep an umbrella handy for brief coastal showers.',
    forecast: [
      { day: 'Wed', temp: 30, condition: 'Sunny', rain: '10%' },
      { day: 'Thu', temp: 29, condition: 'Partly Cloudy', rain: '25%' },
      { day: 'Fri', temp: 28, condition: 'Light Rain', rain: '45%' },
      { day: 'Sat', temp: 31, condition: 'Clear Sky', rain: '5%' },
      { day: 'Sun', temp: 30, condition: 'Sunny', rain: '10%' },
    ]
  },
  'Goa': {
    city: 'Goa',
    temp: 31,
    feelsLike: 34,
    condition: 'Sunny Beach Breeze',
    icon: 'Sun',
    humidity: 72,
    precipitationProbability: 15,
    windSpeed: '18 km/h',
    advice: 'Prime beach weather! Wear SPF 50+ sunscreen, sunglasses, and airy linens.',
    forecast: [
      { day: 'Wed', temp: 31, condition: 'Sunny', rain: '10%' },
      { day: 'Thu', temp: 32, condition: 'Sunny', rain: '10%' },
      { day: 'Fri', temp: 30, condition: 'Gentle Breeze', rain: '15%' },
      { day: 'Sat', temp: 31, condition: 'Clear Sky', rain: '5%' },
      { day: 'Sun', temp: 32, condition: 'Sunny', rain: '10%' },
    ]
  },
  'Jaipur': {
    city: 'Jaipur',
    temp: 27,
    feelsLike: 27,
    condition: 'Pleasant & Clear',
    icon: 'Sun',
    humidity: 45,
    precipitationProbability: 0,
    windSpeed: '9 km/h',
    advice: 'Ideal sightseeing climate. Moderate daytime temperatures with cool evenings. Carry a light jacket.',
    forecast: [
      { day: 'Wed', temp: 28, condition: 'Clear', rain: '0%' },
      { day: 'Thu', temp: 27, condition: 'Clear', rain: '0%' },
      { day: 'Fri', temp: 26, condition: 'Sunny', rain: '0%' },
      { day: 'Sat', temp: 28, condition: 'Clear', rain: '0%' },
      { day: 'Sun', temp: 29, condition: 'Sunny', rain: '0%' },
    ]
  },
  'Udaipur': {
    city: 'Udaipur',
    temp: 26,
    feelsLike: 26,
    condition: 'Clear Lakes Sky',
    icon: 'Sun',
    humidity: 48,
    precipitationProbability: 0,
    windSpeed: '8 km/h',
    advice: 'Great conditions for sunset lake cruises. Cool breezes by the lake in evening.',
    forecast: [
      { day: 'Wed', temp: 27, condition: 'Clear', rain: '0%' },
      { day: 'Thu', temp: 26, condition: 'Sunny', rain: '0%' },
      { day: 'Fri', temp: 25, condition: 'Clear', rain: '0%' },
      { day: 'Sat', temp: 27, condition: 'Sunny', rain: '0%' },
      { day: 'Sun', temp: 28, condition: 'Clear', rain: '0%' },
    ]
  },
  'New Delhi': {
    city: 'New Delhi',
    temp: 25,
    feelsLike: 25,
    condition: 'Hazy Sunshine',
    icon: 'CloudSun',
    humidity: 55,
    precipitationProbability: 5,
    windSpeed: '7 km/h',
    advice: 'Comfortable afternoon walking. Carry a bottle of water and sun protection.',
    forecast: [
      { day: 'Wed', temp: 26, condition: 'Hazy', rain: '5%' },
      { day: 'Thu', temp: 25, condition: 'Clear', rain: '0%' },
      { day: 'Fri', temp: 24, condition: 'Sunny', rain: '0%' },
      { day: 'Sat', temp: 26, condition: 'Hazy', rain: '5%' },
      { day: 'Sun', temp: 27, condition: 'Sunny', rain: '0%' },
    ]
  },
  'Paris': {
    city: 'Paris',
    temp: 18,
    feelsLike: 17,
    condition: 'Mild & Partly Cloudy',
    icon: 'Cloud',
    humidity: 62,
    precipitationProbability: 30,
    windSpeed: '16 km/h',
    advice: 'Layering is best. Carry a stylish trench coat or cardigan for evenings.',
    forecast: [
      { day: 'Wed', temp: 18, condition: 'Partly Cloudy', rain: '20%' },
      { day: 'Thu', temp: 17, condition: 'Light Showers', rain: '40%' },
      { day: 'Fri', temp: 19, condition: 'Sunny Spells', rain: '15%' },
      { day: 'Sat', temp: 20, condition: 'Clear', rain: '10%' },
      { day: 'Sun', temp: 18, condition: 'Cloudy', rain: '25%' },
    ]
  },
  'Tokyo': {
    city: 'Tokyo',
    temp: 19,
    feelsLike: 18,
    condition: 'Crisp & Sunny',
    icon: 'Sun',
    humidity: 50,
    precipitationProbability: 10,
    windSpeed: '12 km/h',
    advice: 'Pleasant autumn weather. Comfortable walking shoes essential for city explorations.',
    forecast: [
      { day: 'Wed', temp: 20, condition: 'Sunny', rain: '0%' },
      { day: 'Thu', temp: 19, condition: 'Clear', rain: '5%' },
      { day: 'Fri', temp: 18, condition: 'Partly Cloudy', rain: '15%' },
      { day: 'Sat', temp: 21, condition: 'Sunny', rain: '0%' },
      { day: 'Sun', temp: 19, condition: 'Clear', rain: '0%' },
    ]
  }
};

export const getCityWeather = (cityName) => {
  return mockWeatherData[cityName] || {
    city: cityName || 'Destination',
    temp: 26,
    feelsLike: 27,
    condition: 'Pleasant & Clear',
    icon: 'Sun',
    humidity: 55,
    precipitationProbability: 10,
    windSpeed: '12 km/h',
    advice: 'Comfortable travel weather expected. Keep hydrated and check local updates.',
    forecast: [
      { day: 'Day 1', temp: 26, condition: 'Sunny', rain: '10%' },
      { day: 'Day 2', temp: 27, condition: 'Clear', rain: '5%' },
      { day: 'Day 3', temp: 25, condition: 'Partly Cloudy', rain: '15%' },
      { day: 'Day 4', temp: 26, condition: 'Sunny', rain: '10%' },
      { day: 'Day 5', temp: 28, condition: 'Clear', rain: '0%' },
    ]
  };
};
