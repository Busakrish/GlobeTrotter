import { getCityWeather } from '../../data/mockWeather';
import { Sun, Cloud, CloudRain, CloudSun, Wind, Droplets, Sparkles } from 'lucide-react';

export function WeatherCard({ cityName = 'Mumbai' }) {
  const weather = getCityWeather(cityName);

  const getWeatherIcon = (cond = '') => {
    const c = cond.toLowerCase();
    if (c.includes('rain')) return CloudRain;
    if (c.includes('cloud') && !c.includes('sun')) return Cloud;
    if (c.includes('sun') || c.includes('clear')) return Sun;
    return CloudSun;
  };

  const Icon = getWeatherIcon(weather.condition);

  return (
    <div className="rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-600 to-indigo-700 text-white p-5 shadow-md relative overflow-hidden text-left">
      {/* Decorative circle background */}
      <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-200">
            Live Weather Forecast
          </span>
          <h3 className="text-lg font-bold text-white leading-snug">{weather.city}</h3>
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
          <Icon className="w-6 h-6" />
        </div>
      </div>

      {/* Main Temp & Metrics */}
      <div className="flex items-baseline gap-4 mb-4">
        <span className="text-4xl font-extrabold tracking-tight">{weather.temp}°C</span>
        <div>
          <p className="text-xs font-semibold text-sky-100">{weather.condition}</p>
          <p className="text-[11px] text-sky-200">Feels like {weather.feelsLike}°C</p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/15 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <Droplets className="w-4 h-4 text-sky-200 shrink-0" />
          <span>Rain chance: <strong className="text-white">{weather.precipitationProbability}%</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="w-4 h-4 text-sky-200 shrink-0" />
          <span>Wind: <strong className="text-white">{weather.windSpeed}</strong></span>
        </div>
      </div>

      {/* Travel Advice */}
      <div className="bg-white/15 backdrop-blur-md p-3 rounded-xl border border-white/15 text-xs text-sky-50 leading-relaxed mb-4">
        <div className="flex items-center gap-1.5 font-bold text-sky-200 mb-0.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Smart Packing Insight:</span>
        </div>
        {weather.advice}
      </div>

      {/* 5-Day Mini Forecast */}
      <div className="grid grid-cols-5 gap-1.5 text-center pt-2 border-t border-white/10">
        {weather.forecast.map((f, i) => {
          const FIcon = getWeatherIcon(f.condition);
          return (
            <div key={i} className="flex flex-col items-center py-1 rounded-lg bg-white/10 backdrop-blur-xs">
              <span className="text-[10px] font-bold text-sky-200">{f.day}</span>
              <FIcon className="w-3.5 h-3.5 my-1 text-white" />
              <span className="text-[11px] font-bold text-white">{f.temp}°</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WeatherCard;
