import React, { useState, useEffect } from 'react';

export default function Favorites({ favorites, activeCity, onSelectCity, onRemoveFavorite, isCelsius }) {
  const [temperatures, setTemperatures] = useState({});

  // Fetch current temperature for all favorites to make the sidebar look extremely live and premium!
  useEffect(() => {
    if (!favorites || favorites.length === 0) return;

    let isMounted = true;
    const fetchTemperatures = async () => {
      const temps = {};
      await Promise.all(
        favorites.map(async (city) => {
          try {
            const response = await fetch(
              `http://localhost:5000/api/weather?lat=${city.lat}&lon=${city.lon}`
            );
            if (response.ok) {
              const data = await response.json();
              if (data && data.current) {
                temps[city.lat + '-' + city.lon] = data.current.temperature_2m;
              }
            }
          } catch (err) {
            console.error('Error fetching temp for favorite:', city.name, err);
          }
        })
      );

      if (isMounted) {
        setTemperatures(temps);
      }
    };

    fetchTemperatures();

    // Refresh temperatures every 5 minutes
    const interval = setInterval(fetchTemperatures, 5 * 60 * 1000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [favorites]);

  const formatTemp = (temp) => {
    if (temp === undefined) return '--°';
    const val = isCelsius ? temp : (temp * 9) / 5 + 32;
    return `${Math.round(val)}°`;
  };

  return (
    <div className="glass-card favorites-section">
      <h3>
        <svg style={{ width: '22px', height: '22px', color: 'var(--accent-color)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
        Pinned Locations
      </h3>
      {favorites.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          No pinned locations yet. Search for a city and click the bookmark icon to save!
        </div>
      ) : (
        <div className="fav-list">
          {favorites.map((city) => {
            const isSelected = activeCity && activeCity.lat === city.lat && activeCity.lon === city.lon;
            const tempKey = city.lat + '-' + city.lon;
            
            return (
              <div 
                className={`fav-card ${isSelected ? 'active' : ''}`}
                key={tempKey}
                onClick={() => onSelectCity(city)}
              >
                <div className="fav-info">
                  <span className="fav-name">{city.name}</span>
                  <span className="fav-country">
                    {[city.admin1, city.countryCode?.toUpperCase()].filter(Boolean).join(', ')}
                  </span>
                </div>
                
                <div className="fav-right">
                  <span className="fav-temp">
                    {formatTemp(temperatures[tempKey])}
                  </span>
                  <button 
                    className="pin-btn pinned"
                    onClick={(e) => {
                      e.stopPropagation(); // Avoid triggering city switch
                      onRemoveFavorite(city);
                    }}
                    title="Unpin location"
                  >
                    <svg style={{ width: '16px', height: '16px' }} viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
