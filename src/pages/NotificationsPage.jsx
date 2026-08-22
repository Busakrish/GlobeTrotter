import { Link } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import {
  Bell,
  CheckCircle2,
  Trash2,
  Sparkles,
  Calendar,
  DollarSign,
  MapPin,
  ArrowRight,
  Clock,
} from 'lucide-react';

export function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } =
    useNotification();

  const getIcon = (type) => {
    switch (type) {
      case 'trip':
        return Calendar;
      case 'budget':
        return DollarSign;
      case 'ai':
        return Sparkles;
      default:
        return MapPin;
    }
  };

  const getIconBg = (type) => {
    switch (type) {
      case 'trip':
        return 'bg-indigo-50 text-indigo-600';
      case 'budget':
        return 'bg-amber-50 text-amber-600';
      case 'ai':
        return 'bg-emerald-50 text-emerald-600';
      default:
        return 'bg-sky-50 text-sky-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 text-left animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 mb-2">
            <Bell className="w-3.5 h-3.5" />
            Alerts & Travel Feeds
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Notifications Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Stay updated with departure countdowns, real-time budget thresholds, and AI suggestions.
          </p>
        </div>

        {notifications.length > 0 && (
          <Button
            size="sm"
            variant="outline"
            icon={CheckCircle2}
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark All as Read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const Icon = getIcon(notif.type);
            const iconStyle = getIconBg(notif.type);

            return (
              <div
                key={notif.id}
                className={`p-5 rounded-3xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  !notif.read
                    ? 'bg-white border-indigo-200/80 shadow-xs ring-1 ring-indigo-500/10'
                    : 'bg-white/70 border-slate-200/80'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold shrink-0 mt-0.5 ${iconStyle}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {notif.title}
                      </h3>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                      {notif.message}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium block pt-0.5">
                      {notif.time}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {notif.link && (
                    <Link
                      to={notif.link}
                      onClick={() => markAsRead(notif.id)}
                      className="px-3 py-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors flex items-center gap-1"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => deleteNotification(notif.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Bell}
          title="No notifications"
          description="You are all caught up! Trip countdowns, budget warnings, and AI recommendations will show up here."
        />
      )}
    </div>
  );
}

export default NotificationsPage;
