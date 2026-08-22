import { useNotification } from '../../context/NotificationContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import clsx from 'clsx';

const toastStyles = {
  success: {
    bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    icon: CheckCircle2,
    iconColor: 'text-emerald-600',
  },
  error: {
    bg: 'bg-rose-50 border-rose-200 text-rose-900',
    icon: AlertCircle,
    iconColor: 'text-rose-600',
  },
  warning: {
    bg: 'bg-amber-50 border-amber-200 text-amber-900',
    icon: AlertTriangle,
    iconColor: 'text-amber-600',
  },
  info: {
    bg: 'bg-sky-50 border-sky-200 text-sky-900',
    icon: Info,
    iconColor: 'text-sky-600',
  },
};

export function ToastContainer() {
  const { toasts, removeToast } = useNotification();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const style = toastStyles[toast.type] || toastStyles.info;
        const Icon = style.icon;

        return (
          <div
            key={toast.id}
            className={clsx(
              'pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-200 animate-fade-in',
              style.bg
            )}
          >
            <Icon className={clsx('w-5 h-5 shrink-0 mt-0.5', style.iconColor)} />
            <div className="flex-1 min-w-0">
              {toast.title && (
                <h4 className="text-xs font-bold uppercase tracking-wider mb-0.5">{toast.title}</h4>
              )}
              <p className="text-sm font-medium leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="rounded-lg p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ToastContainer;
