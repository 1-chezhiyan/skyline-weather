import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS so the React client running on Vite (usually port 5173) can access the API
app.use(cors());
app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Geocoding Proxy Endpoint
app.get('/api/search', async (req, res) => {
  const { name } = req.query;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Search query parameter "name" is required.' });
  }

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=8&language=en&format=json`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Geocoding API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error('Error in geocoding search proxy:', error.message);
    return res.status(500).json({ 
      error: 'Failed to search for city locations. Please try again later.',
      details: error.message 
    });
  }
});

// Weather Forecast Proxy Endpoint
app.get('/api/weather', async (req, res) => {
  const { lat, lon, timezone } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Parameters "lat" and "lon" are required.' });
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=${encodeURIComponent(timezone || 'auto')}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error('Error in weather forecast proxy:', error.message);
    return res.status(500).json({ 
      error: 'Failed to fetch weather data. Please try again later.',
      details: error.message 
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', uptime: process.uptime() });
});

// Start the server
app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` VeloWeather Backend running on port ${PORT}`);
  console.log(` Endpoint list:`);
  console.log(` - GET http://localhost:${PORT}/health`);
  console.log(` - GET http://localhost:${PORT}/api/search?name=...`);
  console.log(` - GET http://localhost:${PORT}/api/weather?lat=...&lon=...`);
  console.log(`=========================================`);
});
