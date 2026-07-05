// =============================================================
//  Skyline — Complete Application Logic
//  Features: geolocation, search, weather API, AQI, charts,
//  sun arc, golden hour timer, compass rose, moon phase,
//  time-of-day gradient, weather alerts, world clock,
//  drag-to-reorder, click-to-copy, share card, / shortcut
// =============================================================

// ─── State ───────────────────────────────────────────────────
const state = {
    latitude:       40.7128,
    longitude:     -74.0060,
    locationName:  'New York, USA',
    timezone:      'America/New_York',
    unit:          'C',
    savedLocations: [],
    weatherData:    null,
    aqiData:        null,
    chart:          null,
    searchTimeout:  null,
    goldenTimer:    null,
    dragStartIdx:   null,
    themePreset:    'slate',
    themeAccent:    '#8fb4f8',
    themeBg:        '#2a2f42',
    themeFont:      "'Montserrat', system-ui, sans-serif"
};

// ─── Theme Presets (Premium Palettes) ─────────────────────────
const THEME_PRESETS = {
    slate:    { name: 'Nord (Slate)', hue: 232, vars: { '--bg-base': '#2a2f42', '--bg-panel': '#32374d', '--bg-panel-hover': '#3a405a', '--bg-input': '#232838', '--bg-accent-dim': '#2d3247', '--border': '#4d5370', '--border-subtle': '#3c425c', '--border-active': '#6c7496', '--text-primary': '#d4d8ef', '--text-secondary': '#8c91ae', '--text-muted': '#5f6482', '--accent': '#8fb4f8' } },
    midnight: { name: 'Tokyo Night',  hue: 235, vars: { '--bg-base': '#1a1b26', '--bg-panel': '#24283b', '--bg-panel-hover': '#292e42', '--bg-input': '#16161e', '--bg-accent-dim': '#292e42', '--border': '#414868', '--border-subtle': '#292e42', '--border-active': '#565f89', '--text-primary': '#c0caf5', '--text-secondary': '#a9b1d6', '--text-muted': '#565f89', '--accent': '#7aa2f7' } },
    forest:   { name: 'Everforest',   hue: 150, vars: { '--bg-base': '#2b3339', '--bg-panel': '#323c41', '--bg-panel-hover': '#3a454a', '--bg-input': '#232a2e', '--bg-accent-dim': '#3a454a', '--border': '#4a5b5e', '--border-subtle': '#3a454a', '--border-active': '#5c7275', '--text-primary': '#d3c6aa', '--text-secondary': '#9da9a0', '--text-muted': '#859289', '--accent': '#a7c080' } },
    rose:     { name: 'Rosé Pine',    hue: 345, vars: { '--bg-base': '#191724', '--bg-panel': '#1f1d2e', '--bg-panel-hover': '#26233a', '--bg-input': '#1f1d2e', '--bg-accent-dim': '#26233a', '--border': '#44415a', '--border-subtle': '#26233a', '--border-active': '#6e6a86', '--text-primary': '#e0def4', '--text-secondary': '#908caa', '--text-muted': '#6e6a86', '--accent': '#ebbcba' } },
    amber:    { name: 'Gruvbox',      hue: 35,  vars: { '--bg-base': '#282828', '--bg-panel': '#3c3836', '--bg-panel-hover': '#504945', '--bg-input': '#1d2021', '--bg-accent-dim': '#504945', '--border': '#665c54', '--border-subtle': '#504945', '--border-active': '#7c6f64', '--text-primary': '#ebdbb2', '--text-secondary': '#bdae93', '--text-muted': '#928374', '--accent': '#fabd2f' } },
    ocean:    { name: 'Catppuccin',   hue: 230, vars: { '--bg-base': '#1e1e2e', '--bg-panel': '#313244', '--bg-panel-hover': '#45475a', '--bg-input': '#181825', '--bg-accent-dim': '#45475a', '--border': '#585b70', '--border-subtle': '#45475a', '--border-active': '#7f849c', '--text-primary': '#cdd6f4', '--text-secondary': '#bac2de', '--text-muted': '#a6adc8', '--accent': '#89b4fa' } },
    mono:     { name: 'Vercel Mono',  hue: 0,   vars: { '--bg-base': '#000000', '--bg-panel': '#111111', '--bg-panel-hover': '#222222', '--bg-input': '#0a0a0a', '--bg-accent-dim': '#222222', '--border': '#333333', '--border-subtle': '#222222', '--border-active': '#666666', '--text-primary': '#ffffff', '--text-secondary': '#a0a0a0', '--text-muted': '#666666', '--accent': '#ffffff' } }
};

