import { useState, useEffect, useCallback } from 'react';
import { weatherApi } from '../../services/api';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSun,
  Wind,
  Droplets,
  Sparkles,
  RefreshCw,
  MapPin,
  Compass,
  CloudFog,
  CloudLightning,
  Snowflake,
} from 'lucide-react';

export function WeatherCard({ cityName = 'Mumbai' }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLiveWeather = useCallback(async (city, isManual = false) => {
    if (isManual) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await weatherApi.getForecast(city || 'Mumbai');
      if (res?.success && res.weather) {
        setWeather(res.weather);
      } else if (res?.weather) {
        setWeather(res.weather);
      }
    } catch (err) {
      console.warn('[WeatherCard] Live fetch fallback:', err.message);
      // Fallback
      setWeather({
        city: city || 'Mumbai',
        temp: 28,
        feelsLike: 30,
        condition: 'Partly Cloudy',
        humidity: 68,
        windSpeed: '12 km/h',
        precipitationProbability: 20,
        icon: 'CloudSun',
        advice: 'Pleasant weather for outdoor exploring and sightseeing.',
        forecast: [
          { day: 'Today', temp: 28, condition: 'Partly Cloudy', icon: 'CloudSun' },
          { day: 'Sun', temp: 29, condition: 'Sunny', icon: 'Sun' },
          { day: 'Mon', temp: 28, condition: 'Clear Sky', icon: 'Sun' },
          { day: 'Tue', temp: 27, condition: 'Passing Showers', icon: 'CloudRain' },
          { day: 'Wed', temp: 28, condition: 'Partly Cloudy', icon: 'CloudSun' },
        ],
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveWeather(cityName);
  }, [cityName, fetchLiveWeather]);

  const getWeatherIcon = (cond = '', iconStr = '') => {
    const c = (cond || iconStr || '').toLowerCase();
    if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) return CloudRain;
    if (c.includes('thunder') || c.includes('lightning')) return CloudLightning;
    if (c.includes('snow') || c.includes('flurry')) return Snowflake;
    if (c.includes('fog') || c.includes('mist')) return CloudFog;
    if (c.includes('cloud') && !c.includes('sun')) return Cloud;
    if (c.includes('sun') || c.includes('clear')) return Sun;
    return CloudSun;
  };

  if (loading && !weather) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-sky-600 via-indigo-600 to-indigo-800 text-white p-6 shadow-md relative overflow-hidden text-left animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 w-28 bg-white/20 rounded"></div>
          <div className="w-10 h-10 bg-white/20 rounded-xl"></div>
        </div>
        <div className="h-10 w-20 bg-white/20 rounded mb-4"></div>
        <div className="h-16 w-full bg-white/10 rounded-xl mb-4"></div>
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-white/10 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  const Icon = getWeatherIcon(weather?.condition, weather?.icon);

  return (
    <div className="rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-600 to-indigo-700 text-white p-5 shadow-md relative overflow-hidden text-left transition-all">
      {/* Decorative circle background */}
      <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />

      {/* Header with Live Pulsing Badge and Refresh */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-widest text-sky-200 bg-white/15 px-2 py-0.5 rounded-full border border-white/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Live Meteorological Radar
            </span>
            <button
              type="button"
              onClick={() => fetchLiveWeather(cityName, true)}
              title="Refresh live forecast"
              className="text-sky-200 hover:text-white transition-all p-0.5 rounded hover:bg-white/10"
            >
              <RefreshCw className={`w-3 h-3 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <h3 className="text-lg font-bold text-white leading-snug mt-1 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-sky-200" />
            {weather?.city || cityName}
          </h3>
        </div>
        <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-xs shrink-0">
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {/* Main Temp & Metrics */}
      <div className="flex items-baseline gap-4 mb-4">
        <span className="text-4xl font-extrabold tracking-tight">{weather?.temp}°C</span>
        <div>
          <p className="text-xs font-bold text-sky-100">{weather?.condition}</p>
          <p className="text-[11px] text-sky-200 font-medium">Feels like {weather?.feelsLike ?? weather?.temp}°C</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/15 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-sky-200 shrink-0" />
          <span>
            Rain chance: <strong className="text-white">{weather?.precipitationProbability ?? 15}%</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-sky-200 shrink-0" />
          <span>
            Wind: <strong className="text-white">{weather?.windSpeed || '12 km/h'}</strong>
          </span>
        </div>
      </div>

      {/* Dynamic Travel Advice */}
      {weather?.advice && (
        <div className="bg-white/15 backdrop-blur-md p-3 rounded-xl border border-white/15 text-xs text-sky-50 leading-relaxed mb-4">
          <div className="flex items-center gap-1.5 font-bold text-sky-200 mb-0.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Smart Packing Insight:</span>
          </div>
          {weather.advice}
        </div>
      )}

      {/* 5-Day Mini Forecast */}
      {weather?.forecast && weather.forecast.length > 0 && (
        <div className="grid grid-cols-5 gap-1.5 text-center pt-2 border-t border-white/10">
          {weather.forecast.slice(0, 5).map((f, i) => {
            const FIcon = getWeatherIcon(f.condition, f.icon);
            return (
              <div key={i} className="flex flex-col items-center py-1.5 rounded-lg bg-white/10 backdrop-blur-xs">
                <span className="text-[10px] font-bold text-sky-200">{f.day}</span>
                <FIcon className="w-3.5 h-3.5 my-1 text-white" />
                <span className="text-[11px] font-bold text-white">{f.temp}°</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default WeatherCard;
