import React from 'react';
import { getWeatherState } from './WeatherIcons';

export default function DailyForecast({ dailyData, isCelsius }) {
  if (!dailyData || !dailyData.time || dailyData.time.length === 0) {
    return null;
  }

  // Format temperature
  const formatTemp = (t) => {
    const val = isCelsius ? t : (t * 9) / 5 + 32;
    return `${Math.round(val)}°`;
  };

  // Helper to get formatted day names (e.g., "Mon", "Tue", or "Today")
  const formatDayName = (dateStr, index) => {
    if (index === 0) return 'Today';
    
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  return (
    <div className="glass-card forecast-section">
      <h3>
        <svg style={{ width: '22px', height: '22px', color: 'var(--accent-color)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        7-Day Forecast
      </h3>
      <div className="forecast-row">
        {dailyData.time.map((timeStr, idx) => {
          const weatherCode = dailyData.weather_code[idx];
          // We assume day is active for the icon mapping preview
          const weather = getWeatherState(weatherCode, true);
          
          return (
            <div className="forecast-item" key={timeStr}>
              <span className="forecast-day">
                {formatDayName(timeStr, idx)}
              </span>
              
              <div className="forecast-condition-group">
                <div className="forecast-mini-icon">
                  {weather.icon}
                </div>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                  {weather.label}
                </span>
              </div>

              <span className="forecast-temps">
                <span className="forecast-max">
                  {formatTemp(dailyData.temperature_2m_max[idx])}
                </span>
                <span className="forecast-min">
                  {formatTemp(dailyData.temperature_2m_min[idx])}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
