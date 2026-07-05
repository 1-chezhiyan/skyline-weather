import React from 'react';

export default function WeatherDetails({ current, daily, isCelsius }) {
  if (!current) return null;

  // Format Apparent Temp (Feels Like)
  const formatApparentTemp = (t) => {
    const val = isCelsius ? t : (t * 9) / 5 + 32;
    return `${Math.round(val)}°${isCelsius ? 'C' : 'F'}`;
  };

  // Format Wind Speed
  const formatWindSpeed = (speed) => {
    const val = isCelsius ? speed : speed * 0.621371; // km/h to mph
    return `${Math.round(val)} ${isCelsius ? 'km/h' : 'mph'}`;
  };

  // Helper to extract clean hour/min from ISO timestamp
  const formatSunTime = (isoString) => {
    if (!isoString) return '--:--';
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // Extract UV Index max for the day
  const uvMax = daily && daily.uv_index_max ? daily.uv_index_max[0] : '--';

  // Extract Sunrise and Sunset
  const sunrise = daily && daily.sunrise ? formatSunTime(daily.sunrise[0]) : '--:--';
  const sunset = daily && daily.sunset ? formatSunTime(daily.sunset[0]) : '--:--';

  const detailsList = [
    {
      label: 'Feels Like',
      value: formatApparentTemp(current.apparent_temperature),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="detail-icon">
          <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
        </svg>
      )
    },
    {
      label: 'Humidity',
      value: `${current.relative_humidity_2m}%`,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="detail-icon">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      )
    },
    {
      label: 'Wind',
      value: formatWindSpeed(current.wind_speed_10m),
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="detail-icon">
          <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
        </svg>
      )
    },
    {
      label: 'Pressure',
      value: `${Math.round(current.pressure_msl)} hPa`,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="detail-icon">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    },
    {
      label: 'UV Index',
      value: `${uvMax}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="detail-icon">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      )
    },
    {
      label: 'Sun Cycle',
      value: `${sunrise} / ${sunset}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="detail-icon">
          <path d="M17 18a5 5 0 0 0-10 0" />
          <line x1="12" y1="2" x2="12" y2="9" />
          <line x1="4.22" y1="10.22" x2="5.64" y2="11.64" />
          <line x1="19.78" y1="10.22" x2="18.36" y2="11.64" />
          <line x1="2" y1="18" x2="5" y2="18" />
          <line x1="19" y1="18" x2="22" y2="18" />
        </svg>
      )
    }
  ];

  return (
    <div className="glass-card main-details-card">
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.3rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <svg style={{ width: '22px', height: '22px', color: 'var(--accent-color)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="9" y1="3" x2="9" y2="21" />
          <line x1="15" y1="3" x2="15" y2="21" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="3" y1="15" x2="21" y2="15" />
        </svg>
        Secondary Highlights
      </h3>
      <div className="details-grid">
        {detailsList.map((detail, index) => (
          <div className="detail-card" key={`weather-detail-${index}`}>
            {detail.icon}
            <span className="detail-label">{detail.label}</span>
            <span className="detail-value">{detail.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
