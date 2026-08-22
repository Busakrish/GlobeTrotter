import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { useNotification } from '../context/NotificationContext';
import TripCard from '../components/trip/TripCard';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import ConfirmationModal from '../components/common/ConfirmationModal';
import { Plus, Search, Layers, Compass, Filter } from 'lucide-react';

export function MyTrips() {
  const { trips, deleteTrip, duplicateTrip } = useTrips();
  const { notifySuccess, notifyWarning } = useNotification();
  const navigate = useNavigate();

  const [filterTab, setFilterTab] = useState('all'); // all, upcoming, ongoing, completed, public
  const [searchQuery, setSearchQuery] = useState('');
  const [tripToDelete, setTripToDelete] = useState(null);

  const filteredTrips = trips.filter((trip) => {
    // Tab filter
    if (filterTab === 'upcoming' && trip.status !== 'Upcoming' && trip.status !== 'Planning') return false;
    if (filterTab === 'ongoing' && trip.status !== 'Ongoing') return false;
    if (filterTab === 'completed' && trip.status !== 'Completed') return false;
    if (filterTab === 'public' && !trip.isPublic) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = trip.title.toLowerCase().includes(q);
      const matchDesc = trip.description?.toLowerCase().includes(q);
      const matchCity = trip.cities?.some((c) => c.name.toLowerCase().includes(q));
      return matchTitle || matchDesc || matchCity;
    }

    return true;
  });

  const tabs = [
    { key: 'all', label: 'All Trips', count: trips.length },
    { key: 'upcoming', label: 'Upcoming', count: trips.filter((t) => t.status === 'Upcoming' || t.status === 'Planning').length },
    { key: 'ongoing', label: 'Ongoing', count: trips.filter((t) => t.status === 'Ongoing').length },
    { key: 'completed', label: 'Completed', count: trips.filter((t) => t.status === 'Completed').length },
    { key: 'public', label: 'Shared Public', count: trips.filter((t) => t.isPublic).length },
  ];

  const handleDuplicate = (tripId) => {
    const cloned = duplicateTrip(tripId);
    if (cloned) {
      notifySuccess(`Cloned trip as "${cloned.title}"! Opening workspace.`);
      navigate(`/trips/${cloned.id}`);
    }
  };

  const handleDeleteConfirm = () => {
    if (!tripToDelete) return;
    deleteTrip(tripToDelete.id);
    notifyWarning(`Deleted itinerary "${tripToDelete.title}".`);
    setTripToDelete(null);
  };

  return (
    <div className="space-y-6 text-left animate-fade-in pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 mb-2">
            <Compass className="w-3.5 h-3.5" />
            Travel Workspace
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Travel Itineraries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your personal multi-city routes, schedules, day activities, and live budgets.
          </p>
        </div>

        <Link to="/trips/create">
          <Button variant="primary" icon={Plus}>
            Plan New Trip
          </Button>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200/90 shadow-xs">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterTab(tab.key)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                filterTab === tab.key
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  filterTab === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by city or title..."
            className="w-full pl-9 pr-3.5 py-2 text-xs font-medium rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Trips Grid */}
      {filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => (
            <TripCard
              key={trip.id}
              trip={trip}
              onDuplicate={() => handleDuplicate(trip.id)}
              onDelete={() => setTripToDelete(trip)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Compass}
          title="No itineraries found"
          description={
            searchQuery
              ? `No trips matching "${searchQuery}". Try a different keyword.`
              : 'You have no trips in this category yet. Start planning your next multi-city journey!'
          }
          actionText="Create New Itinerary"
          actionIcon={Plus}
          onAction={() => navigate('/trips/create')}
        />
      )}

      {/* Delete Confirmation Modal */}
      {tripToDelete && (
        <ConfirmationModal
          isOpen={!!tripToDelete}
          onClose={() => setTripToDelete(null)}
          onConfirm={handleDeleteConfirm}
          title={`Delete "${tripToDelete.title}"?`}
          message="Are you sure you want to delete this trip itinerary? All day schedules, custom expenses, and packing checklists for this trip will be permanently removed."
          confirmText="Delete Itinerary"
          variant="danger"
        />
      )}
    </div>
  );
}

export default MyTrips;