// ─── WMO Weather Code Map ─────────────────────────────────────
const WMO = {
    0:  { label: 'Clear Sky',             icon: 'sun',             bg: 'sunny'  },
    1:  { label: 'Mainly Clear',          icon: 'cloud-sun',       bg: 'sunny'  },
    2:  { label: 'Partly Cloudy',         icon: 'cloud',           bg: 'cloudy' },
    3:  { label: 'Overcast',             icon: 'cloudy',           bg: 'cloudy' },
    45: { label: 'Foggy',                icon: 'wind',             bg: 'cloudy' },
    48: { label: 'Rime Fog',             icon: 'wind',             bg: 'cloudy' },
    51: { label: 'Light Drizzle',        icon: 'cloud-drizzle',   bg: 'rainy'  },
    53: { label: 'Moderate Drizzle',     icon: 'cloud-drizzle',   bg: 'rainy'  },
    55: { label: 'Dense Drizzle',        icon: 'cloud-drizzle',   bg: 'rainy'  },
    56: { label: 'Freezing Drizzle',     icon: 'cloud-snow',      bg: 'snowy'  },
    57: { label: 'Heavy Frz. Drizzle',   icon: 'cloud-snow',      bg: 'snowy'  },
    61: { label: 'Slight Rain',          icon: 'cloud-rain',      bg: 'rainy'  },
    63: { label: 'Moderate Rain',        icon: 'cloud-rain',      bg: 'rainy'  },
    65: { label: 'Heavy Rain',           icon: 'cloud-lightning', bg: 'rainy'  },
    66: { label: 'Freezing Rain',        icon: 'cloud-snow',      bg: 'snowy'  },
    67: { label: 'Heavy Frz. Rain',      icon: 'cloud-snow',      bg: 'snowy'  },
    71: { label: 'Slight Snow',          icon: 'snowflake',       bg: 'snowy'  },
    73: { label: 'Moderate Snow',        icon: 'snowflake',       bg: 'snowy'  },
    75: { label: 'Heavy Snow',           icon: 'snowflake',       bg: 'snowy'  },
    77: { label: 'Snow Grains',          icon: 'snowflake',       bg: 'snowy'  },
    80: { label: 'Rain Showers',         icon: 'cloud-rain',      bg: 'rainy'  },
    81: { label: 'Heavy Showers',        icon: 'cloud-rain',      bg: 'rainy'  },
    82: { label: 'Violent Showers',      icon: 'cloud-lightning', bg: 'rainy'  },
    85: { label: 'Snow Showers',         icon: 'cloud-snow',      bg: 'snowy'  },
    86: { label: 'Heavy Snow Showers',   icon: 'cloud-snow',      bg: 'snowy'  },
    95: { label: 'Thunderstorm',         icon: 'cloud-lightning', bg: 'rainy'  },
    96: { label: 'Storm + Hail',         icon: 'cloud-lightning', bg: 'rainy'  },
    99: { label: 'Storm + Heavy Hail',   icon: 'cloud-lightning', bg: 'rainy'  }
};

// ─── DOM Helpers ──────────────────────────────────────────────
const $ = id => document.getElementById(id);

// ─── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadSavedLocations();
    updateDateTime();
    updateMoonWidget();
    applyTimeOfDayGradient();
    setupEventListeners();
    detectUserLocation();

    setInterval(updateDateTime,          60_000);
    setInterval(updateSavedLocationTimes,60_000);
    setInterval(applyTimeOfDayGradient,  60_000);
    setInterval(updateMoonWidget,     3_600_000);
});

// ─── Event Listeners ──────────────────────────────────────────
function setupEventListeners() {
    // Units
    $('unit-c').addEventListener('click', () => setUnit('C'));
    $('unit-f').addEventListener('click', () => setUnit('F'));

    // Geolocation
    $('geo-btn').addEventListener('click', detectUserLocation);

    // Save / Refresh / Share
    $('save-location-btn').addEventListener('click', toggleSaveLocation);
    $('refresh-btn').addEventListener('click', () => {
        const btn = $('refresh-btn');
        btn.classList.add('spinning');
        fetchWeatherData().finally(() => btn.classList.remove('spinning'));
    });
    $('share-btn').addEventListener('click', shareWeatherCard);

    // Error close
    $('close-error').addEventListener('click', () => $('error-banner').classList.add('hidden'));

    // Search autocomplete
    const searchInput = $('search-input');
    const searchResults = $('search-results');

    searchInput.addEventListener('input', e => {
        clearTimeout(state.searchTimeout);
        const q = e.target.value.trim();
        if (q.length < 3) { searchResults.classList.add('hidden'); return; }
        state.searchTimeout = setTimeout(() => searchCities(q), 380);
    });

    document.addEventListener('click', e => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.classList.add('hidden');
        }
    });

    // '/' — focus search box shortcut
    document.addEventListener('keydown', e => {
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
        }
        if (e.key === 'Escape') {
            searchInput.blur();
            searchResults.classList.add('hidden');
        }
    });

    // Click-to-copy temperature
    $('temp-display-clickable').addEventListener('click', () => {
        const val = `${$('current-temp').textContent}°${state.unit}`;
        navigator.clipboard.writeText(val)
            .then(() => showCopyToast(val))
            .catch(() => showCopyToast(val)); // still show toast
    });

    // Theme Panel
    const tp = $('theme-panel');
    const to = $('theme-overlay');

    const openTheme = () => {
        tp.classList.remove('hidden');
        to.classList.remove('hidden');
    };
    const closeTheme = () => {
        tp.classList.add('hidden');
        to.classList.add('hidden');
    };

    $('theme-btn').addEventListener('click', openTheme);
    $('theme-close').addEventListener('click', closeTheme);
    to.addEventListener('click', closeTheme);

    // Theme inputs
    $('custom-accent').addEventListener('input', e => applyTheme('custom', null, null, e.target.value));
    $('custom-bg').addEventListener('input', e => applyTheme('custom', e.target.value, null, null));
    $('custom-font').addEventListener('change', e => applyTheme(state.themePreset, null, e.target.value, null));
    $('theme-reset').addEventListener('click', () => applyTheme('slate', null, "'Montserrat', system-ui, sans-serif", null));
}

// ─── Theme Engine ─────────────────────────────────────────────
function hexToHSL(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
    
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;

    let cmax = Math.max(r, g, b), cmin = Math.min(r, g, b);
    let delta = cmax - cmin, h = 0, s = 0, l = 0;

    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);
    return { h, s, l };
}

