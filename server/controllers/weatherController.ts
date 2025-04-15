import axios from 'axios';

export const getWeatherData = async (req, res, next) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }
  try {
    const apiKey = process.env.WEATHER_API_KEY;

    const url = `https://api.openweathermap.org/data/2.5/weather`;
    const { data } = await axios.get(url, {
      params: {
        q: city,
        appid: apiKey,
        units: 'metric',
      },
    });

    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
};
export const getForecastData = async (req, res, next) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }
  try {
    const apiKey = process.env.WEATHER_API_KEY;

    const url = `https://api.openweathermap.org/data/2.5/forecast`;
    const { data } = await axios.get(url, {
      params: {
        q: city,
        appid: apiKey,
        units: 'metric',
      },
    });

    res.status(200).json({
      status: 'success',
      data,
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
};
