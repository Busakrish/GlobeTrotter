import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
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
} from 'lucide-react';

export function ItineraryBuilder() {
  const { id } = useParams();
  const {
    trips,
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
  } = useTrips();

  const { notifySuccess, notifyWarning } = useNotification();

  const trip = getTripById(id) || trips[0];
  const [selectedDayNumber, setSelectedDayNumber] = useState(1);

  // Modals state
  const [addCityModalOpen, setAddCityModalOpen] = useState(false);
  const [addActivityModalOpen, setAddActivityModalOpen] = useState(false);
  const [editActivityModalOpen, setEditActivityModalOpen] = useState(false);
  const [selectedActivityToEdit, setSelectedActivityToEdit] = useState(null);

  // New city state
  const [citySearchQuery, setCitySearchQuery] = useState('');
  const [selectedCityToAdd, setSelectedCityToAdd] = useState(mockCities[0]?.name || 'Jaipur');
  const [newCityNights, setNewCityNights] = useState(2);

  // Activity form state
  const [activityMode, setActivityMode] = useState('catalog'); // 'catalog' | 'custom'
  const [customActivity, setCustomActivity] = useState({
    title: '',
    time: '10:00',
    durationMinutes: 90,
    cost: 500,
    category: 'Sightseeing',
    location: '',
    notes: '',
  });

  if (!trip) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-500">Trip not found.</p>
        <Link to="/trips" className="text-indigo-600 font-bold text-xs mt-2 inline-block">
          Return to My Trips
        </Link>
      </div>
    );
  }

  const conflicts = detectScheduleConflicts(trip);
  const currentDay = trip.days?.find((d) => d.dayNumber === selectedDayNumber) || trip.days?.[0];

  // Handler for moving city stop
  const handleMoveCity = (index, direction) => {
    const newCities = [...trip.cities];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newCities.length) return;

    const temp = newCities[index];
    newCities[index] = newCities[targetIndex];
    newCities[targetIndex] = temp;

    reorderCities(trip.id, newCities);
    notifySuccess('Reordered itinerary route stops.');
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

  // Handler for custom activity creation
  const handleCustomActivitySubmit = (e) => {
    e.preventDefault();
    if (!customActivity.title.trim()) return;

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

  const availableCityCatalog = mockCities.filter((c) =>
    c.name.toLowerCase().includes(citySearchQuery.toLowerCase()) ||
    c.country.toLowerCase().includes(citySearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 text-left animate-fade-in pb-16">
      {/* 1. Trip Header with Navigation Tabs */}
      <TripHeader trip={trip} activeTab="builder" />

      {/* 2. Schedule Conflict Alert Banner (Real-time detection) */}
      <ConflictAlert
        conflicts={conflicts}
        onResolve={(dayNum, actId, newTime) => {
          resolveConflict(trip.id, dayNum, actId, newTime);
          notifySuccess(`Resolved schedule conflict! Moved activity to ${newTime}.`);
        }}
      />

      {/* 3. Two-Column Layout: Left (Multi-City Route Stops) & Right (Day Schedule Builder) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Multi-City Stops Manager */}
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
                key={stop.id}
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
            You can reorder cities using the arrow controls. GlobeTrotter automatically updates the transit segments and recalculates daily schedule slots.
          </div>
        </div>

        {/* Right Column: Day-Wise Activity Timeline Builder */}
        <div className="lg:col-span-7 space-y-4">
          {/* Day Selector Pills Bar */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Day-by-Day Schedule</h3>
              <p className="text-xs text-slate-500">Activities, timings & locations</p>
            </div>
            <Button
              size="sm"
              variant="primary"
              icon={Plus}
              onClick={() => setAddActivityModalOpen(true)}
            >
              Add Activity to Day {selectedDayNumber}
            </Button>
          </div>

          {/* Day Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {trip.days?.map((d) => (
              <button
                key={d.dayNumber}
                type="button"
                onClick={() => setSelectedDayNumber(d.dayNumber)}
                className={`flex flex-col items-start px-3.5 py-2 rounded-2xl border text-left transition-all shrink-0 min-w-28 ${
                  selectedDayNumber === d.dayNumber
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
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
          </div>

          {/* Current Day Schedule List */}
          {currentDay && (
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-900">
                      Day {currentDay.dayNumber}: {currentDay.cityName || currentDay.city}
                    </h4>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                      {currentDay.date}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {currentDay.activities?.length || 0} planned activities
                  </p>
                </div>
              </div>

              {/* Activity Cards List */}
              {currentDay.activities?.length > 0 ? (
                <div className="space-y-3">
                  {currentDay.activities.map((act) => (
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
                  title={`No activities planned for Day ${currentDay.dayNumber}`}
                  description="Add sightseeing tours, culinary tastings, or transport items to build your schedule."
                  actionText="Add First Activity"
                  actionIcon={Plus}
                  onAction={() => setAddActivityModalOpen(true)}
                />
              )}
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
                  className={`flex items-center justify-between w-full p-2 rounded-lg text-xs transition-colors text-left ${
                    selectedCityToAdd === c.name
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'hover:bg-slate-200/70 text-slate-800'
                  }`}
                >
                  <span>
                    {c.name}, {c.country}
                  </span>
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
        maxWidth="max-w-xl"
      >
        <div className="flex border-b border-slate-200 mb-4">
          <button
            type="button"
            onClick={() => setActivityMode('catalog')}
            className={`pb-2 px-4 text-xs font-bold border-b-2 transition-colors ${
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
            className={`pb-2 px-4 text-xs font-bold border-b-2 transition-colors ${
              activityMode === 'custom'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Create Custom Activity
          </button>
        </div>

        {activityMode === 'catalog' ? (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
            {mockActivities.map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-300 bg-white transition-all gap-3"
              >
                <img
                  src={act.image}
                  alt={act.title}
                  className="w-14 h-14 rounded-lg object-cover shrink-0"
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
                  <p className="text-[11px] font-bold text-emerald-600">₹{act.cost.toLocaleString('en-IN')}</p>
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
                label="Cost (₹)"
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
    </div>
  );
}

export default ItineraryBuilder;
