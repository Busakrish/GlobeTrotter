import { MapPin, ArrowDown, ChevronUp, ChevronDown, Trash2, Clock, Train, Plane, Car } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function CityStopCard({
  stop,
  index,
  totalStops,
  onMoveUp,
  onMoveDown,
  onRemove,
  onUpdateNights,
}) {
  const { formatMoney } = useAuth();

  const transitIcon = (mode = '') => {
    const m = mode.toLowerCase();
    if (m.includes('flight') || m.includes('plane')) return Plane;
    if (m.includes('cab') || m.includes('car') || m.includes('drive')) return Car;
    return Train;
  };

  const TransitIcon = transitIcon(stop.transitToNext?.mode);

  return (
    <div className="relative text-left">
      {/* City Stop Main Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-indigo-200 transition-all gap-4">
        {/* Left: Step number, Name, Country */}
        <div className="flex items-center gap-3.5">
          <div className="flex flex-col items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-sm shrink-0 border border-indigo-100">
            {index + 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-slate-900">{stop.name}</h4>
              <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {stop.country}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Stop {index + 1} of {totalStops} • Multi-City Route
            </p>
          </div>
        </div>

        {/* Center/Right: Nights selection, Reorder, Remove */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Nights input */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-600">Nights:</span>
            <input
              type="number"
              min="1"
              max="30"
              value={stop.nights || 2}
              onChange={(e) => onUpdateNights?.(Number(e.target.value))}
              className="w-12 text-center text-xs font-bold bg-white rounded-md border border-slate-300 py-1 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Reorder Buttons */}
          <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
            <button
              type="button"
              disabled={index === 0}
              onClick={onMoveUp}
              className="p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent"
              title="Move stop up"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-slate-200" />
            <button
              type="button"
              disabled={index === totalStops - 1}
              onClick={onMoveDown}
              className="p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-transparent"
              title="Move stop down"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Remove Button */}
          {totalStops > 1 && (
            <button
              type="button"
              onClick={onRemove}
              className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
              title="Remove city stop"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Transit Connector to next city if available */}
      {stop.transitToNext && (
        <div className="my-2 ml-5 sm:ml-8 pl-6 border-l-2 border-dashed border-indigo-300 py-2">
          <div className="inline-flex flex-wrap items-center gap-2.5 px-3 py-1.5 rounded-xl bg-indigo-50/80 border border-indigo-200/80 text-xs font-medium text-indigo-950">
            <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center">
              <TransitIcon className="w-3 h-3" />
            </div>
            <span className="font-bold text-indigo-900">{stop.transitToNext.mode}</span>
            <span className="text-indigo-400">•</span>
            <div className="flex items-center gap-1 text-slate-600">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>Takes {stop.transitToNext.durationText}</span>
            </div>
            <span className="text-indigo-400">•</span>
            <span className="text-slate-600">
              Departs {stop.transitToNext.departureTime} → Arrives {stop.transitToNext.arrivalTime}
            </span>
            {stop.transitToNext.cost > 0 && (
              <>
                <span className="text-indigo-400">•</span>
                <span className="font-semibold text-emerald-700">
                  Est. {formatMoney(stop.transitToNext.cost)}
                </span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CityStopCard;
