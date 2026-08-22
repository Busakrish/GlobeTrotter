import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import { destinationsApi } from '../services/api';
import {
  Compass,
  MapPin,
  Calendar,
  Clock,
  Plus,
  Sparkles,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Layers,
  Heart,
  Activity,
} from 'lucide-react';
import Button from '../components/common/Button';
import TripCard from '../components/trip/TripCard';
import WeatherCard from '../components/weather/WeatherCard';
import SmartBudgetAlert from '../components/budget/SmartBudgetAlert';

export function Dashboard() {
  const { currentUser, formatMoney } = useAuth();
  const { trips, activeTrip, calculateTripBudgetSummary, setActiveTripId, savedPlaces } = useTrips();
  const [trendingDestinations, setTrendingDestinations] = useState([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await destinationsApi.getDestinations({ sort: 'rating' });
        if (res?.success && Array.isArray(res.destinations)) {
          setTrendingDestinations(res.destinations.slice(0, 4));
        }
      } catch (e) {}
    };
    fetchTrending();
  }, []);

  const upcomingTrip = activeTrip || (trips.length > 0 ? trips[0] : null);
  const budgetSummary = upcomingTrip ? calculateTripBudgetSummary(upcomingTrip) : null;

  // Time-of-day greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Key Statistics
  const totalTripsCount = trips.length;
  const upcomingTripsCount = trips.filter((t) => t.status === 'Upcoming' || t.status === 'Planning').length;
  const savedPlacesCount = savedPlaces.length;

  const uniqueCountries = new Set(
    trips.flatMap((t) => t.cities?.map((c) => c.country) || (t.country ? [t.country] : []))
  ).size;

  const totalPlannedActivities = trips.reduce(
    (sum, t) => sum + (t.days || []).reduce((dSum, d) => dSum + (d.activities?.length || 0), 0),
    0
  );

  return (
    <div className="space-y-8 text-left animate-fade-in pb-16">
      {/* 1. Personalized Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#714B67] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#F0A63F]" />
            Traveler Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B26] tracking-tight font-display">
            {getGreeting()}, {currentUser?.name?.split(' ')[0] || 'Traveler'}! ✈️
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {trips.length === 0 ? (
              <span>You haven't planned any trips yet. Create your first trip to get started.</span>
            ) : (
              <span>
                You have <strong className="text-[#1B1B26] font-semibold">{upcomingTripsCount} active journey(s)</strong> planned across {uniqueCountries} country destination(s).
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link to="/explore">
            <Button variant="secondary" size="sm" icon={Compass}>
              Explore Places
            </Button>
          </Link>
          <Link to="/trips/create">
            <Button variant="primary" size="sm" icon={Plus}>
              Plan New Trip
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Key Metrics Snapshot Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-[6px] bg-white border border-slate-200 border-t-4 border-t-[#714B67] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Trips
            </span>
            <div className="w-8 h-8 rounded-[4px] bg-[#714B67]/10 text-[#714B67] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#1B1B26]">{totalTripsCount}</p>
          <p className="text-[11px] text-[#2AB79B] font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {upcomingTripsCount} Active / Upcoming
          </p>
        </div>

        <div className="p-5 rounded-[6px] bg-white border border-slate-200 border-t-4 border-t-[#3E8EDE] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Countries Visited
            </span>
            <div className="w-8 h-8 rounded-[4px] bg-[#3E8EDE]/10 text-[#3E8EDE] flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#1B1B26]">{uniqueCountries}</p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Multi-city destinations</p>
        </div>

        <div className="p-5 rounded-[6px] bg-white border border-slate-200 border-t-4 border-t-[#F16E62] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Saved Wishlist
            </span>
            <div className="w-8 h-8 rounded-[4px] bg-[#F16E62]/15 text-[#F16E62] flex items-center justify-center">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#1B1B26]">{savedPlacesCount}</p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">{totalPlannedActivities} planned activities</p>
        </div>

        <div className="p-5 rounded-[6px] bg-white border border-slate-200 border-t-4 border-t-[#F0A63F] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Budget Managed
            </span>
            <div className="w-8 h-8 rounded-[4px] bg-[#F0A63F]/15 text-[#F0A63F] flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#1B1B26]">
            {formatMoney(trips.reduce((sum, t) => sum + (Number(t.budget) || 0), 0))}
          </p>
          <p className="text-[11px] text-[#2AB79B] font-semibold mt-1">Real-time synchronized</p>
        </div>
      </div>

      {/* 3. Active Trip Hero Banner OR Clean Empty State */}
      {upcomingTrip ? (
        <div className="rounded-[6px] bg-[#1B1B26] text-white overflow-hidden relative shadow-lg">
          <img
            src={upcomingTrip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'}
            alt={upcomingTrip.title}
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B1B26] via-[#1B1B26]/80 to-transparent" />

          <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#714B67]/40 backdrop-blur-md border border-[#714B67]/60 text-xs font-bold text-pink-200 mb-3">
                <Compass className="w-3.5 h-3.5 text-[#F0A63F]" />
                Active Travel Workspace
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-2 font-display">
                {upcomingTrip.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mb-4">
                <span className="flex items-center gap-1.5 font-semibold text-sky-300">
                  <MapPin className="w-4 h-4 shrink-0" />
                  {upcomingTrip.cities?.map((c) => c.name).join(' → ') || upcomingTrip.destination || 'Multi-City'}
                </span>
                {upcomingTrip.startDate && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {upcomingTrip.startDate} to {upcomingTrip.endDate}
                    </span>
                  </>
                )}
                {upcomingTrip.durationDays && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1.5 font-bold text-[#2AB79B]">
                      <Clock className="w-4 h-4" />
                      {upcomingTrip.durationDays} Days
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 leading-relaxed mb-6">
                {upcomingTrip.description || 'Custom multi-city travel itinerary with day-by-day scheduling.'}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to={`/trips/${upcomingTrip.id || upcomingTrip._id}`}
                  onClick={() => setActiveTripId(upcomingTrip.id || upcomingTrip._id)}
                >
                  <Button variant="primary" size="md" iconRight={ArrowRight}>
                    View Workspace
                  </Button>
                </Link>
                {budgetSummary && (
                  <Link
                    to={`/trips/${upcomingTrip.id || upcomingTrip._id}/budget`}
                    onClick={() => setActiveTripId(upcomingTrip.id || upcomingTrip._id)}
                  >
                    <Button variant="secondary" size="md" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                      Budget: {formatMoney(budgetSummary.totalSpent)} / {formatMoney(upcomingTrip.budget)}
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* Weather mini-widget right column */}
            <div className="w-full lg:w-80 shrink-0">
              <WeatherCard cityName={upcomingTrip.cities?.[0]?.name || upcomingTrip.destination || 'Mumbai'} />
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-[6px] bg-white border-2 border-dashed border-slate-200 p-8 sm:p-12 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="w-16 h-16 rounded-full bg-[#714B67]/10 text-[#714B67] flex items-center justify-center mx-auto mb-4">
            <Compass className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2">
            You haven't planned any trips yet
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
            Create your first trip to build custom itineraries, track daily budgets, pack checklists, and monitor real-time weather forecasts.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/trips/create">
              <Button variant="primary" size="md" icon={Plus}>
                Plan Your First Trip
              </Button>
            </Link>
            <Link to="/explore">
              <Button variant="secondary" size="md" icon={Compass}>
                Explore Destinations
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* 4. Smart Budget Status Banner */}
      {upcomingTrip && budgetSummary && (
        <div>
          <SmartBudgetAlert budgetSummary={budgetSummary} />
        </div>
      )}

      {/* 5. Quick Actions Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <Link
          to="/trips/create"
          className="p-5 rounded-[6px] bg-white border border-slate-200 border-t-2 border-t-[#714B67] shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:border-[#714B67] transition-all group text-left"
        >
          <div className="w-10 h-10 rounded-[6px] bg-[#714B67]/10 text-[#714B67] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <Plus className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#1B1B26]">Create Trip</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Build new route</p>
        </Link>

        <Link
          to="/explore"
          className="p-5 rounded-[6px] bg-white border border-slate-200 border-t-2 border-t-[#3E8EDE] shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:border-[#3E8EDE] transition-all group text-left"
        >
          <div className="w-10 h-10 rounded-[6px] bg-[#3E8EDE]/10 text-[#3E8EDE] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#1B1B26]">Explore</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Destinations catalog</p>
        </Link>

        <Link
          to="/trips"
          className="p-5 rounded-[6px] bg-white border border-slate-200 border-t-2 border-t-[#2AB79B] shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:border-[#2AB79B] transition-all group text-left"
        >
          <div className="w-10 h-10 rounded-[6px] bg-[#2AB79B]/10 text-[#2AB79B] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#1B1B26]">My Trips</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">All saved journeys</p>
        </Link>

        <Link
          to="/saved"
          className="p-5 rounded-[6px] bg-white border border-slate-200 border-t-2 border-t-[#F16E62] shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:border-[#F16E62] transition-all group text-left"
        >
          <div className="w-10 h-10 rounded-[6px] bg-[#F16E62]/15 text-[#F16E62] flex items-center justify-center mb-2.5 group-hover:scale-110 transition-transform">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-[#1B1B26]">Saved Places</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">Wishlist highlights</p>
        </Link>
      </div>

      {/* 6. Two-Column Row: Trips Library (Left) & Recent Activity Stream (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Trips Cards */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#1B1B26]">Your Trips Library</h3>
              <p className="text-xs text-slate-500">Pick up where you left off</p>
            </div>
            {trips.length > 0 && (
              <Link
                to="/trips"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#714B67] hover:underline"
              >
                <span>View All ({trips.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          {trips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trips.slice(0, 4).map((trip, i) => (
                <TripCard key={trip.id || trip._id} trip={trip} index={i} />
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-[6px] bg-white border border-slate-200 text-center">
              <p className="text-sm text-slate-500 mb-4">No trips found in your database account.</p>
              <Link to="/trips/create">
                <Button variant="primary" size="sm" icon={Plus}>
                  Create Your First Trip
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Right: Recent Activity Stream */}
        <div className="lg:col-span-4 space-y-4">
          <h3 className="text-lg font-bold text-[#1B1B26] flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#714B67]" />
            Recent Activity
          </h3>

          <div className="p-6 rounded-[6px] bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)] space-y-4">
            {trips.length > 0 ? (
              trips.slice(0, 3).map((t, idx) => (
                <div key={t.id || t._id || idx} className="flex items-start gap-3 text-xs">
                  <div className="w-8 h-8 rounded-[4px] bg-[#714B67]/10 text-[#714B67] flex items-center justify-center font-bold shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-[#1B1B26] truncate">{t.title || 'Trip Itinerary'}</h4>
                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">
                      {t.cities?.map((c) => c.name).join(' → ') || t.destination || 'Multi-City'}
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">Active</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">No recent activity recorded.</p>
            )}
          </div>

          {/* Quick AI Matcher teaser */}
          <div className="p-6 rounded-[6px] bg-[#714B67] text-white shadow-md space-y-3">
            <h4 className="text-sm font-extrabold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#F0A63F]" />
              Need destination inspiration?
            </h4>
            <p className="text-xs text-pink-100 leading-relaxed">
              Explore trending multi-city stops or generate recommendations tailored to your style.
            </p>
            <Link to="/explore" className="block">
              <Button size="sm" variant="secondary" className="w-full bg-white text-[#1B1B26] font-bold hover:bg-slate-100">
                Explore Destinations
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 7. Trending Destinations */}
      {trendingDestinations.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-[#1B1B26]">Trending Destinations</h3>
              <p className="text-xs text-slate-500">Popular travel hotspots from database catalog</p>
            </div>
            <Link
              to="/explore"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#714B67] hover:underline"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendingDestinations.map((dest) => (
              <div
                key={dest.id || dest._id}
                className="group relative rounded-[6px] overflow-hidden bg-white border border-slate-200 border-t-3 border-t-[#2AB79B] shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-md transition-all card-hover flex flex-col justify-between"
              >
                <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 inset-x-3 text-white">
                    <h4 className="text-sm font-bold text-white">{dest.name}</h4>
                    <p className="text-[11px] text-slate-300">{dest.country} • {dest.costIndex}</p>
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-xs text-[#1B1B26]/80 line-clamp-2 leading-relaxed mb-3">
                    {dest.shortDescription || dest.description}
                  </p>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                    <span className="font-bold text-[#1B1B26]">
                      {formatMoney(dest.avgDailyCost)} <span className="text-[10px] font-normal text-slate-500">/ day</span>
                    </span>
                    <Link
                      to={`/explore/${dest.id}`}
                      className="font-bold text-xs text-[#714B67] hover:underline flex items-center gap-1"
                    >
                      <span>View Guide</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