function loadTheme() {
    const saved = localStorage.getItem('themeSettings');
    if (saved) {
        const t = JSON.parse(saved);
        applyTheme(t.preset, t.bg, t.font, t.accent);
    } else {
        applyTheme('slate');
    }
}

function saveTheme() {
    localStorage.setItem('themeSettings', JSON.stringify({
        preset: state.themePreset,
        bg: state.themeBg,
        font: state.themeFont,
        accent: state.themeAccent
    }));
}

function applyTheme(presetOrCustom, customBg = null, customFont = null, customAccent = null) {
    const root = document.documentElement;

    if (customFont !== null) state.themeFont = customFont;
    root.style.setProperty('--font-mono', state.themeFont);
    
    // Update chart font if it exists
    if (state.chart) {
        renderChart(state.weatherData.hourly, new Date().getHours());
    }

    if (presetOrCustom !== 'custom' && THEME_PRESETS[presetOrCustom]) {
        state.themePreset = presetOrCustom;
        state.themeBg     = THEME_PRESETS[presetOrCustom].vars['--bg-base'];
        state.themeAccent = THEME_PRESETS[presetOrCustom].vars['--accent'];

        const vars = THEME_PRESETS[presetOrCustom].vars;
        for (const [k, v] of Object.entries(vars)) {
            root.style.setProperty(k, v);
        }
    } else {
        state.themePreset = 'custom';
        if (customBg !== null) state.themeBg = customBg;
        if (customAccent !== null) state.themeAccent = customAccent;

        const { h, s, l } = hexToHSL(state.themeBg);

        // Derive palette from base lightness
        root.style.setProperty('--bg-base',        `hsl(${h}, ${s}%, ${l}%)`);
        root.style.setProperty('--bg-panel',       `hsl(${h}, ${s}%, ${Math.min(100, l + 5)}%)`);
        root.style.setProperty('--bg-panel-hover', `hsl(${h}, ${s}%, ${Math.min(100, l + 9)}%)`);
        root.style.setProperty('--bg-input',       `hsl(${h}, ${s}%, ${Math.max(0, l - 3)}%)`);
        root.style.setProperty('--bg-accent-dim',  `hsl(${h}, ${s}%, ${Math.min(100, l + 9)}%)`);

        root.style.setProperty('--border',         `hsl(${h}, ${s}%, ${Math.min(100, l + 13)}%)`);
        root.style.setProperty('--border-subtle',  `hsl(${h}, ${s}%, ${Math.min(100, l + 7)}%)`);
        root.style.setProperty('--border-active',  `hsl(${h}, ${s}%, ${Math.min(100, l + 30)}%)`);

        root.style.setProperty('--text-primary',   '#d4d8ef');
        root.style.setProperty('--text-secondary', '#8c91ae');
        root.style.setProperty('--text-muted',     '#5f6482');

        root.style.setProperty('--accent', state.themeAccent);
    }

    // Update inputs
    $('custom-accent').value = state.themeAccent;
    $('custom-accent-hex').textContent = state.themeAccent;
    if ($('custom-bg')) {
        $('custom-bg').value = state.themeBg;
        $('custom-bg-hex').textContent = state.themeBg;
    }
    if ($('custom-font')) {
        $('custom-font').value = state.themeFont;
    }

    saveTheme();
    renderThemePresets();
}

function renderThemePresets() {
    const grid = $('theme-presets-grid');
    grid.innerHTML = '';

    Object.entries(THEME_PRESETS).forEach(([key, preset]) => {
        const btn = document.createElement('button');
        btn.className = `preset-btn ${state.themePreset === key ? 'active' : ''}`;
        btn.innerHTML = `<div class="preset-swatch" style="background:${preset.vars['--accent']}"></div> ${preset.name}`;
        btn.addEventListener('click', () => applyTheme(key));
        grid.appendChild(btn);
    });
}

// ─── Date & Time ──────────────────────────────────────────────
function updateDateTime() {
    const now = new Date();
    $('current-date').textContent = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });
    $('current-time').textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

// ─── Moon Phase ────────────────────────────────────────────────
function getMoonPhase(date = new Date()) {
    // Reference new moon: 6 Jan 2000 18:14 UTC
    const knownNew  = new Date('2000-01-06T18:14:00Z');
    const synodic   = 29.53058770576; // days
    const elapsed   = (date - knownNew) / 86_400_000; // days
    const phase     = (((elapsed % synodic) + synodic) % synodic) / synodic; // 0–1

    const illumination = Math.round((1 - Math.cos(phase * 2 * Math.PI)) / 2 * 100);

    const p = phase * 8;
    let phaseName, emoji;
    if      (p < 0.5 || p >= 7.5) { phaseName = 'New Moon';        emoji = '🌑'; }
    else if (p < 1.5)              { phaseName = 'Waxing Crescent'; emoji = '🌒'; }
    else if (p < 2.5)              { phaseName = 'First Quarter';   emoji = '🌓'; }
    else if (p < 3.5)              { phaseName = 'Waxing Gibbous';  emoji = '🌔'; }
    else if (p < 4.5)              { phaseName = 'Full Moon';        emoji = '🌕'; }
    else if (p < 5.5)              { phaseName = 'Waning Gibbous';  emoji = '🌖'; }
    else if (p < 6.5)              { phaseName = 'Last Quarter';    emoji = '🌗'; }
    else                           { phaseName = 'Waning Crescent'; emoji = '🌘'; }

    return { phase, phaseName, emoji, illumination };
}

