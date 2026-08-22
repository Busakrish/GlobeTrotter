export function ProgressBar({
  value = 0,
  max = 100,
  label = '',
  showValue = true,
  color = 'indigo', // 'indigo' | 'emerald' | 'amber' | 'rose' | 'gradient'
  size = 'md', // 'sm' | 'md' | 'lg'
  className = '',
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colorClasses = {
    indigo: 'bg-indigo-600',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
    gradient: 'bg-gradient-to-r from-indigo-500 via-sky-500 to-emerald-400',
  };

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="font-semibold text-slate-700">{label}</span>}
          {showValue && (
            <span className="font-bold text-slate-900">
              {percentage}%
            </span>
          )}
        </div>
      )}

      <div
        className={`w-full bg-slate-100 rounded-full overflow-hidden ${sizeClasses[size] || sizeClasses.md}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            colorClasses[color] || colorClasses.indigo
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
