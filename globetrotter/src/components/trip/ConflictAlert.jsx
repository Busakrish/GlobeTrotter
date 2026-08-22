import { AlertTriangle, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import Button from '../common/Button';

export function ConflictAlert({ conflicts = [], onResolve }) {
  if (!conflicts.length) return null;

  return (
    <div className="mb-6 space-y-3">
      {conflicts.map((conflict, index) => {
        const actId = conflict.activityId || conflict.conflictingActivityId;
        const confKey = conflict.id || `conflict-${conflict.dayNumber}-${actId || index}`;

        return (
          <div
            key={confKey}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-amber-50 border border-amber-300/80 shadow-xs gap-3 text-left animate-fade-in"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-md">
                    Schedule Conflict Detected
                  </span>
                  <span className="text-xs font-semibold text-amber-700">
                    Day {conflict.dayNumber}
                  </span>
                </div>
                <p className="text-sm font-bold text-slate-900 mt-1">
                  {conflict.message || `Activity "${conflict.conflictingActivityTitle || 'Activity'}" overlaps with transit arrival (${conflict.transitArrivalTime}).`}
                </p>
                <p className="text-xs text-amber-800 mt-0.5">
                  💡 <span className="font-semibold">Suggestion:</span> {conflict.resolution || `Reschedule to ${conflict.suggestedTime} after arrival buffer.`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 sm:self-center">
              <Button
                size="sm"
                variant="secondary"
                icon={CheckCircle2}
                onClick={() =>
                  onResolve?.(
                    conflict.dayNumber,
                    actId,
                    conflict.suggestedTime
                  )
                }
                className="bg-amber-900 hover:bg-amber-800 text-white text-xs whitespace-nowrap"
              >
                <span>Move to {conflict.suggestedTime}</span>
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ConflictAlert;
