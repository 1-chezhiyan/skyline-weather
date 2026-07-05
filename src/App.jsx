import React, { useState, useEffect } from 'react';
import CitySearch from './components/CitySearch';
import { getWeatherState, WeatherIconStyles } from './components/WeatherIcons';
import WeatherDetails from './components/WeatherDetails';
import HourlyChart from './components/HourlyChart';
import DailyForecast from './components/DailyForecast';
import Favorites from './components/Favorites';

// Default city is Chennai, India (Coordinates match user local time zone)
const DEFAULT_CITY = {
  name: 'Chennai',
  country: 'India',
  countryCode: 'in',
  admin1: 'Tamil Nadu',
  lat: 13.0827,
  lon: 80.2707,
  timezone: 'Asia/Kolkata'
};

export default function App() {
  const [activeCity, setActiveCity] = useState(DEFAULT_CITY);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCelsius, setIsCelsius] = useState(true);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

  // Load favorites from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('veloweather_favorites');
      if (stored) {
        setFavorites(JSON.parse(stored));
      } else {
        // Pinned defaults
        const defaults = [
          DEFAULT_CITY,
          { name: 'London', country: 'United Kingdom', countryCode: 'gb', admin1: 'England', lat: 51.5085, lon: -0.1257, timezone: 'Europe/London' },
          { name: 'New York', country: 'United States', countryCode: 'us', admin1: 'New York', lat: 40.7143, lon: -74.006, timezone: 'America/New_York' }
        ];
        setFavorites(defaults);
        localStorage.setItem('veloweather_favorites', JSON.stringify(defaults));
      }
    } catch (err) {
      console.error('Error reading favorites:', err);
    }
  }, []);

  // Fetch weather data when active city changes
  useEffect(() => {
    let isMounted = true;
    const fetchWeather = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:5000/api/weather?lat=${activeCity.lat}&lon=${activeCity.lon}&timezone=${activeCity.timezone || 'auto'}`
        );
        if (!response.ok) {
          throw new Error('Failed to retrieve forecast data.');
        }
        const data = await response.json();
        
        if (isMounted) {
          setWeatherData(data);
        }
      } catch (err) {
        console.error('Error fetching weather:', err);
        if (isMounted) {
          setError(err.message || 'Unable to load weather forecast.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchWeather();
    return () => { isMounted = false; };
  }, [activeCity]);

  // Dynamically update the document body theme class based on the weather
  useEffect(() => {
    if (!weatherData || !weatherData.current) return;
    
    const weather = getWeatherState(
      weatherData.current.weather_code,
      weatherData.current.is_day === 1
    );

    // Remove any existing theme classes
    document.body.className = '';
    // Apply new theme class
    document.body.classList.add(weather.themeClass);
  }, [weatherData]);

  // Pin / Bookmark active location
  const handleToggleFavorite = () => {
    const isPinned = favorites.some(
      (c) => c.lat === activeCity.lat && c.lon === activeCity.lon
    );

    let updated;
    if (isPinned) {
      updated = favorites.filter(
        (c) => !(c.lat === activeCity.lat && c.lon === activeCity.lon)
      );
    } else {
      updated = [...favorites, activeCity];
    }
    setFavorites(updated);
    localStorage.setItem('veloweather_favorites', JSON.stringify(updated));
  };

  const handleRemoveFavorite = (cityToRemove) => {
    const updated = favorites.filter(
      (c) => !(c.lat === cityToRemove.lat && c.lon === cityToRemove.lon)
    );
    setFavorites(updated);
    localStorage.setItem('veloweather_favorites', JSON.stringify(updated));
  };

  // Convert and format primary temperature
  const getDisplayTemp = (celsiusTemp) => {
    const value = isCelsius ? celsiusTemp : (celsiusTemp * 9) / 5 + 32;
    return Math.round(value);
  };

  const isCurrentPinned = favorites.some(
    (c) => c.lat === activeCity.lat && c.lon === activeCity.lon
  );

  // Extract current weather state info
  const currentTemp = weatherData?.current?.temperature_2m;
  const isDay = weatherData?.current?.is_day === 1;
  const weatherCode = weatherData?.current?.weather_code ?? 0;
  const weatherState = getWeatherState(weatherCode, isDay);

  const maxTemp = weatherData?.daily?.temperature_2m_max?.[0];
  const minTemp = weatherData?.daily?.temperature_2m_min?.[0];

  return (
    <div className="app-container">
      {/* Dynamic weather-themed micro-animation styles */}
      <WeatherIconStyles />

      {/* Decorative ambient gradient backdrop layers */}
      <div className="ambient-glow" />
      <div className="ambient-glow-2" />

      <header>
        <div className="logo-section">
          <h1>weather.</h1>
        </div>

        <div className="header-actions">
          <CitySearch onSelectCity={setActiveCity} />

          <div className="unit-toggle" onClick={() => setIsCelsius(!isCelsius)}>
            <button className={`unit-btn ${isCelsius ? 'active' : ''}`}>°C</button>
            <button className={`unit-btn ${!isCelsius ? 'active' : ''}`}>°F</button>
          </div>
        </div>
      </header>

      {error && (
        <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center', borderColor: '#f87171', color: '#f87171', zIndex: 10 }}>
          <p style={{ fontWeight: 600 }}>Error loading weather forecast:</p>
          <p style={{ fontSize: '0.9rem', marginTop: '0.25rem' }}>{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner" />
          <p style={{ fontWeight: 500, letterSpacing: '0.02em' }}>Fetching Forecast Details...</p>
        </div>
      ) : (
        weatherData && (
          <div className="dashboard-grid">
            <div className="sidebar">
              {/* Pinned Locations widget */}
              <Favorites 
                favorites={favorites}
                activeCity={activeCity}
                onSelectCity={setActiveCity}
                onRemoveFavorite={handleRemoveFavorite}
                isCelsius={isCelsius}
              />
            </div>

            <div className="main-content">
              {/* Primary highlight summary section */}
              <div className="hero-weather-grid">
                <div className="glass-card weather-hero">
                  <div className="hero-main">
                    <div className="hero-temp-section">
                      <span className="hero-city">{activeCity.name}</span>
                      <span className="hero-country">
                        {activeCity.admin1 ? `${activeCity.admin1}, ` : ''}
                        {activeCity.country}
                        
                        <button 
                          className={`pin-btn ${isCurrentPinned ? 'pinned' : ''}`}
                          onClick={handleToggleFavorite}
                          title={isCurrentPinned ? 'Unpin this city' : 'Pin this city'}
                          style={{ marginLeft: '4px', verticalAlign: 'middle' }}
                        >
                          <svg style={{ width: '18px', height: '18px' }} viewBox="0 0 24 24" fill={isCurrentPinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                          </svg>
                        </button>
                      </span>

                      <span className="hero-temp">
                        {getDisplayTemp(currentTemp)}
                        <span className="hero-temp-unit">°</span>
                      </span>

                      <span className="hero-condition">{weatherState.label}</span>
                      
                      {maxTemp !== undefined && minTemp !== undefined && (
                        <span className="hero-hi-low">
                          H: {getDisplayTemp(maxTemp)}° &nbsp;L: {getDisplayTemp(minTemp)}°
                        </span>
                      )}
                    </div>

                    <div className="hero-icon-container">
                      {weatherState.icon}
                    </div>
                  </div>

                  <div className="hero-footer">
                    <span>Humidity: {weatherData.current.relative_humidity_2m}%</span>
                    <span>Wind Speed: {isCelsius ? `${Math.round(weatherData.current.wind_speed_10m)} km/h` : `${Math.round(weatherData.current.wind_speed_10m * 0.621371)} mph`}</span>
                  </div>
                </div>

                {/* Secondary details widget displaying other parameters */}
                <WeatherDetails 
                  current={weatherData.current} 
                  daily={weatherData.daily} 
                  isCelsius={isCelsius}
                />
              </div>

              {/* Visual custom SVG trend line chart */}
              <HourlyChart 
                hourlyData={weatherData.hourly} 
                isCelsius={isCelsius}
              />

              {/* 7-day row elements */}
              <DailyForecast 
                dailyData={weatherData.daily}
                isCelsius={isCelsius}
              />
            </div>
          </div>
        )
      )}

      <footer>
        <p>Powered by <a href="https://open-meteo.com" target="_blank" rel="noreferrer">Open-Meteo</a> &mdash; no API key required.</p>
      </footer>
    </div>
  );
}
