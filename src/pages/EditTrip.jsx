import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Input, { TextArea, Select } from '../components/common/Input';
import Button from '../components/common/Button';
import {
  Compass,
  Calendar,
  DollarSign,
  Users,
  Image as ImageIcon,
  ArrowLeft,
  Save,
  Check,
} from 'lucide-react';

const COVER_PRESETS = [
  {
    name: 'Coastal Beach Sunset',
    url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Royal Heritage Palace',
    url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Himalayan Mountain Range',
    url: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Cyberpunk Neon Tokyo',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Romantic European City',
    url: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Tropical Palm Lagoon',
    url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
  },
];

const AVAILABLE_INTERESTS = [
  'Beach & Coastal',
  'Heritage & Forts',
  'Foodie & Dining',
  'Nightlife & Music',
  'Trekking & Mountains',
  'Art & Museums',
  'Relaxation & Spa',
  'Photography',
  'Water Sports',
];

export function EditTrip() {
  const { tripId, id } = useParams();
  const { trips, activeTrip, getTripById, updateTrip } = useTrips();
  const { formatMoney } = useAuth();
  const { notifySuccess } = useNotification();
  const navigate = useNavigate();

  const trip = getTripById(tripId || id) || activeTrip || trips[0];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    travelersCount: 2,
    budget: 45000,
    travelStyle: 'Balanced Explorer',
    interests: [],
    coverImage: '',
    customCoverUrl: '',
    status: 'Upcoming',
  });

  useEffect(() => {
    if (trip) {
      setFormData({
        title: trip.title || '',
        description: trip.description || '',
        startDate: trip.startDate || '',
        endDate: trip.endDate || '',
        travelersCount: trip.travelersCount || 2,
        budget: trip.budget || 45000,
        travelStyle: trip.travelStyle || 'Balanced Explorer',
        interests: trip.interests || [],
        coverImage: trip.coverImage || COVER_PRESETS[0].url,
        customCoverUrl: '',
        status: trip.status || 'Upcoming',
      });
    }
  }, [trip]);

  if (!trip) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-slate-500">Trip not found.</p>
        <Link to="/trips" className="text-xs font-bold text-indigo-600 mt-2 inline-block">
          Return to Trips
        </Link>
      </div>
    );
  }

  const toggleInterest = (interest) => {
    setFormData((prev) => {
      const exists = prev.interests.includes(interest);
      if (exists) {
        return { ...prev, interests: prev.interests.filter((i) => i !== interest) };
      }
      return { ...prev, interests: [...prev.interests, interest] };
    });
  };

  const handleSave = (e) => {
    e.preventDefault();

    updateTrip(trip.id, {
      title: formData.title,
      description: formData.description,
      startDate: formData.startDate,
      endDate: formData.endDate,
      travelersCount: Number(formData.travelersCount),
      budget: Number(formData.budget),
      travelStyle: formData.travelStyle,
      interests: formData.interests,
      status: formData.status,
      coverImage: formData.customCoverUrl.trim() || formData.coverImage,
    });

    notifySuccess(`Trip "${formData.title}" updated successfully!`);
    navigate(`/trips/${trip.id}`);
  };

  return (
    <div className="max-w-4xl mx-auto text-left animate-fade-in pb-16 space-y-8">
      {/* Header */}
      <div>
        <Link
          to={`/trips/${trip.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Trip Workspace
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Edit Trip Details
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Update trip metadata, timeline, budget allocation, and cover visuals.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Card 1: Core Details */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-600" />
            1. Title & Description
          </h3>

          <Input
            label="Trip Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          <TextArea
            label="Description & Travel Notes"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Trip Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              options={[
                { value: 'Upcoming', label: 'Upcoming' },
                { value: 'Planning', label: 'In Planning' },
                { value: 'Ongoing', label: 'Ongoing / Traveling' },
                { value: 'Completed', label: 'Completed' },
              ]}
            />

            <Input
              label="Number of Travelers"
              type="number"
              min="1"
              max="20"
              value={formData.travelersCount}
              onChange={(e) => setFormData({ ...formData, travelersCount: Number(e.target.value) })}
            />
          </div>
        </div>

        {/* Card 2: Dates, Budget & Travel Style */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            2. Schedule, Budget & Travel Style
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Total Budget: <span className="font-extrabold text-indigo-600 text-sm">{formatMoney(Number(formData.budget))}</span>
              </label>
              <input
                type="range"
                min="10000"
                max="300000"
                step="5000"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <Select
              label="Travel Style"
              value={formData.travelStyle}
              onChange={(e) => setFormData({ ...formData, travelStyle: e.target.value })}
              options={[
                { value: 'Balanced Explorer', label: 'Balanced Explorer (Value & Comfort)' },
                { value: 'Backpacker', label: 'Backpacker (Budget & Hostels)' },
                { value: 'Luxury Heritage', label: 'Luxury Heritage (Palaces & Resorts)' },
                { value: 'Solo Adventurer', label: 'Solo Adventurer (Flexible & Fast)' },
                { value: 'Family & Group', label: 'Family & Group (Relaxed Pace)' },
              ]}
            />
          </div>

          {/* Interests */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Trip Interests & Highlights
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_INTERESTS.map((interest) => {
                const selected = formData.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                      selected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {selected && <Check className="w-3 h-3" />}
                    <span>{interest}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card 3: Cover Image Selection */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-indigo-600" />
            3. Trip Cover Visual
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {COVER_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => setFormData({ ...formData, coverImage: preset.url, customCoverUrl: '' })}
                className={`relative h-24 rounded-2xl overflow-hidden border-2 transition-all group ${
                  formData.coverImage === preset.url && !formData.customCoverUrl
                    ? 'border-indigo-600 ring-2 ring-indigo-600/30'
                    : 'border-transparent hover:opacity-90'
                }`}
              >
                <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                <span className="absolute bottom-1.5 inset-x-2 text-[10px] font-bold text-white truncate drop-shadow-sm">
                  {preset.name}
                </span>
                {formData.coverImage === preset.url && !formData.customCoverUrl && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                    <Check className="w-2.5 h-2.5" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <Input
            label="Or Custom Image URL (Optional)"
            placeholder="https://images.unsplash.com/..."
            value={formData.customCoverUrl}
            onChange={(e) => setFormData({ ...formData, customCoverUrl: e.target.value })}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/trips/${trip.id}`)}
          >
            Cancel
          </Button>

          <Button type="submit" variant="primary" size="lg" icon={Save}>
            Save Changes & Return to Workspace
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EditTrip;
