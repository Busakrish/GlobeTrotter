import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import {
  Search,
  Clock,
  DollarSign,
  Star,
  Plus,
  MapPin,
  Sparkles,
  Filter,
  Layers,
} from 'lucide-react';

export const activityCategories = [
  'All',
  'Sightseeing',
  'Food & Dining',
  'Culture & Heritage',
  'Relaxation & Beach',
  'Adventure & Sports',
  'Shopping & Nightlife',
];

export function ActivitySearch() {
  const { trips, addActivityToDay, activities, cities } = useTrips();
  const { formatMoney } = useAuth();
  const { notifySuccess } = useNotification();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState('all');

  // Add to Day modal state
  const [targetActivityModal, setTargetActivityModal] = useState(null);
  const [selectedTripId, setSelectedTripId] = useState(trips[0]?.id || '');
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [scheduledTime, setScheduledTime] = useState('10:00');

  const selectedTrip = trips.find((t) => t.id === selectedTripId) || trips[0];

  // Filtered activities
  const filteredActivities = useMemo(() => {
    return (activities || []).filter((act) => {
      if (selectedCategory !== 'all' && act.categoryKey !== selectedCategory && act.category !== selectedCategory) return false;
      if (selectedCity !== 'all' && act.cityName !== selectedCity) return false;
      if (selectedTimeOfDay !== 'all' && act.timeOfDay !== selectedTimeOfDay) return false;

      if (query.trim()) {
        const q = query.toLowerCase();
        const matchTitle = (act.title || act.name)?.toLowerCase().includes(q);
        const matchCity = act.cityName?.toLowerCase().includes(q);
        const matchDesc = act.description?.toLowerCase().includes(q);
        const matchCat = act.category?.toLowerCase().includes(q);
        return matchTitle || matchCity || matchDesc || matchCat;
      }
      return true;
    });
  }, [activities, query, selectedCategory, selectedCity, selectedTimeOfDay]);

  const handleAddActivitySubmit = (e) => {
    e.preventDefault();
    if (!targetActivityModal || !selectedTripId) return;

    addActivityToDay(selectedTripId, selectedDayNumber, {
      title: targetActivityModal.title,
      time: scheduledTime,
      durationMinutes: targetActivityModal.duration,
      cost: targetActivityModal.cost,
      category: targetActivityModal.category,
      location: targetActivityModal.cityName,
      notes: targetActivityModal.description,
    });

    notifySuccess(`Added "${targetActivityModal.title}" to Day ${selectedDayNumber} of "${selectedTrip?.title}"!`);
    setTargetActivityModal(null);
    navigate(`/trips/${selectedTripId}/itinerary`);
  };

  return (
    <div className="space-y-8 text-left animate-fade-in pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Activity & Experience Finder
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Discover Activities & Tours
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Browse guided heritage walks, scuba dives, cooking workshops, and sunset cruises with estimated durations and costs.
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
            placeholder="Search scuba, street food, palace tours, sunset boat, Louvre, teamLab..."
            className="w-full pl-12 pr-4 py-3 text-sm font-medium rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Category filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:outline-none"
          >
            {activityCategories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>

          {/* City filter */}
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">All Cities</option>
            {(cities || []).map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Time of Day filter */}
          <select
            value={selectedTimeOfDay}
            onChange={(e) => setSelectedTimeOfDay(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:outline-none"
          >
            <option value="all">Any Time of Day</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
            <option value="Full Day">Full Day</option>
          </select>

          {(selectedCategory !== 'all' || selectedCity !== 'all' || selectedTimeOfDay !== 'all' || query) && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setSelectedCategory('all');
                setSelectedCity('all');
                setSelectedTimeOfDay('all');
              }}
              className="text-xs font-bold text-indigo-600 hover:underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Activities Grid */}
      {filteredActivities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((act) => (
            <div
              key={act.id}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all card-hover"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={act.image}
                    alt={act.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                  <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/90 backdrop-blur-md text-slate-900">
                      {act.category}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400/90 text-slate-950 shadow-xs">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      {act.rating} ({act.reviewsCount})
                    </span>
                  </div>

                  <div className="absolute bottom-3 inset-x-3 text-white">
                    <span className="text-xs text-indigo-300 font-semibold flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {act.cityName}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-1 mb-2">
                    {act.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {act.description}
                  </p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pb-3 border-b border-slate-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      {act.duration} mins
                    </span>
                    <span>•</span>
                    <span>Time: <strong>{act.timeOfDay}</strong></span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-5 pt-0 flex items-center justify-between gap-3 mt-auto">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Cost</span>
                  <span className="text-base font-extrabold text-emerald-700">
                    {act.cost > 0 ? formatMoney(act.cost) : 'Free'}
                  </span>
                </div>

                <Button
                  size="sm"
                  variant="primary"
                  icon={Plus}
                  onClick={() => {
                    setTargetActivityModal(act);
                    setScheduledTime(act.suggestedTime || '10:00');
                  }}
                >
                  Add to Itinerary
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="No activities match your filters"
          description="Try broadening your category or location filters."
          actionText="Reset Filters"
          onAction={() => {
            setQuery('');
            setSelectedCategory('all');
            setSelectedCity('all');
            setSelectedTimeOfDay('all');
          }}
        />
      )}

      {/* Add Activity to Trip Day Modal */}
      {targetActivityModal && (
        <Modal
          isOpen={!!targetActivityModal}
          onClose={() => setTargetActivityModal(null)}
          title={`Add "${targetActivityModal.title}"`}
          subtitle="Choose which itinerary and schedule slot to add this activity to"
        >
          <form onSubmit={handleAddActivitySubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Trip Itinerary
              </label>
              <select
                value={selectedTripId}
                onChange={(e) => {
                  setSelectedTripId(e.target.value);
                  setSelectedDayNumber(1);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {trips.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.durationDays} Days)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Day
                </label>
                <select
                  value={selectedDayNumber}
                  onChange={(e) => setSelectedDayNumber(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {selectedTrip?.days?.map((d) => (
                    <option key={d.dayNumber} value={d.dayNumber}>
                      Day {d.dayNumber}: {d.cityName || d.city} ({d.date})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Start Time
                </label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
              Activity duration: <strong>{targetActivityModal.duration} mins</strong> • Cost: <strong>{formatMoney(targetActivityModal.cost)}</strong>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setTargetActivityModal(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" icon={Plus}>
                Add to Itinerary Day {selectedDayNumber}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default ActivitySearch;
