import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mockCities } from '../data/mockCities';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import {
  Search,
  MapPin,
  Compass,
  Star,
  Plus,
  ArrowRight,
  Sparkles,
  Calendar,
  Filter,
} from 'lucide-react';

export function CitySearch() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const { trips, addCityToTrip } = useTrips();
  const { formatMoney } = useAuth();
  const { notifySuccess } = useNotification();
  const navigate = useNavigate();

  const [query, setQuery] = useState(initialQuery);
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [selectedCost, setSelectedCost] = useState('all');
  const [selectedTag, setSelectedTag] = useState('all');

  // Add to trip modal state
  const [targetCityModal, setTargetCityModal] = useState(null);
  const [selectedTripId, setSelectedTripId] = useState(trips[0]?.id || '');
  const [nights, setNights] = useState(2);

  // Available countries
  const countries = useMemo(() => {
    const set = new Set(mockCities.map((c) => c.country));
    return ['all', ...Array.from(set)];
  }, []);

  // Filtered cities list
  const filteredCities = useMemo(() => {
    return mockCities.filter((city) => {
      if (selectedCountry !== 'all' && city.country !== selectedCountry) return false;
      if (selectedCost !== 'all' && city.costIndex !== selectedCost) return false;
      if (selectedTag !== 'all' && !city.tags?.includes(selectedTag)) return false;

      if (query.trim()) {
        const q = query.toLowerCase();
        const matchName = city.name.toLowerCase().includes(q);
        const matchCountry = city.country.toLowerCase().includes(q);
        const matchRegion = city.region.toLowerCase().includes(q);
        const matchDesc = city.description.toLowerCase().includes(q);
        const matchTags = city.tags?.some((t) => t.toLowerCase().includes(q));
        return matchName || matchCountry || matchRegion || matchDesc || matchTags;
      }
      return true;
    });
  }, [query, selectedCountry, selectedCost, selectedTag]);

  const handleAddStopSubmit = (e) => {
    e.preventDefault();
    if (!targetCityModal || !selectedTripId) return;

    addCityToTrip(selectedTripId, {
      ...targetCityModal,
      nights: Number(nights),
    });

    const targetTrip = trips.find((t) => t.id === selectedTripId);
    notifySuccess(`Added ${targetCityModal.name} (${nights} Nights) to "${targetTrip?.title || 'Trip'}"!`);
    setTargetCityModal(null);
    navigate(`/trips/${selectedTripId}/itinerary`);
  };

  return (
    <div className="space-y-8 text-left animate-fade-in pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 mb-2">
          <Compass className="w-3.5 h-3.5" />
          Destination Explorer
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Discover Cities & Multi-Stop Destinations
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Explore top Indian and international cities, compare daily budgets, and add them directly to your itinerary.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Mumbai, Goa, Jaipur, Paris, Tokyo, Bali, culture, beaches..."
            className="w-full pl-12 pr-4 py-3 text-sm font-medium rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Country filter */}
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Countries</option>
            {countries.filter((c) => c !== 'all').map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Cost Index */}
          <select
            value={selectedCost}
            onChange={(e) => setSelectedCost(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Cost Tiers</option>
            <option value="$">$ (Budget - under ₹2,500/day)</option>
            <option value="$$">$$ (Moderate - ₹2,500 - ₹5,000/day)</option>
            <option value="$$$">$$$ (Premium - ₹5,000 - ₹10,000/day)</option>
            <option value="$$$$">$$$$ (Luxury - ₹10,000+/day)</option>
          </select>

          {/* Tag Filter */}
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Styles & Vibes</option>
            <option value="Beach">Beach & Coastal</option>
            <option value="Heritage">Heritage & Forts</option>
            <option value="Foodie">Foodie & Dining</option>
            <option value="Adventure">Adventure & Trekking</option>
            <option value="Romantic">Romantic & Scenic</option>
            <option value="Nightlife">Nightlife & Drinks</option>
          </select>

          {(selectedCountry !== 'all' || selectedCost !== 'all' || selectedTag !== 'all' || query) && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedCountry('all');
                setSelectedCost('all');
                setSelectedTag('all');
              }}
              className="text-xs font-bold text-indigo-600 hover:underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Cities Grid */}
      {filteredCities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCities.map((city) => (
            <div
              key={city.id}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all card-hover"
            >
              <div>
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                  <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md text-slate-900">
                      {city.costIndex} Cost Index
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400/90 text-slate-950 shadow-xs">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {city.rating || 4.8}
                    </span>
                  </div>

                  <div className="absolute bottom-3 inset-x-3 text-white">
                    <h3 className="text-xl font-bold">{city.name}</h3>
                    <p className="text-xs text-slate-300">
                      {city.country} • {city.region}
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {city.description}
                  </p>

                  {/* Best Months */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Best Time: <strong className="text-slate-800">{city.bestMonths.join(', ')}</strong></span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {city.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-3 mt-auto">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Budget</span>
                  <span className="text-sm font-extrabold text-slate-900">
                    {formatMoney(city.avgDailyCost)} <span className="text-xs font-normal text-slate-500">/ day</span>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="primary"
                    icon={Plus}
                    onClick={() => setTargetCityModal(city)}
                  >
                    Add to Trip
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Compass}
          title="No destinations match your search"
          description="Try removing your filters or searching for another city name."
          actionText="Reset All Filters"
          onAction={() => {
            setQuery('');
            setSelectedCountry('all');
            setSelectedCost('all');
            setSelectedTag('all');
          }}
        />
      )}

      {/* Add City To Trip Modal */}
      {targetCityModal && (
        <Modal
          isOpen={!!targetCityModal}
          onClose={() => setTargetCityModal(null)}
          title={`Add ${targetCityModal.name} to Trip`}
          subtitle="Choose which itinerary to expand with this city stop"
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

            <Input
              label="Nights to Stay in this City"
              type="number"
              min="1"
              max="30"
              value={nights}
              onChange={(e) => setNights(Number(e.target.value))}
              required
            />

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
              💡 <strong>Tip:</strong> Adding this stop will append a new day and transit segment to your selected trip.
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setTargetCityModal(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" icon={Plus}>
                Confirm & Open Builder
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default CitySearch;
