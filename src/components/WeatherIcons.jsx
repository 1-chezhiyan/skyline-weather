import React from 'react';

// Custom CSS styles specifically for weather icon micro-animations
const animationStyles = `
  @keyframes rotate-sun {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes float-cloud {
    0%, 100% { transform: translateY(0px) translateX(0px); }
    50% { transform: translateY(-4px) translateX(2px); }
  }
  @keyframes rain-drip {
    0% { transform: translateY(-10px); opacity: 0; }
    50% { opacity: 0.8; }
    100% { transform: translateY(12px); opacity: 0; }
  }
  @keyframes snow-drift {
    0% { transform: translateY(-10px) translateX(0px); opacity: 0; }
    50% { opacity: 0.8; }
    100% { transform: translateY(12px) translateX(3px); opacity: 0; }
  }
  @keyframes lightning-flash {
    0%, 90%, 94%, 98%, 100% { opacity: 0.1; }
    92%, 96% { opacity: 1; filter: drop-shadow(0 0 8px #f59e0b); }
  }
  @keyframes fog-drift {
    0%, 100% { transform: translateX(0px); }
    50% { transform: translateX(6px); }
  }
  .anim-sun {
    transform-origin: 32px 32px;
    animation: rotate-sun 25s linear infinite;
  }
  .anim-cloud {
    animation: float-cloud 5s ease-in-out infinite;
  }
  .anim-cloud-back {
    animation: float-cloud 7s ease-in-out infinite reverse;
    opacity: 0.7;
  }
  .anim-rain-1 {
    animation: rain-drip 1.2s cubic-bezier(0.17, 0.67, 0.83, 0.67) infinite;
  }
  .anim-rain-2 {
    animation: rain-drip 1.2s cubic-bezier(0.17, 0.67, 0.83, 0.67) infinite;
    animation-delay: 0.4s;
  }
  .anim-rain-3 {
    animation: rain-drip 1.2s cubic-bezier(0.17, 0.67, 0.83, 0.67) infinite;
    animation-delay: 0.8s;
  }
  .anim-snow-1 {
    animation: snow-drift 2s linear infinite;
  }
  .anim-snow-2 {
    animation: snow-drift 2s linear infinite;
    animation-delay: 0.6s;
  }
  .anim-snow-3 {
    animation: snow-drift 2s linear infinite;
    animation-delay: 1.3s;
  }
  .anim-lightning {
    animation: lightning-flash 4s ease-in-out infinite;
  }
  .anim-fog-1 {
    animation: fog-drift 4s ease-in-out infinite;
  }
  .anim-fog-2 {
    animation: fog-drift 5s ease-in-out infinite reverse;
  }
`;

export const WeatherIconStyles = () => <style>{animationStyles}</style>;

