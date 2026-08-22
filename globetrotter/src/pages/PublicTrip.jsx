import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { mockCommunityTrips } from '../data/mockCommunity';
import TripMap from '../components/map/TripMap';
import ActivityCard from '../components/trip/ActivityCard';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import {
  MapPin,
  Share2,
  Copy,
  ArrowLeft,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function PublicTrip() {
  const { shareId } = useParams();
  const { trips, forkCommunityTrip } = useTrips();
  const { formatMoney } = useAuth();
  const { notifySuccess } = useNotification();
  const navigate = useNavigate();

  // Look for trip in user trips or mock community trips
  const userTrip = trips.find((t) => t.shareId === shareId || t.id === shareId);
  const communityTrip = mockCommunityTrips.find((t) => t.id === shareId);

  const trip = userTrip || (communityTrip ? {
    id: communityTrip.id,
    title: communityTrip.title,
    description: communityTrip.description,
    coverImage: communityTrip.coverImage,
    durationDays: communityTrip.durationDays,
    budget: communityTrip.budget,
    startDate: '2026-09-10',
    endDate: '2026-09-15',
    author: communityTrip.author,
    cities: communityTrip.destinations.map((d, i) => ({
      id: `stop-pub-${i}`,
      name: d,
      country: 'India',
      coordinates: [18.9220, 72.8347],
      nights: 2,
    })),
    days: Array.from({ length: communityTrip.durationDays }, (_, i) => ({
      dayNumber: i + 1,
      date: `Day ${i + 1}`,
      city: communityTrip.destinations[0],
      cityName: communityTrip.destinations[0],
      activities: [
        {
          id: `pub-act-${i}`,
          title: `Explore ${communityTrip.destinations[0]} Highlights & Heritage`,
          time: '10:00',
          durationMinutes: 120,
          cost: 800,
          category: 'Sightseeing',
          location: 'City Center',
          notes: 'Recommended morning highlights tour.',
          completed: false,
        }
      ]
    }))
  } : trips[0]);

  const handleCopyTrip = () => {
    const cloned = forkCommunityTrip(trip);
    try {
      confetti({ particleCount: 75, spread: 60 });
    } catch {}
    notifySuccess(`Itinerary "${trip.title}" copied to your account! Opening builder.`);
    navigate(`/trips/${cloned.id}/itinerary`);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      notifySuccess('Public itinerary link copied to clipboard!');
    }
  };

  if (!trip) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-slate-500">Shared itinerary not found.</p>
        <Link to="/community" className="text-xs font-bold text-indigo-600 mt-2 inline-block">
          Explore Community
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left animate-fade-in pb-16">
      {/* Top back bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/community"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Community Feed
        </Link>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" icon={Share2} onClick={handleShare}>
            Share Link
          </Button>
          <Button size="sm" variant="primary" icon={Copy} onClick={handleCopyTrip}>
            Copy Itinerary to My Trips
          </Button>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="rounded-3xl bg-slate-900 text-white overflow-hidden relative shadow-lg">
        <img
          src={trip.coverImage}
          alt={trip.title}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        <div className="relative z-10 p-6 sm:p-10 flex flex-col justify-between min-h-[260px]">
          {/* Author info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
              <img
                src={trip.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt={trip.author?.name}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-xs font-bold text-white">
                Curated by {trip.author?.name || 'Explorer'}
              </span>
            </div>

            <Badge variant="emerald" className="bg-emerald-500 text-white border-none font-bold">
              Public Itinerary
            </Badge>
          </div>

          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300 mb-1">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span>
                {trip.cities?.map((c) => c.name).join(' → ') || 'Multi-City Itinerary'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight mb-2 drop-shadow-sm">
              {trip.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {trip.description}
            </p>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Duration</span>
          <span className="text-lg font-extrabold text-slate-900">{trip.durationDays} Days</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Est. Budget</span>
          <span className="text-lg font-extrabold text-slate-900">{formatMoney(trip.budget)}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Stops</span>
          <span className="text-lg font-extrabold text-slate-900">{trip.cities?.length || 1} Cities</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Activities</span>
          <span className="text-lg font-extrabold text-indigo-600">
            {trip.days?.reduce((sum, d) => sum + (d.activities?.length || 0), 0)} Total
          </span>
        </div>
      </div>

      {/* Route Map & Day-by-Day Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <h3 className="text-lg font-bold text-slate-900">Day-by-Day Itinerary</h3>

          <div className="space-y-4">
            {trip.days?.map((day) => (
              <div
                key={day.dayNumber}
                className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-extrabold text-xs flex items-center justify-center">
                      D{day.dayNumber}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">
                      {day.cityName || day.city}
                    </h4>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{day.date}</span>
                </div>

                <div className="space-y-2">
                  {day.activities?.map((act) => (
                    <ActivityCard key={act.id} activity={act} readOnly />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo-600" />
              Route Map
            </h3>
            <TripMap cities={trip.cities || []} height="h-64" />
          </div>

          {/* Copy CTA box */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-md text-left space-y-3">
            <h3 className="text-base font-extrabold">Love this itinerary?</h3>
            <p className="text-xs text-indigo-100 leading-relaxed">
              Clone this complete route into your account. You can freely edit dates, swap activities, and adjust your personal budget.
            </p>
            <Button
              size="md"
              variant="secondary"
              icon={Copy}
              onClick={handleCopyTrip}
              className="w-full bg-white text-indigo-950 hover:bg-slate-100 font-bold"
            >
              Fork to My Trips
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PublicTrip;
