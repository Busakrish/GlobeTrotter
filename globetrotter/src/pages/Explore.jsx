import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { destinationsApi } from '../services/api';
import { mockDestinations, destinationCategories } from '../data/mockDestinations';
import { useTrips } from '../context/TripContext';
import { useNotification } from '../context/NotificationContext';
import DestinationCard from '../components/destination/DestinationCard';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import {
  Search,
  Filter,
  MapPin,
  Compass,
  Star,
  Plus,
  Sliders,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

export function Explore() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const { trips, addCityToTrip } = useTrips();
  const { notifySuccess } = useNotification();
  const navigate = useNavigate();

  const [destinations, setDestinations] = useState(mockDestinations);
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedCostTier, setSelectedCostTier] = useState('all');
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [minRating, setMinRating] = useState('all');

  // Add to Trip Modal
  const [targetDestModal, setTargetDestModal] = useState(null);
  const [selectedTripId, setSelectedTripId] = useState(trips[0]?.id || '');
  const [nights, setNights] = useState(2);

  // Fetch real destinations from API
  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      try {
        const res = await destinationsApi.getDestinations();
        if (res?.success && res.destinations?.length > 0) {
          setDestinations(res.destinations);
        }
      } catch (e) {
        console.warn('[Explore] Fallback to mock catalog:', e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, []);

  // Update query if URL search params change
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setQuery(q);
    }
  }, [searchParams]);

  // Available countries
  const countries = useMemo(() => {
    const list = Array.from(new Set(destinations.map((d) => d.country)));
    return ['all', ...list];
  }, [destinations]);

  // Filter logic
  const filteredDestinations = useMemo(() => {
    return destinations.filter((dest) => {
      // Category
      if (selectedCategory !== 'all') {
        const matchesMain = dest.category === selectedCategory;
        const matchesSecondary = dest.secondaryCategories?.includes(selectedCategory);
        if (!matchesMain && !matchesSecondary) return false;
      }

      // Country
      if (selectedCountry !== 'all' && dest.country !== selectedCountry) return false;

      // Cost tier
      if (selectedCostTier !== 'all' && dest.costIndex !== selectedCostTier) return false;

      // Style
      if (selectedStyle !== 'all' && dest.travelStyle !== selectedStyle) return false;

      // Rating
      if (minRating !== 'all' && (dest.rating || 0) < Number(minRating)) return false;

      // Search Query
      if (query.trim()) {
        const q = query.toLowerCase();
        const matchName = dest.name?.toLowerCase().includes(q);
        const matchCountry = dest.country?.toLowerCase().includes(q);
        const matchRegion = dest.region?.toLowerCase().includes(q);
        const matchDesc = dest.description?.toLowerCase().includes(q);
        const matchTags = dest.tags?.some((t) => t.toLowerCase().includes(q));
        return matchName || matchCountry || matchRegion || matchDesc || matchTags;
      }

      return true;
    });
  }, [destinations, query, selectedCategory, selectedCountry, selectedCostTier, selectedStyle, minRating]);

  const handleResetFilters = () => {
    setQuery('');
    setSelectedCategory('all');
    setSelectedCountry('all');
    setSelectedCostTier('all');
    setSelectedStyle('all');
    setMinRating('all');
  };

  const handleAddStopSubmit = (e) => {
    e.preventDefault();
    if (!targetDestModal || !selectedTripId) return;

    addCityToTrip(selectedTripId, {
      id: targetDestModal.id,
      name: targetDestModal.name,
      country: targetDestModal.country,
      coordinates: targetDestModal.coordinates,
      nights: Number(nights),
    });

    notifySuccess(`Added ${targetDestModal.name} (${nights} Nights) to your trip!`);
    setTargetDestModal(null);
    navigate(`/trips/${selectedTripId}/itinerary`);
  };

  return (
    <div className="space-y-8 text-left animate-fade-in pb-16">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#714B67] uppercase tracking-wider mb-1">
            <Compass className="w-3.5 h-3.5" />
            Curated World Destinations
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B26] tracking-tight font-display">
            Discover Your Next Destination
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Explore {destinations.length} hand-picked cities with daily budget benchmarks, attractions, and seasonal guides.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleResetFilters} icon={RotateCcw}>
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-[6px] bg-white border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.06)] space-y-3">
        {/* Main Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by city name, country, attractions, or vibes (e.g. beaches, forts, street food)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium rounded-[6px] bg-[#F1F1F3] text-[#1B1B26] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#714B67]/30 border border-slate-200 transition-all"
          />
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 pt-1">
          {/* Category */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-[6px] border border-slate-200 bg-white text-xs font-semibold text-[#1B1B26] focus:outline-none focus:ring-1 focus:ring-[#714B67]"
            >
              <option value="all">All Categories</option>
              {destinationCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Country */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-[6px] border border-slate-200 bg-white text-xs font-semibold text-[#1B1B26] focus:outline-none focus:ring-1 focus:ring-[#714B67]"
            >
              <option value="all">All Countries</option>
              {countries.filter((c) => c !== 'all').map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Cost Tier */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Budget Tier
            </label>
            <select
              value={selectedCostTier}
              onChange={(e) => setSelectedCostTier(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-[6px] border border-slate-200 bg-white text-xs font-semibold text-[#1B1B26] focus:outline-none focus:ring-1 focus:ring-[#714B67]"
            >
              <option value="all">Any Budget</option>
              <option value="Budget">Budget Friendly ($)</option>
              <option value="Moderate">Moderate ($$)</option>
              <option value="Luxury">Luxury ($$$)</option>
            </select>
          </div>

          {/* Travel Style */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Travel Vibe
            </label>
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-[6px] border border-slate-200 bg-white text-xs font-semibold text-[#1B1B26] focus:outline-none focus:ring-1 focus:ring-[#714B67]"
            >
              <option value="all">All Styles</option>
              <option value="Relaxation">Relaxation & Beach</option>
              <option value="Heritage & Architecture">Heritage & Palaces</option>
              <option value="Urban Exploration">Urban Exploration</option>
              <option value="Nature & Adventure">Nature & Adventure</option>
            </select>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Min Rating
            </label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-[6px] border border-slate-200 bg-white text-xs font-semibold text-[#1B1B26] focus:outline-none focus:ring-1 focus:ring-[#714B67]"
            >
              <option value="all">Any Rating</option>
              <option value="4.5">★ 4.5+ Stars</option>
              <option value="4.8">★ 4.8+ Stars</option>
              <option value="4.9">★ 4.9+ Stars</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count & Quick Category Pills */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1">
        <div className="flex items-center gap-2">
          {['all', 'beach', 'historical', 'mountain', 'city'].map((catKey) => {
            const catLabel = catKey === 'all' ? 'All Places' : catKey === 'beach' ? '🏖️ Beaches' : catKey === 'historical' ? '🏰 Palaces' : catKey === 'mountain' ? '🏔️ Mountains' : '🏙️ Cities';
            return (
              <button
                key={catKey}
                type="button"
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3 py-1 rounded-[6px] text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === catKey
                    ? 'bg-[#714B67] text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-[#1B1B26]/80 hover:bg-slate-50'
                }`}
              >
                {catLabel}
              </button>
            );
          })}
        </div>

        <span className="text-xs font-bold text-slate-500 shrink-0">
          Showing <strong>{filteredDestinations.length}</strong> destination(s)
        </span>
      </div>

      {/* Destination Grid */}
      {filteredDestinations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((dest, i) => (
            <DestinationCard
              key={dest.id || dest._id}
              destination={dest}
              index={i}
              onAddToTrip={(d) => setTargetDestModal(d)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No matching destinations found"
          description="Try broadening your search term, clearing category filters, or exploring all world regions."
          actionText="Clear All Filters"
          onAction={handleResetFilters}
        />
      )}

      {/* Add Destination To Trip Modal */}
      {targetDestModal && (
        <Modal
          isOpen={!!targetDestModal}
          onClose={() => setTargetDestModal(null)}
          title={`Add ${targetDestModal.name} to Itinerary`}
          subtitle="Select which itinerary you want to expand with this stop"
        >
          <form onSubmit={handleAddStopSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Trip Itinerary
              </label>
              <select
                value={selectedTripId}
                onChange={(e) => setSelectedTripId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[6px] border border-slate-300 bg-white text-xs font-semibold text-[#1B1B26] focus:outline-none focus:ring-2 focus:ring-[#714B67]"
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
                Nights to Stay in {targetDestModal.name}
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={nights}
                onChange={(e) => setNights(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-[6px] border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#714B67]"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setTargetDestModal(null)}>
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

export default Explore;