function updateMoonWidget() {
    const { phaseName, emoji, illumination } = getMoonPhase();
    $('moon-visual').textContent       = emoji;
    $('moon-phase-name').textContent   = phaseName;
    $('moon-illumination').textContent = `${illumination}% illuminated`;
}

// ─── Time-of-Day Gradient ──────────────────────────────────────
function applyTimeOfDayGradient() {
    // If we're using a custom theme, we skip this to respect the user's hue
    if (state.themePreset !== 'slate' && state.themePreset !== 'custom') return;

    const h = new Date().getHours();
    let base, sidebar;

    if      (h >= 22 || h <  5) { base = '#24293b'; sidebar = '#1d2230'; } // night
    else if (h <  7)             { base = '#312d42'; sidebar = '#27233a'; } // pre-dawn
    else if (h < 10)             { base = '#373c54'; sidebar = '#2e3247'; } // morning
    else if (h < 16)             { base = '#3c4060'; sidebar = '#313555'; } // midday
    else if (h < 18)             { base = '#3b3c58'; sidebar = '#313050'; } // afternoon
    else if (h < 20)             { base = '#3e3252'; sidebar = '#332845'; } // dusk
    else                         { base = '#2e3348'; sidebar = '#252839'; } // evening

    // If using slate or custom but want time of day, update:
    if (state.themePreset === 'slate') {
        document.documentElement.style.setProperty('--bg-base',  base);
        document.documentElement.style.setProperty('--bg-input', sidebar);
    }
}

// ─── Geolocation ──────────────────────────────────────────────
function detectUserLocation() {
    if (!navigator.geolocation) {
        showError('Geolocation unsupported. Loading New York.');
        fetchWeatherData();
        return;
    }
    navigator.geolocation.getCurrentPosition(
        pos => {
            state.latitude  = pos.coords.latitude;
            state.longitude = pos.coords.longitude;
            reverseGeocode(state.latitude, state.longitude);
        },
        () => {
            showError('Location denied. Showing New York.');
            fetchWeatherData();
        },
        { timeout: 5000, maximumAge: 0 }
    );
}

// ─── Geocoding ────────────────────────────────────────────────
async function searchCities(query) {
    try {
        const res  = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`);
        const data = await res.json();
        const sr   = $('search-results');

        if (!data.length) {
            sr.innerHTML = `<button class="search-item"><span class="name">No results found</span></button>`;
            sr.classList.remove('hidden');
            return;
        }

        sr.innerHTML = '';
        data.forEach(item => {
            const displayName = item.address.city || item.address.town || item.address.village || item.address.state || item.display_name.split(',')[0];
            const country     = item.address.country || '';
            const locStr      = country ? `${displayName}, ${country}` : displayName;

            const btn = document.createElement('button');
            btn.className = 'search-item';
            btn.innerHTML = `<span class="name">${displayName}</span><span class="country">${item.display_name}</span>`;
            btn.addEventListener('click', () => {
                state.latitude    = parseFloat(item.lat);
                state.longitude   = parseFloat(item.lon);
                state.locationName = locStr;
                sr.classList.add('hidden');
                $('search-input').value = '';
                fetchWeatherData();
            });
            sr.appendChild(btn);
        });
        sr.classList.remove('hidden');
    } catch (e) { console.error('Search error:', e); }
}

async function reverseGeocode(lat, lon) {
    try {
        const res  = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
        const data = await res.json();
        const addr = data.address;
        const city    = addr.city || addr.town || addr.village || addr.suburb || addr.state || 'My Location';
        const country = addr.country || '';
        state.locationName = country ? `${city}, ${country}` : city;
    } catch {
        state.locationName = 'My Location';
    }
    fetchWeatherData();
}

// ─── Weather API ──────────────────────────────────────────────
async function fetchWeatherData() {
    $('error-banner').classList.add('hidden');
    const { latitude: lat, longitude: lon } = state;

    const weatherUrl =
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current_weather=true` +
        `&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,weather_code,apparent_temperature,surface_pressure,wind_gusts_10m` +
        `&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum` +
        `&timezone=auto`;

    const aqiUrl =
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}` +
        `&hourly=us_aqi&timezone=auto`;

    try {
        const [wRes, aRes] = await Promise.all([fetch(weatherUrl), fetch(aqiUrl)]);
        if (!wRes.ok) throw new Error('Weather data unavailable.');
        if (!aRes.ok) throw new Error('Air quality data unavailable.');

        state.weatherData = await wRes.json();
        state.aqiData     = await aRes.json();

        // Persist timezone for world clock
        if (state.weatherData.timezone) {
            state.timezone = state.weatherData.timezone;
            const idx = state.savedLocations.findIndex(isCurrentLocation);
            if (idx >= 0 && !state.savedLocations[idx].timezone) {
                state.savedLocations[idx].timezone = state.timezone;
                saveLocationsToStorage();
            }
        }

        $('last-updated').textContent = `updated ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
        updateUI();

    } catch (err) {
        showError(err.message || 'Unable to retrieve weather data.');
    }
}

// ─── Unit Helpers ─────────────────────────────────────────────
function setUnit(u) {
    if (state.unit === u) return;
    state.unit = u;
    $('unit-c').classList.toggle('active', u === 'C');
    $('unit-f').classList.toggle('active', u === 'F');
    if (state.weatherData) updateUI();
}

function fmtTemp(c) {
    return state.unit === 'F' ? Math.round(c * 9 / 5 + 32) : Math.round(c);
}

