import React from 'react';

export default function HourlyChart({ hourlyData, isCelsius }) {
  if (!hourlyData || !hourlyData.time || hourlyData.time.length === 0) {
    return null;
  }

  // Slice to show the first 24 hours of data
  const times = hourlyData.time.slice(0, 24);
  const temps = hourlyData.temperature_2m.slice(0, 24);

  // Helper: format temperature
  const formatTemp = (t) => {
    const val = isCelsius ? t : (t * 9) / 5 + 32;
    return `${Math.round(val)}°`;
  };

  // SVG dimensions
  const width = 800;
  const height = 140;
  const paddingX = 40;
  const paddingY = 25;

  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const tempDiff = maxTemp - minTemp || 1;

  // Map temperatures to SVG Y coordinates
  const getY = (temp) => {
    const scale = (height - paddingY * 2) / tempDiff;
    return height - paddingY - (temp - minTemp) * scale;
  };

  // Map indices to SVG X coordinates
  const getX = (index) => {
    const scale = (width - paddingX * 2) / (times.length - 1);
    return paddingX + index * scale;
  };

  // Construct SVG Path points
  const points = temps.map((t, idx) => ({ x: getX(idx), y: getY(t) }));
  
  // Construct the line path string
  const linePath = points.reduce((path, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
  }, '');

  // Construct the closed area path string for the gradient fill
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : '';

  // Select a subset of nodes to display text labels to avoid overcrowding (every 3 hours)
  const labelsToShow = [];
  for (let i = 0; i < points.length; i += 3) {
    labelsToShow.push(i);
  }
  // Ensure the last hour is also shown
  if (labelsToShow[labelsToShow.length - 1] !== points.length - 1) {
    labelsToShow.push(points.length - 1);
  }

  // Format date string to display hour format (e.g., 09:00, 15:00)
  const formatTime = (timeStr) => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div className="glass-card chart-section">
      <h3>
        <svg style={{ width: '22px', height: '22px', color: 'var(--accent-color)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        Hourly Forecast (Next 24h)
      </h3>
      <div className="chart-container">
        <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-color)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--accent-color)" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Grid lines for threshold markers */}
          <line x1={paddingX} y1={getY(minTemp)} x2={width - paddingX} y2={getY(minTemp)} className="chart-grid" strokeDasharray="4,4" />
          <line x1={paddingX} y1={getY(maxTemp)} x2={width - paddingX} y2={getY(maxTemp)} className="chart-grid" strokeDasharray="4,4" />

          {/* SVG Area and Line paths */}
          <path d={areaPath} className="chart-area" />
          <path d={linePath} className="chart-line" />

          {/* Active Data Nodes and Text Labels */}
          {points.map((p, idx) => {
            const isLabel = labelsToShow.includes(idx);
            if (!isLabel) return null;

            return (
              <g key={`chart-node-${idx}`}>
                <circle cx={p.x} cy={p.y} r="4.5" className="chart-node" />
                
                {/* Temperature label above node */}
                <text x={p.x} y={p.y - 12} className="chart-temp-text">
                  {formatTemp(temps[idx])}
                </text>
                
                {/* Time label below chart grid */}
                <text x={p.x} y={height - 6} className="chart-text">
                  {formatTime(times[idx])}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
