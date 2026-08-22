import { NavLink } from 'react-router-dom';
import { useTrips } from '../../context/TripContext';
import { LayoutDashboard, Layers, Clock, Sparkles, Users } from 'lucide-react';
import clsx from 'clsx';

export function MobileNav() {
  const { activeTrip, trips } = useTrips();
  const currentTripId = activeTrip?.id || trips[0]?.id || 'trip-1';

  const navItems = [
    { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/trips', label: 'Trips', icon: Layers },
    { to: `/trips/${currentTripId}/itinerary`, label: 'Builder', icon: Clock },
    { to: '/recommendations', label: 'AI Plan', icon: Sparkles },
    { to: '/community', label: 'Community', icon: Users },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-30 flex h-16 items-center justify-around border-t border-slate-200 bg-white/95 px-2 backdrop-blur-md md:hidden shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              clsx(
                'flex flex-col items-center justify-center gap-1 flex-1 py-1 text-[10px] font-semibold transition-colors',
                isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'
              )
            }
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

export default MobileNav;