function getWMO(code) {
    return WMO[code] || { label: 'Unknown', icon: 'help-circle', bg: 'sunny' };
}

// ─── Main UI Orchestration ────────────────────────────────────
function updateUI() {
    const current = state.weatherData.current_weather;
    const daily   = state.weatherData.daily;
    const hourly  = state.weatherData.hourly;
    const wmo     = getWMO(current.weathercode);
    const hIdx    = new Date().getHours();

    // Core weather info
    $('location-name').textContent   = state.locationName;
    $('weather-description').textContent = wmo.label;
    $('current-temp').textContent    = fmtTemp(current.temperature);
    $('temp-max').textContent        = fmtTemp(daily.temperature_2m_max[0]) + '°';
    $('temp-min').textContent        = fmtTemp(daily.temperature_2m_min[0]) + '°';

    // Feels like in hero card
    const feelsC = hourly.apparent_temperature?.[hIdx] ?? current.temperature;
    $('feels-like-temp').textContent = fmtTemp(feelsC) + '°';

    // Weather icon
    $('main-weather-icon').setAttribute('data-lucide', wmo.icon);

    // All sub-renders
    updateAtmosphere(wmo.bg);
    checkSavedState();
    render7DayForecast(daily);
    renderMetrics(current, daily, hourly, hIdx);
    renderChart(hourly, hIdx);
    renderSunArc(daily.sunrise[0], daily.sunset[0]);
    startGoldenHourTimer(daily.sunrise[0], daily.sunset[0]);
    renderAlerts(buildAlerts(current, daily, hourly, hIdx));
    renderSavedLocations();

    lucide.createIcons();
}

// ─── Atmosphere / Particles ───────────────────────────────────
function updateAtmosphere(themeClass) {
    document.body.className = themeClass;
    const rain = $('rain-layer'), snow = $('snow-layer');
    rain.innerHTML = snow.innerHTML = '';
    rain.style.opacity = snow.style.opacity = '0';

    if (themeClass === 'rainy') {
        rain.style.opacity = '1';
        for (let i = 0; i < 45; i++) {
            const d = document.createElement('div');
            d.className = 'rain-drop';
            d.style.cssText = `left:${Math.random()*100}%;animation-delay:${(Math.random()*2).toFixed(2)}s;animation-duration:${(0.5+Math.random()*0.4).toFixed(2)}s`;
            rain.appendChild(d);
        }
    } else if (themeClass === 'snowy') {
        snow.style.opacity = '1';
        for (let i = 0; i < 32; i++) {
            const f = document.createElement('div');
            f.className = 'snow-flake';
            const sz = (2 + Math.random() * 4).toFixed(1);
            f.style.cssText = `left:${Math.random()*100}%;width:${sz}px;height:${sz}px;animation-delay:${(Math.random()*5).toFixed(2)}s;animation-duration:${(3+Math.random()*5).toFixed(2)}s`;
            snow.appendChild(f);
        }
    }
}

// ─── Sun Arc ─────────────────────────────────────────────────
function renderSunArc(sunriseStr, sunsetStr) {
    const svgEl     = $('sun-arc-svg');
    if (!svgEl) return;

    const sunriseMs = new Date(sunriseStr).getTime();
    const sunsetMs  = new Date(sunsetStr).getTime();
    const nowMs     = Date.now();

    const W = 300, H = 120;
    const cx = W / 2, cy = H;
    const r  = H - 16;

    // Position: 0 = sunrise (left), 1 = sunset (right)
    const t      = (nowMs - sunriseMs) / (sunsetMs - sunriseMs);
    const isDay  = t >= 0 && t <= 1;
    const tClamp = Math.max(0, Math.min(1, t));

    // Arc angle: PI at sunrise, 0 at sunset
    const fullArc   = `M ${cx - r},${cy} A ${r},${r} 0 0,1 ${cx + r},${cy}`;
    const sunAngle  = Math.PI * (1 - tClamp);
    const sunX      = cx + r * Math.cos(sunAngle);
    const sunY      = cy - r * Math.sin(sunAngle);

    // Lit portion path
    const litPath   = `M ${cx - r},${cy} A ${r},${r} 0 0,1 ${sunX},${sunY}`;

    svgEl.innerHTML = `
        <line x1="${cx-r-8}" y1="${cy}" x2="${cx+r+8}" y2="${cy}" stroke="var(--border-subtle)" stroke-width="1"/>
        <path d="${fullArc}" fill="none" stroke="var(--border-subtle)" stroke-width="1.5" stroke-dasharray="3,3"/>
        ${isDay ? `<path d="${litPath}" fill="none" stroke="var(--accent-warm)" stroke-width="2" opacity="0.55"/>` : ''}
        <circle cx="${cx-r}" cy="${cy}" r="4" fill="var(--accent-warm)" opacity="0.5"/>
        <circle cx="${cx+r}" cy="${cy}" r="4" fill="var(--accent-rain)"  opacity="0.5"/>
        <circle cx="${sunX}" cy="${sunY}" r="${isDay ? 8 : 5}"
                fill="${isDay ? 'var(--accent-warm)' : 'var(--text-muted)'}"
                opacity="${isDay ? 0.9 : 0.3}"/>
        ${isDay ? `<circle cx="${sunX}" cy="${sunY}" r="16" fill="var(--accent-warm)" opacity="0.08"/>` : ''}
    `;

    const fmt = ms => new Date(ms).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    $('sun-rise-time').textContent = fmt(sunriseMs);
    $('sun-set-time').textContent  = fmt(sunsetMs);
}

