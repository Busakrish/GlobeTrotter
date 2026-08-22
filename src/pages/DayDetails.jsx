import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import TripHeader from '../components/trip/TripHeader';
import ActivityCard from '../components/trip/ActivityCard';
import WeatherCard from '../components/weather/WeatherCard';
import Modal from '../components/common/Modal';
import Input, { TextArea, Select } from '../components/common/Input';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  ArrowLeft,
  Sun,
  Sunrise,
  Sunset,
  Utensils,
  Landmark,
  FileText,
} from 'lucide-react';

export function DayDetails() {
  const { tripId, id, dayId } = useParams();
  const {
    trips,
    activeTrip,
    getTripById,
    addActivityToDay,
    removeActivity,
    updateActivity,
    toggleActivityCompleted,
  } = useTrips();
  const { formatMoney } = useAuth();
  const { notifySuccess, notifyWarning } = useNotification();
  const navigate = useNavigate();

  const trip = getTripById(tripId || id) || activeTrip || trips[0];
  const dayNumber = Number(dayId) || 1;
  const day = trip?.days?.find((d) => d.dayNumber === dayNumber) || trip?.days?.[0];

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [modalCategoryPreset, setModalCategoryPreset] = useState('Sightseeing');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedActivityToEdit, setSelectedActivityToEdit] = useState(null);

  const [newActivity, setNewActivity] = useState({
    title: '',
    time: '10:00',
    durationMinutes: 90,
    cost: 500,
    category: 'Sightseeing',
    location: '',
    notes: '',
  });

  if (!trip || !day) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-slate-500">Day details not found.</p>
        <Link to="/trips" className="text-xs font-bold text-indigo-600 mt-2 inline-block">
          Return to Trips
        </Link>
      </div>
    );
  }

  // Segment activities into Morning (<12:00), Afternoon (12:00 - 17:00), Evening (>=17:00)
  const morningActs = (day.activities || []).filter((a) => a.time < '12:00');
  const afternoonActs = (day.activities || []).filter(
    (a) => a.time >= '12:00' && a.time < '17:00'
  );
  const eveningActs = (day.activities || []).filter((a) => a.time >= '17:00');

  const handleOpenAddModal = (category = 'Sightseeing', defaultTime = '10:00') => {
    setModalCategoryPreset(category);
    setNewActivity({
      title: '',
      time: defaultTime,
      durationMinutes: 90,
      cost: 500,
      category,
      location: day.cityName || '',
      notes: '',
    });
    setAddModalOpen(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newActivity.title.trim()) return;

    addActivityToDay(trip.id, day.dayNumber, newActivity);
    setAddModalOpen(false);
    notifySuccess(`Added "${newActivity.title}" to Day ${day.dayNumber}!`);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!selectedActivityToEdit) return;

    updateActivity(trip.id, day.dayNumber, selectedActivityToEdit.id, selectedActivityToEdit);
    setEditModalOpen(false);
    setSelectedActivityToEdit(null);
    notifySuccess('Activity updated successfully.');
  };

  return (
    <div className="space-y-8 text-left animate-fade-in pb-16">
      {/* 1. Trip Header */}
      <TripHeader trip={trip} activeTab="itinerary" />

      {/* 2. Top Day Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            to={`/trips/${trip.id}/itinerary`}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-600 text-white">
                Day {day.dayNumber}
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                {day.cityName || day.city} Schedule
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{day.date}</p>
          </div>
        </div>

        {/* Quick Add Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="xs"
            variant="outline"
            icon={Landmark}
            onClick={() => handleOpenAddModal('Sightseeing', '10:00')}
          >
            + Attraction
          </Button>

          <Button
            size="xs"
            variant="outline"
            icon={Utensils}
            onClick={() => handleOpenAddModal('Food & Dining', '13:00')}
          >
            + Restaurant
          </Button>

          <Button
            size="xs"
            variant="outline"
            icon={FileText}
            onClick={() => handleOpenAddModal('Notes', '16:00')}
          >
            + Note
          </Button>

          <Button
            size="xs"
            variant="primary"
            icon={Plus}
            onClick={() => handleOpenAddModal('Sightseeing', '10:00')}
          >
            Add Activity
          </Button>
        </div>
      </div>

      {/* 3. Main Grid: Timeline Left, Weather Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Day Timeline Sections (Morning, Afternoon, Evening) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Morning Block */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sunrise className="w-4 h-4 text-amber-500" />
                Morning Schedule (Before 12:00 PM)
              </h3>
              <span className="text-xs font-semibold text-slate-400">
                {morningActs.length} activities
              </span>
            </div>

            {morningActs.length > 0 ? (
              <div className="space-y-3">
                {morningActs.map((act) => (
                  <ActivityCard
                    key={act.id}
                    activity={act}
                    onToggleComplete={() =>
                      toggleActivityCompleted(trip.id, day.dayNumber, act.id)
                    }
                    onEdit={() => {
                      setSelectedActivityToEdit(act);
                      setEditModalOpen(true);
                    }}
                    onDelete={() => {
                      removeActivity(trip.id, day.dayNumber, act.id);
                      notifyWarning(`Removed "${act.title}" from schedule.`);
                    }}
                  />
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic py-2">
                No morning activities scheduled.
              </p>
            )}
          </div>

          {/* Afternoon Block */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sun className="w-4 h-4 text-sky-500" />
                Afternoon Schedule (12:00 PM - 5:00 PM)
              </h3>
              <span className="text-xs font-semibold text-slate-400">
                {afternoonActs.length} activities
              </span>
            </div>

            {afternoonActs.length > 0 ? (
              <div className="space-y-3">
                {afternoonActs.map((act) => (
                  <ActivityCard
                    key={act.id}
                    activity={act}
                    onToggleComplete={() =>
                      toggleActivityCompleted(trip.id, day.dayNumber, act.id)
                    }
                    onEdit={() => {
                      setSelectedActivityToEdit(act);
                      setEditModalOpen(true);
                    }}
                    onDelete={() => {
                      removeActivity(trip.id, day.dayNumber, act.id);
                      notifyWarning(`Removed "${act.title}" from schedule.`);
                    }}
                  />
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic py-2">
                No afternoon activities scheduled.
              </p>
            )}
          </div>

          {/* Evening Block */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sunset className="w-4 h-4 text-indigo-500" />
                Evening & Nightlife (After 5:00 PM)
              </h3>
              <span className="text-xs font-semibold text-slate-400">
                {eveningActs.length} activities
              </span>
            </div>

            {eveningActs.length > 0 ? (
              <div className="space-y-3">
                {eveningActs.map((act) => (
                  <ActivityCard
                    key={act.id}
                    activity={act}
                    onToggleComplete={() =>
                      toggleActivityCompleted(trip.id, day.dayNumber, act.id)
                    }
                    onEdit={() => {
                      setSelectedActivityToEdit(act);
                      setEditModalOpen(true);
                    }}
                    onDelete={() => {
                      removeActivity(trip.id, day.dayNumber, act.id);
                      notifyWarning(`Removed "${act.title}" from schedule.`);
                    }}
                  />
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic py-2">
                No evening activities scheduled.
              </p>
            )}
          </div>
        </div>

        {/* Right: Weather & Destination Insights */}
        <div className="lg:col-span-4 space-y-6">
          <WeatherCard cityName={day.cityName || day.city} />

          <div className="p-5 rounded-3xl bg-indigo-50/70 border border-indigo-100 text-xs text-indigo-950 space-y-2">
            <h4 className="font-bold flex items-center gap-1.5">
              💡 Day {day.dayNumber} Timeline Tip:
            </h4>
            <p className="leading-relaxed">
              Spacing activities by at least 30-45 minutes ensures you have comfortable transit buffer between attractions.
            </p>
          </div>
        </div>
      </div>

      {/* Modal 1: Add Activity */}
      {addModalOpen && (
        <Modal
          isOpen={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          title={`Add to Day ${day.dayNumber}`}
          subtitle={`Scheduled in ${day.cityName || day.city}`}
        >
          <form onSubmit={handleAddSubmit} className="space-y-4 text-left">
            <Input
              label="Activity / Sight Name"
              placeholder="e.g. Gateway of India, Cafe Lunch, Sunset Walk"
              value={newActivity.title}
              onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Start Time"
                type="time"
                value={newActivity.time}
                onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                required
              />
              <Input
                label="Duration (Mins)"
                type="number"
                min="15"
                step="15"
                value={newActivity.durationMinutes}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, durationMinutes: Number(e.target.value) })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Estimated Cost (₹)"
                type="number"
                min="0"
                value={newActivity.cost}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, cost: Number(e.target.value) })
                }
              />
              <Select
                label="Category"
                value={newActivity.category}
                onChange={(e) =>
                  setNewActivity({ ...newActivity, category: e.target.value })
                }
                options={[
                  { value: 'Sightseeing', label: 'Sightseeing / Tour' },
                  { value: 'Food & Dining', label: 'Food & Dining' },
                  { value: 'Transport', label: 'Transport / Transfer' },
                  { value: 'Adventure', label: 'Adventure / Sports' },
                  { value: 'Shopping', label: 'Shopping & Bazaars' },
                  { value: 'Notes', label: 'Travel Note' },
                ]}
              />
            </div>

            <Input
              label="Location / Address"
              placeholder="e.g. Colaba, South Mumbai"
              value={newActivity.location}
              onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
            />

            <TextArea
              label="Notes & Tips"
              placeholder="Tickets reference, dress code..."
              value={newActivity.notes}
              onChange={(e) => setNewActivity({ ...newActivity, notes: e.target.value })}
              rows={2}
            />

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setAddModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" icon={Plus}>
                Add to Schedule
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal 2: Edit Activity */}
      {editModalOpen && selectedActivityToEdit && (
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="Edit Schedule Item"
          subtitle={`Day ${day.dayNumber}`}
        >
          <form onSubmit={handleEditSubmit} className="space-y-4 text-left">
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
                options={[
                  { value: 'Sightseeing', label: 'Sightseeing / Tour' },
                  { value: 'Food & Dining', label: 'Food & Dining' },
                  { value: 'Transport', label: 'Transport / Transfer' },
                  { value: 'Adventure', label: 'Adventure / Sports' },
                  { value: 'Shopping', label: 'Shopping & Bazaars' },
                  { value: 'Notes', label: 'Travel Note' },
                ]}
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
              <Button variant="outline" size="sm" onClick={() => setEditModalOpen(false)}>
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

export default DayDetails;
