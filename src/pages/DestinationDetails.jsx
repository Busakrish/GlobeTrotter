import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getDestinationById } from '../data/mockDestinations';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import { useNotification } from '../context/NotificationContext';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import {
  MapPin,
  Calendar,
  DollarSign,
  Star,
  Heart,
  Plus,
  ArrowLeft,
  Clock,
  Compass,
  Utensils,
  Sparkles,
  Lightbulb,
  Share2,
} from 'lucide-react';

export function DestinationDetails() {
  const { destinationId } = useParams();
  const { formatMoney } = useAuth();
  const { trips, addCityToTrip, isSaved, toggleSavePlace } = useTrips();
  const { notifySuccess } = useNotification();
  const navigate = useNavigate();

  const destination = getDestinationById(destinationId) || getDestinationById('dest-mumbai');

  // Modal State
  const [addToTripModalOpen, setAddToTripModalOpen] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState(trips[0]?.id || '');
  const [nights, setNights] = useState(2);

  if (!destination) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-slate-500">Destination not found.</p>
        <Link to="/explore" className="text-xs font-bold text-indigo-600 mt-2 inline-block">
          Return to Explore
        </Link>
      </div>
    );
  }

  const saved = isSaved(destination.id);

  const handleToggleSave = () => {
    toggleSavePlace(destination);
    if (!saved) {
      notifySuccess(`Saved ${destination.name} to your Wishlist!`);
    } else {
      notifySuccess(`Removed ${destination.name} from saved places.`);
    }
  };

  const handleAddStopSubmit = (e) => {
    e.preventDefault();
    if (!selectedTripId) return;

    addCityToTrip(selectedTripId, {
      id: destination.id,
      name: destination.name,
      country: destination.country,
      coordinates: destination.coordinates,
      nights: Number(nights),
    });

    notifySuccess(`Added ${destination.name} (${nights} Nights) to your trip!`);
    setAddToTripModalOpen(false);
    navigate(`/trips/${selectedTripId}/itinerary`);
  };

  return (
    <div className="space-y-8 text-left animate-fade-in pb-16">
      {/* Top back & actions bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Destinations
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleSave}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              saved
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
            <span>{saved ? 'Saved to Wishlist' : 'Save Place'}</span>
          </button>

          <Button
            size="sm"
            variant="outline"
            icon={Plus}
            onClick={() => setAddToTripModalOpen(true)}
          >
            Add to Existing Trip
          </Button>

          <Link to={`/trips/create?city=${encodeURIComponent(destination.name)}`}>
            <Button size="sm" variant="primary" icon={Compass}>
              Plan New Trip
            </Button>
          </Link>
        </div>
      </div>

      {/* Large Hero Banner */}
      <div className="rounded-3xl bg-slate-900 text-white overflow-hidden relative shadow-lg">
        <img
          src={destination.bannerImage || destination.image}
          alt={destination.name}
          className="absolute inset-0 w-full h-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        <div className="relative z-10 p-6 sm:p-10 flex flex-col justify-between min-h-[320px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/20">
                {destination.costIndex} Tier
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md text-white border border-white/20">
                {destination.travelStyle} Vibe
              </span>
            </div>

            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-400 text-slate-950 shadow-sm">
              <Star className="w-3.5 h-3.5 fill-current" />
              {destination.rating} ({destination.reviewsCount} reviews)
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-semibold">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span>
                {destination.region ? `${destination.region}, ` : ''}
                {destination.country}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight drop-shadow-sm font-display">
              {destination.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-3xl leading-relaxed">
              {destination.description}
            </p>
          </div>
        </div>
      </div>

      {/* Snapshot Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Avg Daily Cost</span>
          <span className="text-lg font-extrabold text-slate-900">{formatMoney(destination.avgDailyCost)}</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Best Months</span>
          <span className="text-xs sm:text-sm font-extrabold text-slate-900 mt-1 block">
            {destination.bestMonths?.join(', ') || 'Year-round'}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Travel Style</span>
          <span className="text-sm font-extrabold text-indigo-600 mt-1 block">
            {destination.travelStyle}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">Atmosphere</span>
          <span className="text-xs font-extrabold text-slate-900 mt-1 block truncate">
            {destination.tags?.join(' • ')}
          </span>
        </div>
      </div>

      {/* Attractions & Experiences Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Top Attractions & Food */}
        <div className="lg:col-span-8 space-y-8">
          {/* Top Attractions */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              Must-Visit Attractions & Sights
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {destination.attractions?.map((att) => (
                <div
                  key={att.name}
                  className="rounded-2xl bg-white border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="h-36 w-full overflow-hidden bg-slate-100 relative">
                    <img
                      src={att.image}
                      alt={att.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-slate-900 shadow-xs">
                      {att.cost === 0 ? 'Free Entry' : formatMoney(att.cost)}
                    </div>
                  </div>

                  <div className="p-4 space-y-1.5">
                    <h4 className="text-sm font-bold text-slate-900">{att.name}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {att.description}
                    </p>
                    <span className="text-[11px] font-semibold text-indigo-600 block pt-1">
                      ⏱️ {att.timeNeeded}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Dining & Food */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-indigo-600" />
              Iconic Food Trails & Restaurants
            </h3>

            <div className="space-y-3">
              {destination.restaurants?.map((rest) => (
                <div
                  key={rest.name}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-xs"
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{rest.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">{rest.cuisine}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md">
                      <Star className="w-3 h-3 fill-current" /> {rest.rating}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-bold">
                      {rest.price}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Travel Tips & Activities */}
        <div className="lg:col-span-4 space-y-6">
          {/* Insider Travel Tips */}
          <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200/80 shadow-xs space-y-3 text-left">
            <h3 className="text-sm font-bold text-amber-950 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-amber-600" />
              Insider Travel Tips
            </h3>
            <div className="space-y-2.5">
              {destination.travelTips?.map((tip, i) => (
                <p key={i} className="text-xs text-amber-900 leading-relaxed flex items-start gap-2">
                  <span className="font-bold">•</span>
                  <span>{tip}</span>
                </p>
              ))}
            </div>
          </div>

          {/* Popular Activities */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 text-left">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Top Tours & Activities
            </h3>
            <div className="space-y-2">
              {destination.activities?.map((act, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800">
                  {act}
                </div>
              ))}
            </div>
          </div>

          {/* Plan Trip CTA card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-md text-left space-y-3">
            <h3 className="text-base font-extrabold">Ready to visit {destination.name}?</h3>
            <p className="text-xs text-indigo-100 leading-relaxed">
              Create a customized multi-city itinerary starting or stopping in {destination.name}.
            </p>
            <Link
              to={`/trips/create?city=${encodeURIComponent(destination.name)}`}
              className="block"
            >
              <Button
                size="md"
                variant="secondary"
                className="w-full bg-white text-indigo-950 hover:bg-slate-100 font-bold"
                icon={Compass}
              >
                Plan Itinerary
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Add To Trip Modal */}
      {addToTripModalOpen && (
        <Modal
          isOpen={addToTripModalOpen}
          onClose={() => setAddToTripModalOpen(false)}
          title={`Add ${destination.name} to Itinerary`}
          subtitle="Choose which trip to expand"
        >
          <form onSubmit={handleAddStopSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Trip Itinerary
              </label>
              <select
                value={selectedTripId}
                onChange={(e) => setSelectedTripId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {trips.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.durationDays} Days)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Nights to Stay
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={nights}
                onChange={(e) => setNights(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setAddToTripModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" icon={Plus}>
                Add Stop & Open Builder
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default DestinationDetails;