// ─── Golden Hour Timer ────────────────────────────────────────
function startGoldenHourTimer(sunriseStr, sunsetStr) {
    if (state.goldenTimer) clearInterval(state.goldenTimer);

    const sunriseMs = new Date(sunriseStr).getTime();
    const sunsetMs  = new Date(sunsetStr).getTime();

    // Golden hour = ~60min after sunrise / ~60min before sunset
    const morningEnd   = sunriseMs + 60 * 60_000;
    const eveningStart = sunsetMs  - 60 * 60_000;

    function fmt(ms) {
        const total = Math.max(0, ms - Date.now());
        const h = Math.floor(total / 3_600_000);
        const m = Math.floor((total % 3_600_000) / 60_000);
        const s = Math.floor((total % 60_000) / 1_000);
        return h > 0 ? `${h}h ${String(m).padStart(2,'0')}m` : `${m}m ${String(s).padStart(2,'0')}s`;
    }

    function tick() {
        const now = Date.now();
        const lbl = $('golden-label'), val = $('golden-hour-val');
        if (!lbl || !val) return;

        if (now >= sunriseMs && now <= morningEnd) {
            lbl.textContent = 'golden hour ends in';
            val.textContent = fmt(morningEnd);
        } else if (now < sunriseMs) {
            lbl.textContent = 'morning golden hour';
            val.textContent = fmt(sunriseMs);
        } else if (now >= eveningStart && now <= sunsetMs) {
            lbl.textContent = 'golden hour ends in';
            val.textContent = fmt(sunsetMs);
        } else if (now < eveningStart) {
            lbl.textContent = 'evening golden hour';
            val.textContent = fmt(eveningStart);
        } else {
            // After sunset — next morning
            lbl.textContent = 'next golden hour';
            val.textContent = fmt(sunriseMs + 86_400_000);
        }
    }

    tick();
    state.goldenTimer = setInterval(tick, 1_000);
}

// ─── Compass Rose ─────────────────────────────────────────────
function rotateCompass(degrees) {
    const n = $('compass-needle');
    if (n) n.setAttribute('transform', `rotate(${degrees}, 40, 40)`);
}

// ─── 7-Day Forecast ──────────────────────────────────────────
function render7DayForecast(daily) {
    const list = $('forecast-list');
    list.innerHTML = '';

    const precipArr = daily.precipitation_sum || [];
    const maxPrecip = Math.max(0.01, ...precipArr.filter(v => v != null));

    for (let i = 0; i < 7; i++) {
        const dayLabel  = i === 0 ? 'Today' : new Date(daily.time[i]).toLocaleDateString('en-US', { weekday: 'short' });
        const wmo       = getWMO(daily.weather_code[i]);
        const precip    = precipArr[i] ?? 0;
        const precipPct = Math.min(100, (precip / maxPrecip) * 100);
        const precipStr = precip > 0.1 ? `${precip.toFixed(1)}mm` : 'dry';

        const row = document.createElement('div');
        row.className = 'forecast-row';
        row.innerHTML = `
            <span class="forecast-day">${dayLabel}</span>
            <div class="forecast-condition">
                <i data-lucide="${wmo.icon}"></i>
                <span>${wmo.label}</span>
            </div>
            <div class="forecast-right">
                <div class="forecast-temps">
                    <span class="max">${fmtTemp(daily.temperature_2m_max[i])}°</span>
                    <span class="min">${fmtTemp(daily.temperature_2m_min[i])}°</span>
                </div>
                <div class="precip-row">
                    <div class="precip-bar"><div class="precip-fill" style="width:${precipPct}%"></div></div>
                    <span class="precip-val">${precipStr}</span>
                </div>
            </div>`;
        list.appendChild(row);
    }
}

// ─── Metrics ─────────────────────────────────────────────────
function renderMetrics(current, daily, hourly, hIdx) {
    const imperial = state.unit === 'F';

    // Wind
    const windKph  = Math.round(current.windspeed);
    const gustKph  = Math.round(hourly.wind_gusts_10m?.[hIdx] ?? 0);
    const windDisp = imperial ? `${Math.round(windKph * 0.621371)} mph` : `${windKph} km/h`;
    const gustDisp = imperial ? `${Math.round(gustKph * 0.621371)} mph` : `${gustKph} km/h`;
    $('val-wind').textContent      = windDisp;
    $('val-wind-dir').textContent  = `Direction: ${current.winddirection}°`;
    $('val-wind-gust').textContent = `Gusts: ${gustDisp}`;
    rotateCompass(current.winddirection);

    // Humidity
    const humidity = hourly.relative_humidity_2m?.[hIdx] ?? 50;
    $('val-humidity').textContent      = `${humidity}%`;
    $('val-humidity-desc').textContent = humidity > 70 ? 'Humid — feels heavy.' : humidity >= 40 ? 'Comfortable.' : 'Dry atmosphere.';

    // UV Index
    const uv = daily.uv_index_max?.[0] ?? 0;
    $('val-uv').textContent      = uv.toFixed(1);
    $('val-uv-desc').textContent = uv > 10 ? 'Extreme exposure.' : uv > 7 ? 'Very high risk.' : uv > 5 ? 'High risk.' : uv > 2 ? 'Moderate.' : 'Low risk.';

    // AQI
    const aqi = state.aqiData?.hourly?.us_aqi?.[hIdx] ?? 0;
    $('val-aqi').textContent      = aqi;
    $('val-aqi-desc').textContent = aqi > 150 ? 'Unhealthy.' : aqi > 100 ? 'Sensitive groups.' : aqi > 50 ? 'Moderate.' : 'Good.';

    // Pressure (real data from API)
    const pressure = Math.round(hourly.surface_pressure?.[hIdx] ?? 1013);
    $('val-pressure').textContent      = `${pressure} hPa`;
    $('val-pressure-desc').textContent = pressure > 1022 ? 'High — settled weather.' : pressure < 1009 ? 'Low — change likely.' : 'Normal range.';

    // Apparent Temperature
    const feelsC = hourly.apparent_temperature?.[hIdx] ?? current.temperature;
    $('val-apparent').textContent = `${fmtTemp(feelsC)}°`;
    const diff = feelsC - current.temperature;
    $('val-apparent-desc').textContent = diff < -3 ? 'Feels colder than actual.' : diff > 3 ? 'Feels warmer than actual.' : 'Matches actual temp.';
}

