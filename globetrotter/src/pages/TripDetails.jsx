import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import TripHeader from '../components/trip/TripHeader';
import ActivityCard from '../components/trip/ActivityCard';
import TripMap from '../components/map/TripMap';
import WeatherCard from '../components/weather/WeatherCard';
import SmartBudgetAlert from '../components/budget/SmartBudgetAlert';
import PackingListWidget from '../components/packing/PackingListWidget';
import Modal from '../components/common/Modal';
import Input, { TextArea, Select } from '../components/common/Input';
import Button from '../components/common/Button';
import ShareModal from '../components/trip/ShareModal';
import {
  Clock,
  MapPin,
  Calendar,
  Edit3,
  DollarSign,
  Sparkles,
  Plus,
  Share2,
  CheckSquare,
  FileText,
  Utensils,
  ArrowRight,
  TrendingUp,
  Users,
} from 'lucide-react';

export function TripDetails() {
  const { tripId, id } = useParams();
  const {
    trips,
    activeTrip,
    getTripById,
    toggleActivityCompleted,
    calculateTripBudgetSummary,
    addActivityToDay,
    addExpense,
    addCityToTrip,
  } = useTrips();
  const { formatMoney } = useAuth();
  const { notifySuccess } = useNotification();
  const navigate = useNavigate();

  const trip = getTripById(tripId || id) || activeTrip || trips[0];

  // Modals state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [addActivityModalOpen, setAddActivityModalOpen] = useState(false);
  const [addExpenseModalOpen, setAddExpenseModalOpen] = useState(false);
  const [addStopModalOpen, setAddStopModalOpen] = useState(false);

  // Form states
  const [newActivity, setNewActivity] = useState({
    title: '',
    time: '10:00',
    durationMinutes: 90,
    cost: 500,
    category: 'Sightseeing',
    dayNumber: 1,
  });

  const [newExpense, setNewExpense] = useState({
    description: '',
    category: 'Transport',
    amount: 1500,
  });

  const [newStopName, setNewStopName] = useState('Udaipur');

  if (!trip) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-slate-500">Trip not found.</p>
        <Link to="/trips" className="text-indigo-600 font-bold text-xs mt-2 inline-block">
          Return to My Trips
        </Link>
      </div>
    );
  }

  const budgetSummary = calculateTripBudgetSummary(trip);

  const handleAddActivitySubmit = (e) => {
    e.preventDefault();
    if (!newActivity.title.trim()) return;

    addActivityToDay(trip.id, Number(newActivity.dayNumber), newActivity);
    setAddActivityModalOpen(false);
    notifySuccess(`Added "${newActivity.title}" to Day ${newActivity.dayNumber}!`);
  };

  const handleAddExpenseSubmit = (e) => {
    e.preventDefault();
    if (!newExpense.description.trim()) return;

    addExpense(trip.id, newExpense);
    setAddExpenseModalOpen(false);
    notifySuccess(`Logged expense "${newExpense.description}" (${formatMoney(newExpense.amount)})`);
  };

  const handleAddStopSubmit = (e) => {
    e.preventDefault();
    addCityToTrip(trip.id, {
      name: newStopName,
      country: 'India',
      nights: 2,
    });
    setAddStopModalOpen(false);
    notifySuccess(`Added stop ${newStopName} to your trip!`);
  };

  // Flatten next upcoming activities
  const allActivities = (trip.days || []).flatMap((d) =>
    (d.activities || []).map((a) => ({ ...a, dayNumber: d.dayNumber, cityName: d.cityName || d.city }))
  );

  return (
    <div className="space-y-8 text-left animate-fade-in pb-16">
      {/* 1. Trip Header */}
      <TripHeader trip={trip} activeTab="overview" />

      {/* 2. Quick Actions Bar */}
      <div className="p-4 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="xs"
            variant="outline"
            icon={Plus}
            onClick={() => setAddActivityModalOpen(true)}
          >
            Add Activity
          </Button>

          <Button
            size="xs"
            variant="outline"
            icon={DollarSign}
            onClick={() => setAddExpenseModalOpen(true)}
          >
            Add Expense
          </Button>

          <Button
            size="xs"
            variant="outline"
            icon={MapPin}
            onClick={() => setAddStopModalOpen(true)}
          >
            Add City Stop
          </Button>

          <Button
            size="xs"
            variant="outline"
            icon={Share2}
            onClick={() => setShareModalOpen(true)}
          >
            Share Trip
          </Button>
        </div>

        <Button
          size="xs"
          variant="primary"
          iconRight={ArrowRight}
          to={`/trips/${trip.id}/itinerary`}
        >
          Open Day Builder
        </Button>
      </div>

      {/* 3. Budget Status Banner */}
      <SmartBudgetAlert budgetSummary={budgetSummary} />

      {/* 4. Main Grid: Left Overview & Right Map/Weather/Packing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Itinerary Overview Timeline */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Itinerary Schedule Overview</h2>
              <p className="text-xs text-slate-500">
                Summary of day stops, transit connections, and planned activities
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              icon={Edit3}
              to={`/trips/${trip.id}/itinerary`}
            >
              Edit Itinerary
            </Button>
          </div>

          {/* Day Cards */}
          <div className="space-y-4">
            {trip.days?.map((day) => (
              <div
                key={day.dayNumber}
                className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3"
              >
                {/* Day Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-9 h-9 rounded-2xl bg-indigo-600 text-white font-extrabold text-xs shadow-xs">
                      <span>D{day.dayNumber}</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {day.cityName || day.city}
                      </h3>
                      <p className="text-[11px] text-slate-400 font-medium">{day.date}</p>
                    </div>
                  </div>

                  <Link
                    to={`/trips/${trip.id}/day/${day.dayNumber}`}
                    className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <span>Day Timeline ({day.activities?.length || 0})</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                {/* Activities List */}
                {day.activities?.length > 0 ? (
                  <div className="space-y-2.5">
                    {day.activities.map((act) => (
                      <ActivityCard
                        key={act.id}
                        activity={act}
                        onToggleComplete={() =>
                          toggleActivityCompleted(trip.id, day.dayNumber, act.id)
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic py-1">
                    No activities scheduled for this day yet.
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Multi-City Route Map, Weather & Packing Widget */}
        <div className="lg:col-span-4 space-y-6">
          {/* Interactive Multi-City Route Map */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-600" />
                Multi-City Route Map
              </h3>
              <span className="text-[11px] font-semibold text-slate-500">
                {trip.cities?.length || 1} Stops
              </span>
            </div>
            <TripMap cities={trip.cities || []} height="h-64" />
          </div>

          {/* Weather Widget */}
          <WeatherCard cityName={trip.cities?.[0]?.name || 'Mumbai'} />

          {/* Smart Packing Checklist Widget */}
          <PackingListWidget tripId={trip.id} initialList={trip.packingList || []} />
        </div>
      </div>

      {/* Modal 1: Add Activity Modal */}
      {addActivityModalOpen && (
        <Modal
          isOpen={addActivityModalOpen}
          onClose={() => setAddActivityModalOpen(false)}
          title="Add Activity to Trip"
          subtitle="Quick add a tour or dining experience"
        >
          <form onSubmit={handleAddActivitySubmit} className="space-y-4 text-left">
            <Input
              label="Activity Title"
              placeholder="e.g. Street food tour, Beach sunset"
              value={newActivity.title}
              onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Day
                </label>
                <select
                  value={newActivity.dayNumber}
                  onChange={(e) =>
                    setNewActivity({ ...newActivity, dayNumber: Number(e.target.value) })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {trip.days?.map((d) => (
                    <option key={d.dayNumber} value={d.dayNumber}>
                      Day {d.dayNumber}: {d.cityName || d.city}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Start Time"
                type="time"
                value={newActivity.time}
                onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Cost (₹)"
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
                  { value: 'Sightseeing', label: 'Sightseeing' },
                  { value: 'Food & Dining', label: 'Food & Dining' },
                  { value: 'Transport', label: 'Transport' },
                  { value: 'Adventure', label: 'Adventure' },
                ]}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setAddActivityModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" icon={Plus}>
                Add Activity
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal 2: Add Expense Modal */}
      {addExpenseModalOpen && (
        <Modal
          isOpen={addExpenseModalOpen}
          onClose={() => setAddExpenseModalOpen(false)}
          title="Log Trip Expense"
          subtitle={`For ${trip.title}`}
        >
          <form onSubmit={handleAddExpenseSubmit} className="space-y-4 text-left">
            <Input
              label="Expense Description"
              placeholder="e.g. Scuba diving, Dinner, Train booking"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Category"
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                options={[
                  { value: 'Transport', label: 'Transport' },
                  { value: 'Accommodation', label: 'Accommodation' },
                  { value: 'Food & Dining', label: 'Food & Dining' },
                  { value: 'Activities', label: 'Activities' },
                  { value: 'Other', label: 'Other' },
                ]}
              />
              <Input
                label="Amount (₹)"
                type="number"
                min="1"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setAddExpenseModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" icon={Plus}>
                Log Expense
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal 3: Add City Stop */}
      {addStopModalOpen && (
        <Modal
          isOpen={addStopModalOpen}
          onClose={() => setAddStopModalOpen(false)}
          title="Add City Stop to Route"
          subtitle="Expand your multi-city journey"
        >
          <form onSubmit={handleAddStopSubmit} className="space-y-4 text-left">
            <Input
              label="City Name"
              placeholder="e.g. Udaipur, Kochi, Jaipur"
              value={newStopName}
              onChange={(e) => setNewStopName(e.target.value)}
              required
            />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setAddStopModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" icon={Plus}>
                Add Stop
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        trip={trip}
      />
    </div>
  );
}

export default TripDetails;
