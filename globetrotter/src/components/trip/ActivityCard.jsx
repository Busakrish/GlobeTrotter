import { Clock, DollarSign, MapPin, Trash2, CheckCircle2, Circle, Edit3 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Badge from '../common/Badge';

const categoryVariant = {
  'Sightseeing': 'indigo',
  'Food & Dining': 'emerald',
  'Adventure': 'amber',
  'Culture & Heritage': 'purple',
  'Nightlife': 'rose',
  'Relaxation': 'sky',
  'Transport': 'slate',
};

export function ActivityCard({
  activity,
  onToggleComplete,
  onEdit,
  onDelete,
  readOnly = false,
}) {
  const { formatMoney } = useAuth();

  const variant = categoryVariant[activity.category] || 'indigo';

  return (
    <div
      className={`group flex items-start gap-3.5 p-4 rounded-2xl border transition-all text-left ${
        activity.completed
          ? 'bg-slate-50 border-slate-200/80 opacity-75'
          : 'bg-white border-slate-200/90 hover:border-indigo-200 hover:shadow-xs'
      }`}
    >
      {/* Checkbox */}
      {!readOnly && (
        <button
          type="button"
          onClick={onToggleComplete}
          className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
        >
          {activity.completed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          ) : (
            <Circle className="w-5 h-5 text-slate-300 group-hover:text-indigo-400" />
          )}
        </button>
      )}

      {/* Main Details */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          {/* Time badge */}
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200/70">
            <Clock className="w-3 h-3 text-slate-500" />
            {activity.time}
          </span>

          {/* Category */}
          <Badge variant={variant} className="font-semibold">
            {activity.category}
          </Badge>

          {/* Duration */}
          <span className="text-[11px] font-medium text-slate-500">
            ({activity.durationMinutes || 90} mins)
          </span>

          {/* Cost */}
          {activity.cost > 0 ? (
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md ml-auto">
              {formatMoney(activity.cost)}
            </span>
          ) : (
            <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md ml-auto">
              Free
            </span>
          )}
        </div>

        {/* Title */}
        <h4
          className={`text-sm font-bold leading-snug ${
            activity.completed ? 'line-through text-slate-500' : 'text-slate-900'
          }`}
        >
          {activity.title}
        </h4>

        {/* Location & Notes */}
        {(activity.location || activity.notes) && (
          <div className="mt-1.5 space-y-1">
            {activity.location && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{activity.location}</span>
              </div>
            )}
            {activity.notes && (
              <p className="text-xs text-slate-600 bg-slate-50/80 p-2 rounded-lg border border-slate-100 italic">
                "{activity.notes}"
              </p>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons (Edit / Delete) */}
      {!readOnly && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
              title="Edit activity"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="Delete activity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default ActivityCard;