// ─── Chart ────────────────────────────────────────────────────
function renderChart(hourly, hIdx) {
    const ctx    = $('hourlyChart').getContext('2d');
    const labels = [], temps = [], rain = [];

    for (let i = 0; i < 12; i++) {
        const idx = hIdx + i;
        if (idx >= hourly.time.length) break;
        labels.push(new Date(hourly.time[idx]).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }));
        temps.push(fmtTemp(hourly.temperature_2m[idx]));
        rain.push(hourly.precipitation_probability[idx] ?? 0);
    }

    if (state.chart) state.chart.destroy();

    const grad = ctx.createLinearGradient(0, 0, 0, 175);
    grad.addColorStop(0, 'rgba(143, 180, 248, 0.22)');
    grad.addColorStop(1, 'rgba(143, 180, 248, 0.0)');

    const chartFont = state.themeFont;

    state.chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: `temp (°${state.unit})`,
                    data: temps,
                    borderColor: '#8fb4f8',
                    borderWidth: 1.5,
                    pointBackgroundColor: '#8fb4f8',
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    fill: true,
                    backgroundColor: grad,
                    tension: 0.4,
                    yAxisID: 'y'
                },
                {
                    label: 'rain %',
                    data: rain,
                    type: 'bar',
                    backgroundColor: 'rgba(91, 131, 172, 0.2)',
                    borderColor:     'rgba(91, 131, 172, 0.45)',
                    borderWidth: 1,
                    borderRadius: 2,
                    yAxisID: 'yRain'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: { color: '#5f6482', font: { family: chartFont, size: 11 }, boxWidth: 10, padding: 16 }
                },
                tooltip: {
                    mode: 'index', intersect: false,
                    backgroundColor: 'rgba(46,50,71,0.95)',
                    borderColor: '#4d5370', borderWidth: 1,
                    titleColor: '#d4d8ef', bodyColor: '#8c91ae',
                    titleFont: { family: chartFont, size: 11 },
                    bodyFont:  { family: chartFont, size: 11 },
                    padding: 10
                }
            },
            scales: {
                x: {
                    grid: { display: false, drawBorder: false },
                    ticks: { color: '#5f6482', font: { family: chartFont, size: 11 } },
                    border: { display: false }
                },
                y: {
                    type: 'linear', position: 'left',
                    grid: { color: 'rgba(77,83,112,0.3)', drawBorder: false },
                    ticks: { color: '#5f6482', font: { family: chartFont, size: 11 } },
                    border: { display: false }
                },
                yRain: {
                    type: 'linear', position: 'right',
                    min: 0, max: 100,
                    grid: { display: false },
                    ticks: { color: '#5f6482', font: { family: chartFont, size: 11 }, callback: v => v + '%' },
                    border: { display: false }
                }
            }
        }
    });
}

// ─── Weather Alerts ───────────────────────────────────────────
function buildAlerts(current, daily, hourly, hIdx) {
    const alerts = [];
    const code     = current.weathercode;
    const windKph  = current.windspeed;
    const tempC    = current.temperature;
    const uv       = daily.uv_index_max?.[0] ?? 0;
    const rainProb = hourly.precipitation_probability?.[hIdx] ?? 0;

    if ([95,96,99].includes(code))  alerts.push('⛈  Thunderstorm conditions active');
    if (windKph > 60)               alerts.push(`💨  Strong wind advisory — ${Math.round(windKph)} km/h`);
    if (tempC > 38)                 alerts.push(`🌡  Extreme heat warning — ${Math.round(tempC)}°C`);
    if (tempC < 0)                  alerts.push(`❄️  Freeze warning — ${Math.round(tempC)}°C`);
    if (rainProb > 80)              alerts.push(`🌧  Heavy rain likely this hour — ${rainProb}% probability`);

    return alerts;
}

function renderAlerts(alerts) {
    const banner = $('alerts-banner');
    const list   = $('alerts-list');
    if (!alerts.length) { banner.classList.add('hidden'); return; }
    list.innerHTML = alerts.map(a => `<span class="alert-item">${a}</span>`).join('');
    banner.classList.remove('hidden');
}

// ─── Saved Locations & World Clock ───────────────────────────
function loadSavedLocations() {
    const raw = localStorage.getItem('savedLocations');
    state.savedLocations = raw ? JSON.parse(raw) : [
        { name: 'London, UK',     lat: 51.5074,  lon:  -0.1278,   timezone: 'Europe/London'      },
        { name: 'Tokyo, Japan',   lat: 35.6762,  lon: 139.6503,   timezone: 'Asia/Tokyo'         },
        { name: 'New York, USA',  lat: 40.7128,  lon: -74.0060,   timezone: 'America/New_York'   }
    ];
    renderSavedLocations();
}

