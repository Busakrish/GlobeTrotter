import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import {
  Heart,
  MapPin,
  Star,
  Plus,
  Trash2,
  Compass,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export function SavedPlaces() {
  const { savedPlaces, removeSavedPlace, trips, addCityToTrip } = useTrips();
  const { formatMoney } = useAuth();
  const { notifySuccess } = useNotification();
  const navigate = useNavigate();

  const [filterType, setFilterType] = useState('all'); // all, Destination, Attraction, Restaurant

  // Add to trip modal state
  const [targetPlaceModal, setTargetPlaceModal] = useState(null);
  const [selectedTripId, setSelectedTripId] = useState(trips[0]?.id || '');
  const [nights, setNights] = useState(2);

  const filteredPlaces = savedPlaces.filter((place) => {
    if (filterType === 'all') return true;
    return place.type?.toLowerCase() === filterType.toLowerCase();
  });

  const handleAddStopSubmit = (e) => {
    e.preventDefault();
    if (!targetPlaceModal || !selectedTripId) return;

    addCityToTrip(selectedTripId, {
      id: targetPlaceModal.id,
      name: targetPlaceModal.name,
      country: targetPlaceModal.country,
      coordinates: targetPlaceModal.coordinates || [18.9220, 72.8347],
      nights: Number(nights),
    });

    notifySuccess(`Added ${targetPlaceModal.name} (${nights} Nights) to your trip!`);
    setTargetPlaceModal(null);
    navigate(`/trips/${selectedTripId}/itinerary`);
  };

  const handleRemove = (placeId, name) => {
    removeSavedPlace(placeId);
    notifySuccess(`Removed ${name} from saved wishlist.`);
  };

  return (
    <div className="space-y-8 text-left animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100 mb-2">
            <Heart className="w-3.5 h-3.5 fill-current" />
            Wishlist & Bookmarks
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Saved Places & Sights ({savedPlaces.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Keep track of dream destinations, scenic viewpoints, and restaurants you want to include in future trips.
          </p>
        </div>

        <Link to="/explore">
          <Button variant="outline" size="sm" icon={Compass}>
            Discover More Places
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {['all', 'Destination', 'Attraction', 'Restaurant'].map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setFilterType(type)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all capitalize ${
              filterType === type
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {type === 'all' ? 'All Saved Places' : `${type}s`}
          </button>
        ))}
      </div>

      {/* Saved Places Grid */}
      {filteredPlaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlaces.map((place) => (
            <div
              key={place.id}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all card-hover"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={place.image}
                    alt={place.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                  <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-md text-slate-900">
                      {place.type || 'Destination'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemove(place.id, place.name)}
                      className="p-1.5 rounded-full bg-rose-500 text-white shadow-sm hover:scale-110 transition-transform"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="absolute bottom-3 inset-x-3 flex items-end justify-between text-white">
                    <div>
                      <span className="text-xs text-indigo-300 font-semibold flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {place.country}
                      </span>
                      <h3 className="text-base font-bold truncate leading-tight">{place.name}</h3>
                    </div>
                    {place.rating && (
                      <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-xs">
                        <Star className="w-3 h-3 fill-current" />
                        {place.rating}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {place.description || 'Saved travel highlight.'}
                  </p>
                  {place.avgCost && (
                    <span className="text-xs font-bold text-slate-900 block">
                      Est. Budget: {formatMoney(place.avgCost)} <span className="text-[10px] font-normal text-slate-500">/ day</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                <Link
                  to={place.id?.startsWith('dest-') ? `/explore/${place.id}` : '/explore'}
                  className="text-xs font-bold text-slate-700 hover:text-indigo-600 flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>

                <Button
                  size="xs"
                  variant="primary"
                  icon={Plus}
                  onClick={() => setTargetPlaceModal(place)}
                >
                  Add to Trip
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Heart}
          title="No saved places found"
          description="Click the heart icon on any destination or attraction to save it for easy access."
          actionText="Explore Destinations"
          actionIcon={Compass}
          onAction={() => navigate('/explore')}
        />
      )}

      {/* Add To Trip Modal */}
      {targetPlaceModal && (
        <Modal
          isOpen={!!targetPlaceModal}
          onClose={() => setTargetPlaceModal(null)}
          title={`Add ${targetPlaceModal.name} to Trip`}
          subtitle="Choose which itinerary to expand"
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
              <Button variant="outline" size="sm" onClick={() => setTargetPlaceModal(null)}>
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

export default SavedPlaces;
