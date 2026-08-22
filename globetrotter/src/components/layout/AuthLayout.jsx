import { Link } from 'react-router-dom';
import { Compass, Sparkles, ShieldCheck, MapPin } from 'lucide-react';
import ToastContainer from '../common/Toast';

export function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left side: Inspiring Travel Showcase (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 text-white flex-col justify-between p-12 overflow-hidden">
        {/* Background photo with overlay */}
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
          alt="GlobeTrotter Travel Hero"
          className="absolute inset-0 w-full h-full object-cover opacity-35 scale-105 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/40">
            <Compass className="w-6 h-6 animate-pulse-glow" />
          </div>
          <div>
            <span className="font-heading text-2xl font-extrabold tracking-tight">GlobeTrotter</span>
            <p className="text-xs text-indigo-300 font-medium tracking-wide">Empowering Personalized Travel Planning</p>
          </div>
        </div>

        {/* Middle Feature Highlights */}
        <div className="relative z-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-sky-200">
            <Sparkles className="w-4 h-4 text-sky-300" />
            Next-Gen Multi-City Travel Planner
          </div>
          <h2 className="text-3xl xl:text-4xl font-extrabold leading-tight text-white">
            "Planning multi-city travel is complex. GlobeTrotter makes it effortless."
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Craft day-by-day itineraries, track budgets with live charts, detect transit schedule conflicts automatically, and discover top activities around the globe.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/15">
            <div>
              <p className="text-2xl font-bold text-white">14K+</p>
              <p className="text-xs text-slate-400">Trips Planned</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">98.5%</p>
              <p className="text-xs text-slate-400">Conflict-Free Routes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">4.9/5</p>
              <p className="text-xs text-slate-400">Traveler Rating</p>
            </div>
          </div>
        </div>

        {/* Bottom Destination Tag */}
        <div className="relative z-10 flex items-center gap-2 text-xs text-slate-400">
          <MapPin className="w-4 h-4 text-indigo-400" />
          <span>Featured: North Goa & Vagator Coastal Trails</span>
        </div>
      </div>

      {/* Right side: Auth Form Container */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 lg:px-16 py-12 max-w-md mx-auto w-full">
        {/* Mobile Header Logo */}
        <div className="flex lg:hidden items-center gap-2.5 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
            <Compass className="w-5 h-5" />
          </div>
          <span className="font-heading text-xl font-extrabold text-slate-900">GlobeTrotter</span>
        </div>

        <div className="mb-6 text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-slate-500 mt-1.5">{subtitle}</p>}
        </div>

        {children}
      </div>

      <ToastContainer />
    </div>
  );
}

export default AuthLayout;
