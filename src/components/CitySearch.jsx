import React, { useState, useEffect, useRef } from 'react';

export default function CitySearch({ onSelectCity }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Debounced geocoding fetching
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/api/search?name=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Search failed');
        }
        const data = await response.json();
        setResults(data.results || []);
      } catch (err) {
        console.error('Error searching for city:', err);
      } finally {
        setIsLoading(false);
      }
    }, 400); // 400ms debounce interval

    return () => clearTimeout(delayDebounce);
  }, [query]);

  // Click outside detection to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (city) => {
    onSelectCity({
      name: city.name,
      country: city.country,
      countryCode: city.country_code,
      admin1: city.admin1,
      lat: city.latitude,
      lon: city.longitude,
      timezone: city.timezone
    });
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className="search-container" ref={containerRef}>
      <div className="search-input-wrapper">
        <svg className="search-icon-left" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        
        <input
          type="text"
          className="search-input"
          placeholder="Search for cities..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />
        
        {isLoading && <div className="search-spinner" />}
      </div>

      {isOpen && query.trim().length >= 2 && (
        <div className="search-results-dropdown">
          {isLoading ? (
            <div className="no-results">Searching...</div>
          ) : results.length > 0 ? (
            results.map((city) => (
              <button
                key={`${city.id}-${city.latitude}`}
                className="search-result-item"
                onClick={() => handleSelect(city)}
              >
                <span className="result-city">
                  {city.name}
                  {city.country_code && (
                    <span style={{ marginLeft: '8px', opacity: 0.6 }}>
                      {city.country_code.toUpperCase()}
                    </span>
                  )}
                </span>
                {(city.admin1 || city.country) && (
                  <span className="result-admin">
                    {[city.admin1, city.country].filter(Boolean).join(', ')}
                  </span>
                )}
              </button>
            ))
          ) : (
            <div className="no-results">No cities found</div>
          )}
        </div>
      )}
    </div>
  );
}
