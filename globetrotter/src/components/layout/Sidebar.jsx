import { Link, useLocation } from 'react-router-dom';
import { useTrips } from '../../context/TripContext';
import { useNotification } from '../../context/NotificationContext';
import {
  Layers,
  Compass,
  Plus,
  Heart,
  Sparkles,
  CheckSquare,
  Package,
  Users,
  Sliders,
  User,
  Bell,
  ShieldCheck,
  MapPin,
  Calendar,
  DollarSign,
  ChevronRight,
  TrendingUp,
  FileText,
} from 'lucide-react';
import Badge from '../common/Badge';

export function Sidebar() {
  const location = useLocation();
  const { trips, activeTrip, setActiveTripId, savedPlaces, documents } = useTrips();
  const { unreadCount } = useNotification();

  const navigationSections = [
    {
      title: 'Command Center',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: Layers },
        { label: 'My Trips', path: '/trips', icon: Compass, badge: trips.length },
      ],
    },
    {
      title: 'Planning & Tools',
      items: [
        { label: 'Plan New Trip', path: '/trips/create', icon: Plus, highlight: true },
        { label: 'Itinerary Builder', path: activeTrip ? `/trips/${activeTrip.id}/itinerary` : '/itinerary', icon: Compass },
        { label: 'Document Vault', path: '/documents', icon: FileText, badge: documents?.length || 0, badgeColor: 'indigo' },
        { label: 'AI Trip Matcher', path: '/recommendations', icon: Sparkles },
        { label: 'Travel Checklist', path: activeTrip ? `/trips/${activeTrip.id}/checklist` : '/dashboard', icon: CheckSquare },
        { label: 'Packing Assistant', path: '/packing-list', icon: Package },
      ],
    },
    {
      title: 'Discovery & Community',
      items: [
        { label: 'Explore Destinations', path: '/explore', icon: MapPin },
        { label: 'Saved Places', path: '/saved', icon: Heart, badge: savedPlaces.length || null },
        { label: 'Community Trips', path: '/community', icon: Users },
      ],
    },
    {
      title: 'Personal & Admin',
      items: [
        { label: 'Notifications', path: '/notifications', icon: Bell, badge: unreadCount || null, badgeColor: 'rose' },
        { label: 'Traveler Profile', path: '/profile', icon: User },
        { label: 'Settings', path: '/settings', icon: Sliders },
        { label: 'Admin Telemetry', path: '/admin', icon: ShieldCheck },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col justify-between p-4 h-[calc(100vh-4rem)] sticky top-16 shrink-0 overflow-y-auto scrollbar-none text-left">
      <div className="space-y-6">
        {/* Active Trip Quick Card */}
        {activeTrip && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-50 to-sky-50 border border-indigo-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700">
                Active Itinerary
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="flex items-center gap-2">
              <img
                src={activeTrip.coverImage}
                alt={activeTrip.title}
                className="w-9 h-9 rounded-xl object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 truncate leading-tight">
                  {activeTrip.title}
                </h4>
                <p className="text-[10px] text-slate-500 truncate">
                  {activeTrip.cities?.map((c) => c.name).join(' → ') || 'Multi-City'}
                </p>
              </div>
            </div>

            <Link
              to={`/trips/${activeTrip.id}/itinerary`}
              className="flex items-center justify-between text-[11px] font-bold text-indigo-600 hover:text-indigo-700 pt-1 border-t border-indigo-100/60"
            >
              <span>Open Builder</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Grouped Navigation Links */}
        <div className="space-y-5">
          {navigationSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <h5 className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                {section.title}
              </h5>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : item.highlight
                          ? 'text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100/70 border border-indigo-100'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-indigo-600' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </div>

                      {item.badge !== undefined && item.badge !== null && (
                        <span
                          className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : item.badgeColor === 'rose'
                              ? 'bg-rose-100 text-rose-600'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Footer info */}
      <div className="pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
        <span>GlobeTrotter v2.4 • Stitch Edition</span>
      </div>
    </aside>
  );
}

export default Sidebar;