export const SunIcon = ({ className = "w-full h-full" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="12" fill="url(#sun-gradient)" />
    <g className="anim-sun" stroke="url(#sun-gradient)" strokeWidth="3.5" strokeLinecap="round">
      <line x1="32" y1="5" x2="32" y2="11" />
      <line x1="32" y1="53" x2="32" y2="59" />
      <line x1="5" y1="32" x2="11" y2="32" />
      <line x1="53" y1="32" x2="59" y2="32" />
      <line x1="13" y1="13" x2="17.24" y2="17.24" />
      <line x1="46.76" y1="46.76" x2="51" y2="51" />
      <line x1="51" y1="13" x2="46.76" y2="17.24" />
      <line x1="17.24" y1="46.76" x2="13" y2="51" />
    </g>
    <defs>
      <linearGradient id="sun-gradient" x1="20" y1="20" x2="44" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#ea580c" />
      </linearGradient>
    </defs>
  </svg>
);

export const MoonIcon = ({ className = "w-full h-full" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M46.5 37.5C46.5 45.5 40 52 32 52C24.5 52 18.25 46.25 17.5 39C16.25 39.25 15.25 39.5 14 39.5C21.5 39.5 28.5 34.5 30.5 27.5C32.5 20.5 30.5 13.5 25.5 8.5C37.5 9.5 46.5 20 46.5 32.5Z" fill="url(#moon-gradient)" />
    <circle cx="15" cy="18" r="1.5" fill="#f8fafc" opacity="0.8" />
    <circle cx="48" cy="15" r="1" fill="#f8fafc" opacity="0.6" />
    <circle cx="52" cy="28" r="1.5" fill="#f8fafc" opacity="0.5" />
    <defs>
      <linearGradient id="moon-gradient" x1="15" y1="10" x2="46" y2="46" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#e2e8f0" />
        <stop offset="100%" stopColor="#64748b" />
      </linearGradient>
    </defs>
  </svg>
);

export const CloudyIcon = ({ className = "w-full h-full" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g className="anim-cloud-back">
      <path d="M46 34a7 7 0 00-6-6.8 9 9 0 00-17-2.2 8 8 0 00-7 7.9c0 4.5 3.6 8.1 8.1 8.1H40a6 6 0 006-7z" fill="url(#cloud-back-grad)" />
    </g>
    <g className="anim-cloud">
      <path d="M50 38a6 6 0 00-5.1-5.9 8 8 0 00-15.1-1.9 7 7 0 00-6.1 6.9c0 3.9 3.1 7.1 7.1 7.1H44a6 6 0 006-6.2z" fill="url(#cloud-front-grad)" />
    </g>
    <defs>
      <linearGradient id="cloud-front-grad" x1="20" y1="20" x2="45" y2="45" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#f8fafc" />
        <stop offset="100%" stopColor="#cbd5e1" />
      </linearGradient>
      <linearGradient id="cloud-back-grad" x1="15" y1="15" x2="38" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
    </defs>
  </svg>
);

export const PartlyCloudyIcon = ({ className = "w-full h-full", isDay = true }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g transform="translate(-4, -6)">
      {isDay ? <SunIcon className="w-10 h-10" /> : <MoonIcon className="w-10 h-10" />}
    </g>
    <g className="anim-cloud" transform="translate(4, 4)">
      <path d="M50 38a6 6 0 00-5.1-5.9 8 8 0 00-15.1-1.9 7 7 0 00-6.1 6.9c0 3.9 3.1 7.1 7.1 7.1H44a6 6 0 006-6.2z" fill="url(#partly-cloud-grad)" />
    </g>
    <defs>
      <linearGradient id="partly-cloud-grad" x1="20" y1="20" x2="45" y2="45" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#94a3b8" />
      </linearGradient>
    </defs>
  </svg>
);

export const RainyIcon = ({ className = "w-full h-full" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g className="anim-cloud">
      <path d="M48 30a6 6 0 00-5.1-5.9 8 8 0 00-15.1-1.9 7 7 0 00-6.1 6.9c0 3.9 3.1 7.1 7.1 7.1H42a6 6 0 006-6.2z" fill="url(#rain-cloud-grad)" />
    </g>
    <g stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round">
      <line x1="24" y1="44" x2="21" y2="52" className="anim-rain-1" />
      <line x1="32" y1="44" x2="29" y2="52" className="anim-rain-2" />
      <line x1="40" y1="44" x2="37" y2="52" className="anim-rain-3" />
    </g>
    <defs>
      <linearGradient id="rain-cloud-grad" x1="20" y1="15" x2="45" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#475569" />
      </linearGradient>
    </defs>
  </svg>
);

export const StormyIcon = ({ className = "w-full h-full" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g className="anim-cloud">
      <path d="M48 28a6 6 0 00-5.1-5.9 8 8 0 00-15.1-1.9 7 7 0 00-6.1 6.9c0 3.9 3.1 7.1 7.1 7.1H42a6 6 0 006-6.2z" fill="url(#storm-cloud-grad)" />
    </g>
    <path className="anim-lightning" d="M30 36 L24 45 L29 45 L25 54 L36 43 L31 43 Z" fill="#fbbf24" />
    <g stroke="#60a5fa" strokeWidth="2.2" strokeLinecap="round">
      <line x1="20" y1="42" x2="18" y2="48" className="anim-rain-1" />
      <line x1="39" y1="42" x2="37" y2="48" className="anim-rain-3" />
    </g>
    <defs>
      <linearGradient id="storm-cloud-grad" x1="20" y1="12" x2="45" y2="38" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#475569" />
        <stop offset="100%" stopColor="#1e293b" />
      </linearGradient>
    </defs>
  </svg>
);

export const SnowyIcon = ({ className = "w-full h-full" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g className="anim-cloud">
      <path d="M48 30a6 6 0 00-5.1-5.9 8 8 0 00-15.1-1.9 7 7 0 00-6.1 6.9c0 3.9 3.1 7.1 7.1 7.1H42a6 6 0 006-6.2z" fill="url(#snow-cloud-grad)" />
    </g>
    <g fill="#e2e8f0">
      <circle cx="23" cy="45" r="2.2" className="anim-snow-1" />
      <circle cx="32" cy="45" r="2.2" className="anim-snow-2" />
      <circle cx="41" cy="45" r="2.2" className="anim-snow-3" />
    </g>
    <defs>
      <linearGradient id="snow-cloud-grad" x1="20" y1="15" x2="45" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#cbd5e1" />
        <stop offset="100%" stopColor="#64748b" />
      </linearGradient>
    </defs>
  </svg>
);

export const FogIcon = ({ className = "w-full h-full" }) => (
  <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g stroke="url(#fog-grad)" strokeWidth="4.5" strokeLinecap="round">
      <line x1="16" y1="20" x2="48" y2="20" className="anim-fog-1" />
      <line x1="12" y1="28" x2="52" y2="28" className="anim-fog-2" />
      <line x1="18" y1="36" x2="46" y2="36" className="anim-fog-1" />
      <line x1="14" y1="44" x2="50" y2="44" className="anim-fog-2" />
    </g>
    <defs>
      <linearGradient id="fog-grad" x1="12" y1="20" x2="52" y2="44" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#94a3b8" />
        <stop offset="100%" stopColor="#475569" opacity="0.6" />
      </linearGradient>
    </defs>
  </svg>
);

// Map standard WMO weather codes to a nice clean category and SVG icon
export const getWeatherState = (code, isDay = true) => {
  // WMO code list: https://open-meteo.com/en/docs
  if (code === 0) {
    return {
      label: 'clear sky',
      icon: isDay ? <SunIcon /> : <MoonIcon />,
      themeClass: 'theme-clear'
    };
  } else if (code === 1 || code === 2) {
    return {
      label: code === 1 ? 'mainly clear' : 'partly cloudy',
      icon: <PartlyCloudyIcon isDay={isDay} />,
      themeClass: 'theme-clear'
    };
  } else if (code === 3) {
    return {
      label: 'overcast',
      icon: <CloudyIcon />,
      themeClass: 'theme-cloudy'
    };
  } else if (code === 45 || code === 48) {
    return {
      label: 'foggy',
      icon: <FogIcon />,
      themeClass: 'theme-cloudy'
    };
  } else if (code >= 51 && code <= 57) {
    return {
      label: 'drizzle',
      icon: <RainyIcon />,
      themeClass: 'theme-rainy'
    };
  } else if (code >= 61 && code <= 67) {
    return {
      label: 'rainy',
      icon: <RainyIcon />,
      themeClass: 'theme-rainy'
    };
  } else if (code >= 71 && code <= 77) {
    return {
      label: 'snowing',
      icon: <SnowyIcon />,
      themeClass: 'theme-snowy'
    };
  } else if (code >= 80 && code <= 82) {
    return {
      label: 'rain showers',
      icon: <RainyIcon />,
      themeClass: 'theme-rainy'
    };
  } else if (code === 85 || code === 86) {
    return {
      label: 'snow showers',
      icon: <SnowyIcon />,
      themeClass: 'theme-snowy'
    };
  } else if (code >= 95 && code <= 99) {
    return {
      label: 'thunderstorm',
      icon: <StormyIcon />,
      themeClass: 'theme-stormy'
    };
  }

  // Fallback
  return {
    label: 'cloudy',
    icon: <CloudyIcon />,
    themeClass: 'theme-cloudy'
  };
};