function saveLocationsToStorage() {
    localStorage.setItem('savedLocations', JSON.stringify(state.savedLocations));
}

function getLocalTime(timezone) {
    if (!timezone) return '--:--';
    try {
        return new Date().toLocaleTimeString('en-US', {
            timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: false
        });
    } catch { return '--:--'; }
}

function updateSavedLocationTimes() {
    state.savedLocations.forEach((loc, i) => {
        const el = document.querySelector(`[data-loc-time="${i}"]`);
        if (el) el.textContent = getLocalTime(loc.timezone);
    });
}

function renderSavedLocations() {
    const list = $('saved-locations-list');
    list.innerHTML = '';

    state.savedLocations.forEach((loc, idx) => {
        const li = document.createElement('li');
        li.setAttribute('draggable', 'true');
        li.setAttribute('data-idx', idx);

        const isCurrent = isCurrentLocation(loc);

        li.innerHTML = `
            <div class="location-card ${isCurrent ? 'active' : ''}">
                <div class="drag-handle"><i data-lucide="grip-vertical"></i></div>
                <div class="location-info">
                    <span class="name">${loc.name.split(',')[0]}</span>
                    <span class="desc">${(loc.name.split(',')[1] || '').trim()}</span>
                </div>
                <div class="location-right">
                    <span class="world-clock" data-loc-time="${idx}">${getLocalTime(loc.timezone)}</span>
                    <button class="delete-loc-btn" title="Remove location">
                        <i data-lucide="x"></i>
                    </button>
                </div>
            </div>`;

        // Click to load location
        li.querySelector('.location-card').addEventListener('click', e => {
            if (e.target.closest('.delete-loc-btn') || e.target.closest('.drag-handle')) return;
            state.latitude    = loc.lat;
            state.longitude   = loc.lon;
            state.locationName = loc.name;
            if (loc.timezone) state.timezone = loc.timezone;
            fetchWeatherData();
        });

        // Delete button
        li.querySelector('.delete-loc-btn').addEventListener('click', e => {
            e.stopPropagation();
            state.savedLocations.splice(idx, 1);
            saveLocationsToStorage();
            renderSavedLocations();
            checkSavedState();
        });

        // ── Drag-and-Drop ──────────────────────────────
        li.addEventListener('dragstart', () => {
            state.dragStartIdx = idx;
            setTimeout(() => li.classList.add('dragging'), 0);
        });
        li.addEventListener('dragend', () => {
            li.classList.remove('dragging');
            state.dragStartIdx = null;
        });
        li.addEventListener('dragover', e => {
            e.preventDefault();
            li.classList.add('drag-over');
        });
        li.addEventListener('dragleave', () => {
            li.classList.remove('drag-over');
        });
        li.addEventListener('drop', e => {
            e.preventDefault();
            li.classList.remove('drag-over');
            const from = state.dragStartIdx;
            const to   = idx;
            if (from !== null && from !== to) {
                const [item] = state.savedLocations.splice(from, 1);
                state.savedLocations.splice(to, 0, item);
                saveLocationsToStorage();
                renderSavedLocations();
            }
        });

        list.appendChild(li);
    });

    lucide.createIcons();
}

function isCurrentLocation(loc) {
    return Math.abs(loc.lat - state.latitude) < 0.05 &&
           Math.abs(loc.lon - state.longitude) < 0.05;
}

function checkSavedState() {
    const saved = state.savedLocations.some(isCurrentLocation);
    $('save-location-btn').classList.toggle('favorited', saved);
    $('save-location-btn').querySelector('span').textContent = saved ? 'Saved' : 'Save';
}

function toggleSaveLocation() {
    const saved = state.savedLocations.some(isCurrentLocation);
    if (saved) {
        state.savedLocations = state.savedLocations.filter(l => !isCurrentLocation(l));
    } else {
        state.savedLocations.push({
            name:     state.locationName,
            lat:      state.latitude,
            lon:      state.longitude,
            timezone: state.timezone
        });
    }
    saveLocationsToStorage();
    renderSavedLocations();
    checkSavedState();
}

// ─── Share (html2canvas) ──────────────────────────────────────
async function shareWeatherCard() {
    if (typeof html2canvas === 'undefined') {
        showError('Share unavailable — html2canvas not loaded.');
        return;
    }

    const btn = $('share-btn');
    btn.classList.add('spinning');

    try {
        const el     = document.querySelector('.current-weather-card');
        const canvas = await html2canvas(el, {
            backgroundColor: '#3f4560',
            scale: 2,
            logging: false,
            useCORS: true
        });
        const link  = document.createElement('a');
        link.href   = canvas.toDataURL('image/png');
        link.download = `weather_${state.locationName.replace(/[^a-z0-9]/gi, '_')}.png`;
        link.click();
        showCopyToast('card downloaded');
    } catch (e) {
        showError('Failed to capture weather card.');
    } finally {
        btn.classList.remove('spinning');
    }
}

// ─── Copy Toast ───────────────────────────────────────────────
function showCopyToast(text) {
    const toast = $('copy-toast');
    toast.textContent = text + ' copied';
    toast.classList.remove('hidden');
    // Force reflow so transition fires
    toast.getBoundingClientRect();
    toast.classList.add('visible');
    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.classList.add('hidden'), 300);
    }, 2000);
}

// ─── Error ────────────────────────────────────────────────────
function showError(msg) {
    $('error-message').textContent = msg;
    $('error-banner').classList.remove('hidden');
}
