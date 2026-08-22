import { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { mockCities } from '../data/mockCities';
import { mockActivities, activityCategories } from '../data/mockActivities';
import TripHeader from '../components/trip/TripHeader';
import CityStopCard from '../components/trip/CityStopCard';
import ActivityCard from '../components/trip/ActivityCard';
import ConflictAlert from '../components/trip/ConflictAlert';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input, { TextArea, Select } from '../components/common/Input';
import EmptyState from '../components/common/EmptyState';
import {
  Plus,
  Clock,
  Sparkles,
  Calendar,
  MapPin,
  Trash2,
  Copy,
  Utensils,
  Camera,
  Sun,
  Sunset,
  Moon,
  Compass,
  Search,
} from 'lucide-react';

const QUICK_PRESETS = [
  {
    title: 'Sunrise Walk & Local Breakfast',
    time: '08:00',
    durationMinutes: 90,
    cost: 350,
    category: 'Food & Dining',
    notes: 'Start the day with fresh regional breakfast specialties and morning stroll.',
    icon: Sun,
  },
  {
    title: 'Historic Landmark & Heritage Tour',
    time: '10:30',
    durationMinutes: 120,
    cost: 600,
    category: 'Sightseeing',
    notes: 'Guided architectural exploration and iconic photography spots.',
    icon: Camera,
  },
  {
    title: 'Authentic Regional Food Trail',
    time: '13:30',
    durationMinutes: 90,
    cost: 800,
    category: 'Food & Dining',
    notes: 'Sample top local delicacies and popular eateries.',
    icon: Utensils,
  },
  {
    title: 'Golden Hour Sunset Viewpoint',
    time: '17:30',
    durationMinutes: 90,
    cost: 200,
    category: 'Relaxation',
    notes: 'Scenic panoramic viewpoint to catch the sunset.',
    icon: Sunset,
  },
  {
    title: 'Rooftop Dinner & Evening Vibes',
    time: '20:00',
    durationMinutes: 120,
    cost: 1500,
    category: 'Nightlife',
    notes: 'Unwind with great ambience, drinks, and dinner.',
    icon: Moon,
  },
];

export function ItineraryBuilder() {
  const { tripId, id } = useParams();
  const navigate = useNavigate();
  const {
    trips,
    activeTrip,
    setActiveTripId,
    getTripById,
    addCityToTrip,
    removeCityFromTrip,
    reorderCities,
    addActivityToDay,
    removeActivity,
    updateActivity,
    toggleActivityCompleted,
    detectScheduleConflicts,
    resolveConflict,
    addItineraryDay,
    deleteItineraryDay,
    updateItineraryDayCity,
  } = useTrips();

  const { formatMoney } = useAuth();
  const { notifySuccess, notifyWarning } = useNotification();

  const targetId = tripId || id;
  const trip = getTripById(targetId) || activeTrip || trips[0];

  useEffect(() => {
    if (trip?.id) {
      setActiveTripId(trip.id);
    }
  }, [trip?.id, setActiveTripId]);

  const [selectedDayNumber, setSelectedDayNumber] = useState(1);
  const [filterTimeOfDay, setFilterTimeOfDay] = useState('all'); // 'all' | 'morning' | 'afternoon' | 'evening'
  const [filterCategory, setFilterCategory] = useState('all');
  const [activitySearchTerm, setActivitySearchTerm] = useState('');

  // Modals state
  const [addCityModalOpen, setAddCityModalOpen] = useState(false);
  const [addActivityModalOpen, setAddActivityModalOpen] = useState(false);
  const [editActivityModalOpen, setEditActivityModalOpen] = useState(false);
  const [selectedActivityToEdit, setSelectedActivityToEdit] = useState(null);
  const [changeCityModalOpen, setChangeCityModalOpen] = useState(false);
  const [selectedCityForDay, setSelectedCityForDay] = useState('');

  // New city state
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [selectedCityToAdd, setSelectedCityToAdd] = useState(mockCities[0]?.name || 'Goa');
  const [newCityNights, setNewCityNights] = useState(2);

  // Activity form state
  const [activityMode, setActivityMode] = useState('catalog'); // 'catalog' | 'custom'
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState('all');
  const [catalogSearch, setCatalogSearch] = useState('');

  const [customActivity, setCustomActivity] = useState({
    title: '',
    time: '10:00',
    durationMinutes: 90,
    cost: 500,
    category: 'Sightseeing',
    location: '',
    notes: '',
  });

  // Ensure day selection stays valid
  const currentDay = useMemo(() => {
    if (!trip?.days || trip.days.length === 0) return null;
    return trip.days.find((d) => d.dayNumber === selectedDayNumber) || trip.days[0];
  }, [trip?.days, selectedDayNumber]);

  useEffect(() => {
    if (currentDay && currentDay.dayNumber !== selectedDayNumber) {
      setSelectedDayNumber(currentDay.dayNumber);
    }
  }, [currentDay, selectedDayNumber]);

  if (!trip) {
    return (
      <div className="max-w-xl mx-auto text-center py-20 px-4">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-100 shadow-sm">
          <Compass className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 mb-2">No Active Itinerary Found</h2>
        <p className="text-sm text-slate-500 mb-6">
          Create your first travel itinerary or select one from your saved trips library to start building day schedules.
        </p>
        <Button to="/trips/create" size="md" variant="primary" icon={Plus}>
          Create New Trip
        </Button>
      </div>
    );
  }

  const conflicts = detectScheduleConflicts(trip);

  // Day Stats
  const dayActivities = currentDay?.activities || [];
  const totalDayCost = dayActivities.reduce((sum, a) => sum + (Number(a.cost || a.estimatedCost) || 0), 0);
  const totalDayDuration = dayActivities.reduce((sum, a) => sum + (Number(a.durationMinutes) || 60), 0);
  const completedActivitiesCount = dayActivities.filter((a) => a.completed).length;

  // Filtered Day Activities
  const filteredDayActivities = dayActivities.filter((act) => {
    if (activitySearchTerm.trim()) {
      const q = activitySearchTerm.toLowerCase();
      const matchTitle = act.title?.toLowerCase().includes(q);
      const matchLoc = act.location?.toLowerCase().includes(q);
      const matchNotes = act.notes?.toLowerCase().includes(q);
      if (!matchTitle && !matchLoc && !matchNotes) return false;
    }

    if (filterCategory !== 'all' && act.category !== filterCategory) {
      return false;
    }

    if (filterTimeOfDay !== 'all') {
      const hour = parseInt(act.time?.split(':')[0] || '12', 10);
      if (filterTimeOfDay === 'morning' && hour >= 12) return false;
      if (filterTimeOfDay === 'afternoon' && (hour < 12 || hour >= 17)) return false;
      if (filterTimeOfDay === 'evening' && hour < 17) return false;
    }

    return true;
  });

  // Handler for moving city stop
  const handleMoveCity = (index, direction) => {
    const newCities = [...(trip.cities || [])];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newCities.length) return;

    const temp = newCities[index];
    newCities[index] = newCities[targetIndex];
    newCities[targetIndex] = temp;

    reorderCities(trip.id, newCities);
    notifySuccess('Reordered multi-city route stops.');
  };

  // Handler for adding a city
  const handleAddCitySubmit = (e) => {
    e.preventDefault();
    const cityData = mockCities.find((c) => c.name === selectedCityToAdd) || {
      name: selectedCityToAdd,
      country: 'India',
      coordinates: [15.2993, 74.1240],
      nights: newCityNights,
    };

    addCityToTrip(trip.id, { ...cityData, nights: newCityNights });
    setAddCityModalOpen(false);
    notifySuccess(`Added ${selectedCityToAdd} (${newCityNights} Nights) to your trip!`);
  };

  // Handler for adding an activity from catalog
  const handleAddFromCatalog = (act) => {
    if (!currentDay) {
      addItineraryDay(trip.id, { cityName: act.cityName || trip.cities?.[0]?.name || 'Destination' });
    }

    addActivityToDay(trip.id, selectedDayNumber, {
      title: act.title,
      time: act.suggestedTime || '10:00',
      durationMinutes: act.duration,
      cost: act.cost,
      category: act.category,
      location: act.cityName,
      notes: act.description,
    });

    setAddActivityModalOpen(false);
    notifySuccess(`Added "${act.title}" to Day ${selectedDayNumber}!`);
  };

  // Handler for quick presets
  const handleAddPreset = (preset) => {
    if (!currentDay) {
      addItineraryDay(trip.id, { cityName: trip.cities?.[0]?.name || 'Destination' });
    }

    addActivityToDay(trip.id, selectedDayNumber, {
      title: preset.title,
      time: preset.time,
      durationMinutes: preset.durationMinutes,
      cost: preset.cost,
      category: preset.category,
      location: currentDay?.cityName || currentDay?.city || 'City Center',
      notes: preset.notes,
    });

    notifySuccess(`Added "${preset.title}" to Day ${selectedDayNumber}!`);
  };

  // Handler for custom activity creation
  const handleCustomActivitySubmit = (e) => {
    e.preventDefault();
    if (!customActivity.title.trim()) return;

    if (!currentDay) {
      addItineraryDay(trip.id, { cityName: trip.cities?.[0]?.name || 'Destination' });
    }

    addActivityToDay(trip.id, selectedDayNumber, customActivity);
    setAddActivityModalOpen(false);
    setCustomActivity({
      title: '',
      time: '10:00',
      durationMinutes: 90,
      cost: 500,
      category: 'Sightseeing',
      location: '',
      notes: '',
    });
    notifySuccess(`Added custom activity to Day ${selectedDayNumber}!`);
  };

  // Handler for saving edited activity
  const handleSaveEditedActivity = (e) => {
    e.preventDefault();
    if (!selectedActivityToEdit) return;

    updateActivity(trip.id, selectedDayNumber, selectedActivityToEdit.id, selectedActivityToEdit);
    setEditActivityModalOpen(false);
    setSelectedActivityToEdit(null);
    notifySuccess('Activity updated successfully.');
  };

  // Handler for adding a new day
  const handleAddNewDay = () => {
    const nextCity = trip.cities?.[trip.cities.length - 1]?.name || 'Destination';
    addItineraryDay(trip.id, { cityName: nextCity });
    const nextNum = (trip.days?.length || 0) + 1;
    setSelectedDayNumber(nextNum);
    notifySuccess(`Added Day ${nextNum} to itinerary!`);
  };

  // Handler for deleting current day
  const handleDeleteCurrentDay = () => {
    if ((trip.days?.length || 0) <= 1) {
      notifyWarning('Itinerary must have at least one day.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete Day ${selectedDayNumber}?`)) {
      deleteItineraryDay(trip.id, selectedDayNumber);
      setSelectedDayNumber(Math.max(1, selectedDayNumber - 1));
      notifyWarning(`Deleted Day ${selectedDayNumber} from itinerary.`);
    }
  };

  // Copy full itinerary summary to clipboard
  const handleCopyItinerary = () => {
    if (!trip.days || trip.days.length === 0) return;

    let text = `🗺️ ITINERARY: ${trip.title}\n📅 Dates: ${trip.startDate} - ${trip.endDate} (${trip.durationDays} Days)\n\n`;
    trip.days.forEach((d) => {
      text += `📍 Day ${d.dayNumber}: ${d.cityName || d.city} (${d.date})\n`;
      if (d.activities && d.activities.length > 0) {
        d.activities.forEach((a) => {
          text += `  • ${a.time} - ${a.title} [${a.category}] (${formatMoney(a.cost)})\n`;
        });
      } else {
        text += `  • Free day / Open schedule\n`;
      }
      text += '\n';
    });

    navigator.clipboard.writeText(text);
    notifySuccess('Full itinerary schedule copied to clipboard!');
  };

  const availableCityCatalog = mockCities.filter(
    (c) =>
      c.name.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
      c.country.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  const filteredCatalogActivities = mockActivities.filter((act) => {
    if (catalogCategoryFilter !== 'all' && act.categoryKey !== catalogCategoryFilter) {
      return false;
    }
    if (catalogSearch.trim()) {
      const q = catalogSearch.toLowerCase();
      return (
        act.title.toLowerCase().includes(q) ||
        act.cityName.toLowerCase().includes(q) ||
        act.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 text-left animate-fade-in pb-20">
      {/* 1. Trip Header with Navigation Tabs */}
      <TripHeader trip={trip} activeTab="itinerary" />

      {/* 2. Schedule Conflict Alert Banner (Real-time detection) */}
      <ConflictAlert
        conflicts={conflicts}
        onResolve={(dayNum, actId, newTime) => {
          resolveConflict(trip.id, dayNum, actId, newTime);
          notifySuccess(`Resolved schedule conflict! Moved activity to ${newTime}.`);
        }}
      />

      {/* 3. Global Itinerary Quick Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-extrabold">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>{trip.title}</span>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {trip.days?.length || trip.durationDays} Days Planned
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              {trip.cities?.map((c) => c.name).join(' → ') || 'Multi-City Itinerary'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="xs"
            variant="outline"
            icon={Copy}
            onClick={handleCopyItinerary}
            className="text-xs font-bold"
          >
            Copy Summary
          </Button>

          <Button
            size="xs"
            variant="outline"
            icon={Plus}
            onClick={handleAddNewDay}
            className="text-xs font-bold text-indigo-700 bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
          >
            Add Day { (trip.days?.length || 0) + 1 }
          </Button>
        </div>
      </div>

      {/* 4. Two-Column Layout: Left (Multi-City Route Stops) & Right (Day Schedule Builder) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Multi-City Route Chain Manager */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Multi-City Route Chain</h3>
              <p className="text-xs text-slate-500">Ordered stops & transit connections</p>
            </div>
            <Button
              size="sm"
              variant="outline"
              icon={Plus}
              onClick={() => setAddCityModalOpen(true)}
              className="text-xs font-bold text-indigo-700 bg-indigo-50 border-indigo-200 hover:bg-indigo-100"
            >
              Add City Stop
            </Button>
          </div>

          {/* Stops List */}
          <div className="space-y-3">
            {trip.cities?.map((stop, idx) => (
              <CityStopCard
                key={stop.id || `stop-${idx}`}
                stop={stop}
                index={idx}
                totalStops={trip.cities.length}
                onMoveUp={() => handleMoveCity(idx, -1)}
                onMoveDown={() => handleMoveCity(idx, 1)}
                onRemove={() => {
                  removeCityFromTrip(trip.id, stop.id);
                  notifyWarning(`Removed stop ${stop.name} from itinerary.`);
                }}
                onUpdateNights={(nights) => {
                  const updated = trip.cities.map((c) => (c.id === stop.id ? { ...c, nights } : c));
                  reorderCities(trip.id, updated);
                }}
              />
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-900 leading-relaxed">
            <p className="font-bold mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Smart Multi-City Tip:
            </p>
            Reorder stops with the arrow keys. GlobeTrotter automatically realigns transit duration and daily slots for each city.
          </div>
        </div>

        {/* Right Column: Day-Wise Activity Timeline Builder */}
        <div className="lg:col-span-7 space-y-5">
          {/* Day Header Bar with Add Day Button */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Day-by-Day Schedule</h3>
              <p className="text-xs text-slate-500">Manage activities, timings & notes</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="primary"
                icon={Plus}
                onClick={() => setAddActivityModalOpen(true)}
              >
                Add Activity
              </Button>
            </div>
          </div>

          {/* Day Selector Pills Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {trip.days?.map((d) => (
              <button
                key={d.dayNumber}
                type="button"
                onClick={() => setSelectedDayNumber(d.dayNumber)}
                className={`flex flex-col items-start px-3.5 py-2 rounded-2xl border text-left transition-all shrink-0 min-w-28 cursor-pointer ${
                  selectedDayNumber === d.dayNumber
                    ? 'bg-[#714B67] text-white border-[#714B67] shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-extrabold">Day {d.dayNumber}</span>
                  <span className="text-[10px] opacity-80">{d.activities?.length || 0} acts</span>
                </div>
                <span className="text-[11px] font-semibold truncate max-w-[90px] mt-0.5 opacity-90">
                  {d.cityName || d.city}
                </span>
              </button>
            ))}

            {/* Inline Add Day Pill */}
            <button
              type="button"
              onClick={handleAddNewDay}
              className="flex items-center gap-1 px-3 py-3 rounded-2xl border border-dashed border-slate-300 text-slate-600 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 text-xs font-bold shrink-0 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Day</span>
            </button>
          </div>

          {/* Quick Preset Activities Bar */}
          <div className="space-y-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
              ⚡ 1-Click Quick Add Presets (Day {selectedDayNumber})
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {QUICK_PRESETS.map((preset) => {
                const Icon = preset.icon;
                return (
                  <button
                    key={preset.title}
                    type="button"
                    onClick={() => handleAddPreset(preset)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-xs font-semibold text-slate-700 hover:text-indigo-700 whitespace-nowrap shrink-0 transition-all cursor-pointer shadow-2xs"
                  >
                    <Icon className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{preset.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Current Day Schedule Container */}
          {currentDay ? (
            <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
              {/* Day Header with stats & controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-900">
                      Day {currentDay.dayNumber}: {currentDay.cityName || currentDay.city}
                    </h4>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md font-medium">
                      {currentDay.date}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5 font-medium">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      {Math.floor(totalDayDuration / 60)}h {totalDayDuration % 60}m planned
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 font-bold text-emerald-600">
                      Est. {formatMoney(totalDayCost)}
                    </span>
                    <span>•</span>
                    <span className="text-indigo-600 font-semibold">
                      {completedActivitiesCount} of {dayActivities.length} completed
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <Button
                    size="xs"
                    variant="outline"
                    icon={MapPin}
                    onClick={() => {
                      setSelectedCityForDay(currentDay.cityName || currentDay.city || '');
                      setChangeCityModalOpen(true);
                    }}
                    className="text-xs"
                  >
                    Change City
                  </Button>

                  {(trip.days?.length || 0) > 1 && (
                    <button
                      type="button"
                      onClick={handleDeleteCurrentDay}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Day"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Activity Filters and Search Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
                  <button
                    type="button"
                    onClick={() => setFilterTimeOfDay('all')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      filterTimeOfDay === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'
                    }`}
                  >
                    All Times
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterTimeOfDay('morning')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      filterTimeOfDay === 'morning' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'
                    }`}
                  >
                    Morning 🌅
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterTimeOfDay('afternoon')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      filterTimeOfDay === 'afternoon' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'
                    }`}
                  >
                    Afternoon ☀️
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterTimeOfDay('evening')}
                    className={`px-2.5 py-1 rounded-lg transition-all ${
                      filterTimeOfDay === 'evening' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'
                    }`}
                  >
                    Evening 🌙
                  </button>
                </div>

                <div className="relative flex-1 min-w-40 max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={activitySearchTerm}
                    onChange={(e) => setActivitySearchTerm(e.target.value)}
                    placeholder="Search in day..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Activity Cards List */}
              {filteredDayActivities.length > 0 ? (
                <div className="space-y-3">
                  {filteredDayActivities.map((act) => (
                    <ActivityCard
                      key={act.id}
                      activity={act}
                      onToggleComplete={() =>
                        toggleActivityCompleted(trip.id, currentDay.dayNumber, act.id)
                      }
                      onEdit={() => {
                        setSelectedActivityToEdit(act);
                        setEditActivityModalOpen(true);
                      }}
                      onDelete={() => {
                        removeActivity(trip.id, currentDay.dayNumber, act.id);
                        notifyWarning(`Removed "${act.title}" from Day ${currentDay.dayNumber}`);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Clock}
                  title={activitySearchTerm ? 'No matching activities' : `No activities planned for Day ${currentDay.dayNumber}`}
                  description={
                    activitySearchTerm
                      ? 'Try clearing the search query or changing filters.'
                      : 'Choose from quick presets above, explore our catalog, or create custom tours.'
                  }
                  actionText="Add Activity from Catalog"
                  actionIcon={Plus}
                  onAction={() => setAddActivityModalOpen(true)}
                />
              )}
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
              <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="text-base font-bold text-slate-900">No Days in Itinerary Yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Start structuring your trip by initializing Day 1 schedules.
              </p>
              <Button size="sm" variant="primary" icon={Plus} onClick={handleAddNewDay}>
                Initialize Day 1
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modal 1: Add City Stop Modal */}
      <Modal
        isOpen={addCityModalOpen}
        onClose={() => setAddCityModalOpen(false)}
        title="Add City Stop to Itinerary"
        subtitle="Expand your multi-city journey with another stop."
      >
        <form onSubmit={handleAddCitySubmit} className="space-y-4">
          <Input
            label="Search Destination"
            placeholder="Type city name..."
            value={citySearchQuery}
            onChange={(e) => setCitySearchQuery(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Select City from Catalog
            </label>
            <div className="max-h-48 overflow-y-auto space-y-1.5 border border-slate-200 rounded-xl p-2 bg-slate-50">
              {availableCityCatalog.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCityToAdd(c.name)}
                  className={`flex items-center justify-between w-full p-2.5 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                    selectedCityToAdd === c.name
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'hover:bg-slate-200/70 text-slate-800'
                  }`}
                >
                  <div>
                    <span className="font-bold">{c.name}</span>, {c.country}
                  </div>
                  <span className="text-[10px] opacity-80">{c.region}</span>
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Nights to Stay"
            type="number"
            min="1"
            max="30"
            value={newCityNights}
            onChange={(e) => setNewCityNights(Number(e.target.value))}
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setAddCityModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" icon={Plus}>
              Add Stop to Trip
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Add Activity Modal (Catalog & Custom) */}
      <Modal
        isOpen={addActivityModalOpen}
        onClose={() => setAddActivityModalOpen(false)}
        title={`Add Activity to Day ${selectedDayNumber}`}
        subtitle={`Scheduled in ${currentDay?.cityName || 'Destination'}`}
        maxWidth="max-w-2xl"
      >
        <div className="flex border-b border-slate-200 mb-4">
          <button
            type="button"
            onClick={() => setActivityMode('catalog')}
            className={`pb-2 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activityMode === 'catalog'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Discover from Catalog
          </button>
          <button
            type="button"
            onClick={() => setActivityMode('custom')}
            className={`pb-2 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activityMode === 'custom'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Create Custom Activity
          </button>
        </div>

        {activityMode === 'catalog' ? (
          <div className="space-y-4">
            {/* Catalog Filters */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="relative flex-1 min-w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={catalogSearch}
                  onChange={(e) => setCatalogSearch(e.target.value)}
                  placeholder="Search activities, tours..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
                />
              </div>

              <select
                value={catalogCategoryFilter}
                onChange={(e) => setCatalogCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none font-semibold text-slate-700"
              >
                {activityCategories.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Catalog Items */}
            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {filteredCatalogActivities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 hover:border-indigo-300 bg-white transition-all gap-3 hover:shadow-2xs"
                >
                  <img
                    src={act.image}
                    alt={act.title}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded">
                        {act.category}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {act.cityName} • {act.duration} mins
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">{act.title}</h4>
                    <p className="text-[11px] font-bold text-emerald-600">{formatMoney(act.cost)}</p>
                  </div>
                  <Button
                    size="xs"
                    variant="primary"
                    onClick={() => handleAddFromCatalog(act)}
                    className="shrink-0"
                  >
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <form onSubmit={handleCustomActivitySubmit} className="space-y-3 text-left">
            <Input
              label="Activity Title"
              placeholder="e.g. Sunset Boat Tour, Street Food Walk"
              value={customActivity.title}
              onChange={(e) => setCustomActivity({ ...customActivity, title: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Start Time"
                type="time"
                value={customActivity.time}
                onChange={(e) => setCustomActivity({ ...customActivity, time: e.target.value })}
                required
              />
              <Input
                label="Duration (Minutes)"
                type="number"
                min="15"
                step="15"
                value={customActivity.durationMinutes}
                onChange={(e) =>
                  setCustomActivity({ ...customActivity, durationMinutes: Number(e.target.value) })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Estimated Cost (₹)"
                type="number"
                min="0"
                value={customActivity.cost}
                onChange={(e) =>
                  setCustomActivity({ ...customActivity, cost: Number(e.target.value) })
                }
              />
              <Select
                label="Category"
                value={customActivity.category}
                onChange={(e) =>
                  setCustomActivity({ ...customActivity, category: e.target.value })
                }
                options={activityCategories.filter((c) => c.key !== 'all').map((c) => ({ value: c.label, label: c.label }))}
              />
            </div>

            <Input
              label="Location / Landmark"
              placeholder="e.g. Marine Drive, Gateway Jetty"
              value={customActivity.location}
              onChange={(e) =>
                setCustomActivity({ ...customActivity, location: e.target.value })
              }
            />

            <TextArea
              label="Notes / Tips"
              placeholder="Booking reference, dress codes..."
              value={customActivity.notes}
              onChange={(e) =>
                setCustomActivity({ ...customActivity, notes: e.target.value })
              }
              rows={2}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setAddActivityModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" icon={Plus}>
                Add to Itinerary
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Modal 3: Edit Activity Modal */}
      {selectedActivityToEdit && (
        <Modal
          isOpen={editActivityModalOpen}
          onClose={() => setEditActivityModalOpen(false)}
          title="Edit Activity"
          subtitle={`Day ${selectedDayNumber}`}
        >
          <form onSubmit={handleSaveEditedActivity} className="space-y-3 text-left">
            <Input
              label="Activity Title"
              value={selectedActivityToEdit.title}
              onChange={(e) =>
                setSelectedActivityToEdit({ ...selectedActivityToEdit, title: e.target.value })
              }
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Start Time"
                type="time"
                value={selectedActivityToEdit.time}
                onChange={(e) =>
                  setSelectedActivityToEdit({ ...selectedActivityToEdit, time: e.target.value })
                }
                required
              />
              <Input
                label="Duration (Mins)"
                type="number"
                value={selectedActivityToEdit.durationMinutes}
                onChange={(e) =>
                  setSelectedActivityToEdit({
                    ...selectedActivityToEdit,
                    durationMinutes: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Cost"
                type="number"
                value={selectedActivityToEdit.cost}
                onChange={(e) =>
                  setSelectedActivityToEdit({
                    ...selectedActivityToEdit,
                    cost: Number(e.target.value),
                  })
                }
              />
              <Select
                label="Category"
                value={selectedActivityToEdit.category}
                onChange={(e) =>
                  setSelectedActivityToEdit({ ...selectedActivityToEdit, category: e.target.value })
                }
                options={activityCategories.filter((c) => c.key !== 'all').map((c) => ({ value: c.label, label: c.label }))}
              />
            </div>

            <Input
              label="Location"
              value={selectedActivityToEdit.location || ''}
              onChange={(e) =>
                setSelectedActivityToEdit({ ...selectedActivityToEdit, location: e.target.value })
              }
            />

            <TextArea
              label="Notes"
              value={selectedActivityToEdit.notes || ''}
              onChange={(e) =>
                setSelectedActivityToEdit({ ...selectedActivityToEdit, notes: e.target.value })
              }
              rows={2}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setEditActivityModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal 4: Change City for Day */}
      <Modal
        isOpen={changeCityModalOpen}
        onClose={() => setChangeCityModalOpen(false)}
        title={`Change City for Day ${selectedDayNumber}`}
        subtitle="Select which destination stop this day belongs to"
      >
        <div className="space-y-4 text-left">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Choose from Trip Cities or Catalog
            </label>
            <div className="space-y-2">
              {trip.cities?.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCityForDay(c.name)}
                  className={`flex items-center justify-between w-full p-3 rounded-xl border text-xs font-bold transition-all text-left cursor-pointer ${
                    selectedCityForDay === c.name
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{c.name}</span>
                  <span className="text-[10px] font-normal text-slate-500">Trip Stop ({c.nights}N)</span>
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Or Custom City Name"
            placeholder="Type city name..."
            value={selectedCityForDay}
            onChange={(e) => setSelectedCityForDay(e.target.value)}
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setChangeCityModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                if (!selectedCityForDay.trim()) return;
                updateItineraryDayCity(trip.id, selectedDayNumber, selectedCityForDay.trim());
                setChangeCityModalOpen(false);
                notifySuccess(`Updated Day ${selectedDayNumber} city to ${selectedCityForDay}!`);
              }}
            >
              Update Day City
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ItineraryBuilder;
