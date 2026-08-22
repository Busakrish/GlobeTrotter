import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Input, { TextArea, Select } from '../components/common/Input';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import {
  Compass,
  Calendar,
  DollarSign,
  MapPin,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Image as ImageIcon,
  Check,
  Users,
  ShieldCheck,
  Layers,
  HeartHandshake,
  Plus,
  Trash2,
  Car,
  Train,
  Plane,
  Clock,
  CheckCircle2,
  AlertCircle,
  Utensils,
} from 'lucide-react';
import confetti from 'canvas-confetti';

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

const PREFERENCE_OPTIONS = [
  { id: 'Culture', label: '🏛️ Culture & Heritage', desc: 'Museums, monuments, palaces, and historical walks' },
  { id: 'Food', label: '🍜 Food & Gastronomy', desc: 'Street food hubs, local delicacies, and top dining spots' },
  { id: 'Relaxation', label: '🏖️ Beach & Relaxation', desc: 'Coastal shores, sunset points, and leisurely cafes' },
  { id: 'Adventure', label: '🧗 Adventure & Treks', desc: 'Hiking, water sports, safaris, and outdoor thrills' },
  { id: 'Nature', label: '🌿 Nature & Wildlife', desc: 'Lush greenery, national parks, and scenic viewpoints' },
  { id: 'Nightlife', label: '🍸 Nightlife & Music', desc: 'Beach shacks, rooftop lounges, and live music' },
  { id: 'Shopping', label: '🛍️ Shopping & Bazaars', desc: 'Traditional craft markets and vibrant shopping lanes' },
  { id: 'Wellness', label: '🧘 Wellness & Spa', desc: 'Ayurveda, yoga retreats, and tranquil getaways' },
];

const TRAVELER_GROUPS = [
  { id: 'Solo', label: 'Solo Traveler', icon: '🎒' },
  { id: 'Couple', label: 'Couple / Romance', icon: '💑' },
  { id: 'Friends', label: 'Group of Friends', icon: '👥' },
  { id: 'Family', label: 'Family with Kids', icon: '👨‍👩‍👧‍👦' },
];

const TRAVEL_PACES = [
  { id: 'Relaxed', label: 'Relaxed', desc: '1–2 activities/day with ample leisure time' },
  { id: 'Moderate', label: 'Balanced', desc: '2–3 activities/day covering top highlights' },
  { id: 'Fast-Paced', label: 'Action-Packed', desc: '4+ activities/day for maximizing the visit' },
];

const ACCOMMODATION_TIERS = [
  { id: 'Budget', label: 'Hostels & Homestays', desc: 'Budget-friendly, social, and authentic' },
  { id: 'Moderate', label: '3-Star / Boutique Comfort', desc: 'Great amenities and prime central locations' },
  { id: 'Luxury', label: '4-Star / 5-Star Luxury', desc: 'Premium resorts and luxury hospitality' },
];

export function CreateTrip() {
  const [searchParams] = useSearchParams();
  const initialCity = searchParams.get('city') || 'Mumbai';

  const { createTrip, cities } = useTrips();
  const { formatMoney, currency } = useAuth();
  const { notifySuccess, notifyWarning } = useNotification();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  // 1. Core Timeline & Basics
  const defaultStart = new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0];
  const defaultEnd = new Date(Date.now() + 86400000 * 11).toISOString().split('T')[0]; // 4 nights, 5 days

  const [formData, setFormData] = useState({
    title: `Mumbai to Goa Coastal Escape`,
    tripType: 'multi', // 'single' | 'multi'
    startDate: defaultStart,
    endDate: defaultEnd,
    travelersCount: 2,
    travelerGroup: 'Friends',
    budget: 50000,
    travelStyle: 'Moderate',
    travelPace: 'Moderate',
    accommodationTier: 'Moderate',
    dietary: 'Any',
    preferences: ['Culture', 'Food', 'Relaxation'],
    coverImage: COVER_PRESETS[0].url,
    customCoverUrl: '',
  });

  // Calculate duration
  const startD = new Date(formData.startDate);
  const endD = new Date(formData.endDate);
  const diffDays = Math.max(1, Math.ceil(Math.abs(endD - startD) / (1000 * 60 * 60 * 24)) + 1);
  const totalNights = Math.max(1, diffDays - 1);

  // 2. City Route Stops with Nights Allocation
  const [cityStops, setCityStops] = useState([
    {
      id: 'stop-1',
      name: 'Mumbai',
      country: 'India',
      nights: 2,
      transitMode: 'Train / AC Express',
    },
    {
      id: 'stop-2',
      name: 'Goa',
      country: 'India',
      nights: Math.max(1, totalNights - 2),
      transitMode: 'Direct Departure',
    },
  ]);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Synchronize total nights if dates change
  useEffect(() => {
    const allocatedNights = cityStops.reduce((sum, s) => sum + (Number(s.nights) || 0), 0);
    if (allocatedNights !== totalNights && cityStops.length > 0) {
      setCityStops((prev) => {
        const copy = [...prev];
        const otherNights = copy.slice(0, -1).reduce((s, c) => s + (Number(c.nights) || 0), 0);
        copy[copy.length - 1].nights = Math.max(1, totalNights - otherNights);
        return copy;
      });
    }
  }, [totalNights]);

  // Total nights currently allocated across stops
  const allocatedNights = cityStops.reduce((sum, s) => sum + (Number(s.nights) || 0), 0);

  const handleCityChange = (index, field, value) => {
    setCityStops((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleNightChange = (index, delta) => {
    setCityStops((prev) => {
      const copy = [...prev];
      const current = Number(copy[index].nights) || 1;
      copy[index].nights = Math.max(1, current + delta);
      return copy;
    });
  };

  const addCityStop = () => {
    const available = cities.filter((c) => !cityStops.some((s) => s.name === c.name));
    const nextCity = available[0]?.name || 'Jaipur';
    setCityStops((prev) => [
      ...prev,
      {
        id: `stop-${Date.now()}`,
        name: nextCity,
        country: 'India',
        nights: 2,
        transitMode: 'Train / AC Express',
      },
    ]);
  };

  const removeCityStop = (index) => {
    if (cityStops.length <= 1) {
      notifyWarning('A trip must have at least one destination stop.');
      return;
    }
    setCityStops((prev) => prev.filter((_, i) => i !== index));
  };

  const togglePreference = (prefId) => {
    setFormData((prev) => {
      const exists = prev.preferences.includes(prefId);
      if (exists) {
        return { ...prev, preferences: prev.preferences.filter((p) => p !== prefId) };
      }
      return { ...prev, preferences: [...prev.preferences, prefId] };
    });
  };

  // Step Validation & Navigation
  const nextStep = () => {
    setError('');
    if (step === 1) {
      if (!formData.title.trim()) {
        setError('Please provide a trip title.');
        return;
      }
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        setError('End date must be after the start date.');
        return;
      }
    }

    if (step === 2) {
      if (cityStops.length === 0 || !cityStops[0].name) {
        setError('Please add at least one city destination.');
        return;
      }
      if (allocatedNights !== totalNights) {
        setError(`Please adjust your city nights so they total ${totalNights} nights (Current: ${allocatedNights} nights).`);
        return;
      }
    }

    setStep((prev) => Math.min(5, prev + 1));
  };

  const prevStep = () => {
    setError('');
    setStep((prev) => Math.max(1, prev - 1));
  };

  // Generate Itinerary Preview Schedule
  const previewSchedule = useMemo(() => {
    const dayMap = [];
    cityStops.forEach((stop) => {
      const n = Math.max(1, Number(stop.nights) || 1);
      for (let i = 0; i < n; i++) {
        dayMap.push(stop);
      }
    });

    const schedule = [];
    for (let dayNum = 1; dayNum <= diffDays; dayNum++) {
      const currentStop = dayMap[dayNum - 1] || cityStops[cityStops.length - 1];
      const cityName = currentStop?.name || 'Destination';
      const prevStop = dayNum > 1 ? (dayMap[dayNum - 2] || cityStops[0]) : null;
      const isNewCityArrival = dayNum > 1 && prevStop && prevStop.name !== cityName;

      let title = `Day ${dayNum} in ${cityName}`;
      let highlights = [`Explore ${cityName} landmarks`, `Authentic ${cityName} local cuisine`];

      if (dayNum === 1) {
        title = `Arrival in ${cityName} & Area Orientation`;
        highlights = [`Hotel check-in and neighborhood walk`, `Welcome dinner and city orientation`];
      } else if (isNewCityArrival) {
        title = `Transit from ${prevStop.name} to ${cityName}`;
        highlights = [`Inter-city travel via ${prevStop.transitMode || 'Transit'}`, `Check-in at ${cityName} and evening sunset walk`];
      } else if (dayNum === diffDays) {
        title = `Final Highlights & Departure from ${cityName}`;
        highlights = [`Souvenir shopping and local bazaar`, `Airport / transit station departure`];
      }

      schedule.push({
        dayNumber: dayNum,
        cityName,
        title,
        highlights,
      });
    }
    return schedule;
  }, [cityStops, diffDays]);

  // Final Submit Handler
  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formattedCities = cityStops.map((stop, idx) => {
      const dbCity = (cities || []).find((c) => c.name.toLowerCase() === stop.name.toLowerCase());
      return {
        id: stop.id || `stop-${Date.now()}-${idx}`,
        cityId: dbCity?.id || `city-${stop.name.toLowerCase()}`,
        name: stop.name,
        country: dbCity?.country || stop.country || 'India',
        coordinates: dbCity?.coordinates || [18.9220, 72.8347],
        nights: Number(stop.nights) || 1,
        transitMode: stop.transitMode || 'Train',
      };
    });

    const budgetVal = Number(formData.budget) || 50000;
    const breakdown = {
      flights: Math.round(budgetVal * 0.25),
      accommodation: Math.round(budgetVal * 0.35),
      food: Math.round(budgetVal * 0.15),
      transportation: Math.round(budgetVal * 0.10),
      activities: Math.round(budgetVal * 0.10),
      shopping: Math.round(budgetVal * 0.05),
    };

    try {
      const newTrip = await createTrip({
        title: formData.title,
        description: `${diffDays}-day ${formData.travelStyle} vacation covering ${cityStops.map((c) => c.name).join(' → ')}.`,
        startDate: formData.startDate,
        endDate: formData.endDate,
        durationDays: diffDays,
        travelersCount: Number(formData.travelersCount),
        travelerGroup: formData.travelerGroup,
        budget: budgetVal,
        budgetBreakdown: breakdown,
        travelStyle: formData.travelStyle,
        travelPace: formData.travelPace,
        interests: formData.preferences,
        dietary: formData.dietary,
        coverImage: formData.customCoverUrl.trim() || formData.coverImage,
        destination: cityStops.map((c) => c.name).join(' → '),
        startingCity: cityStops[0]?.name || 'Mumbai',
        cities: formattedCities,
      });

      try {
        confetti({ particleCount: 80, spread: 60 });
      } catch {}

      setLoading(false);
      const tripId = newTrip?.id || newTrip?._id;
      notifySuccess(`Trip "${newTrip?.title || formData.title}" created successfully! Opening workspace.`);
      navigate(tripId ? `/trips/${tripId}/itinerary` : '/trips');
    } catch (err) {
      setLoading(false);
      setError('Failed to create trip. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-left animate-fade-in pb-20 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Step {step} of 5 — Multi-Stop Trip Planner
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Plan Your Custom Journey
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Set your timeline, allocate nights across destinations, and generate a customized day-by-day itinerary.
        </p>
      </div>

      {/* Step Indicator Bar */}
      <div className="grid grid-cols-5 gap-2">
        {[
          { num: 1, label: 'Dates & Basics' },
          { num: 2, label: 'Route & Nights' },
          { num: 3, label: 'Style & Budget' },
          { num: 4, label: 'Interests' },
          { num: 5, label: 'Review & Itinerary' },
        ].map((s) => (
          <button
            key={s.num}
            type="button"
            onClick={() => s.num < step && setStep(s.num)}
            className={`p-2.5 rounded-2xl text-left border transition-all ${
              step === s.num
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : step > s.num
                ? 'bg-indigo-50 text-indigo-900 border-indigo-200 cursor-pointer'
                : 'bg-white text-slate-400 border-slate-200 opacity-60'
            }`}
          >
            <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">Step {s.num}</div>
            <div className="text-xs font-bold truncate mt-0.5">{s.label}</div>
          </button>
        ))}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Basic Info & Timeline */}
      {step === 1 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Step 1: Timeline, Dates & Travelers
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Specify your travel window and who is traveling with you.
            </p>
          </div>

          <div className="space-y-4">
            <Input
              label="Trip Title"
              placeholder="e.g. Mumbai to Goa Coastal Escape"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

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

            {/* Duration Badge */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-900">
                <Clock className="w-4 h-4 text-indigo-600" />
                Calculated Trip Duration
              </div>
              <Badge variant="indigo" className="font-bold text-xs">
                {diffDays} Days / {totalNights} Nights
              </Badge>
            </div>

            {/* Travelers & Group Type */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Who is Traveling?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {TRAVELER_GROUPS.map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, travelerGroup: group.id })}
                    className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      formData.travelerGroup === group.id
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="text-xl mb-1">{group.icon}</div>
                    <div className="text-xs font-bold">{group.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full sm:w-1/2">
              <Input
                label="Total Travelers Count"
                type="number"
                min="1"
                max="20"
                value={formData.travelersCount}
                onChange={(e) => setFormData({ ...formData, travelersCount: Math.max(1, Number(e.target.value)) })}
              />
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Multi-City Route & Nights Allocation */}
      {step === 2 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                Step 2: Multi-City Route & Night Allocation
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Allocate your <strong>{totalNights} nights</strong> across destinations in chronological order.
              </p>
            </div>

            {/* Night Allocation Status Pill */}
            <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border ${
              allocatedNights === totalNights
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : allocatedNights < totalNights
                ? 'bg-amber-50 text-amber-700 border-amber-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              {allocatedNights === totalNights ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5" />
              )}
              <span>
                Allocated: {allocatedNights} / {totalNights} Nights
              </span>
            </div>
          </div>

          {/* Stops List */}
          <div className="space-y-4">
            {cityStops.map((stop, index) => (
              <div
                key={stop.id || index}
                className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-extrabold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {index === 0 ? 'Starting Stop' : `Stop ${index + 1}`}
                    </span>
                  </div>

                  {cityStops.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCityStop(index)}
                      className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove Stop
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* City Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      City / Destination
                    </label>
                    <select
                      value={stop.name}
                      onChange={(e) => handleCityChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {(cities || []).map((c) => (
                        <option key={c.id || c.name} value={c.name}>
                          {c.name}, {c.country}
                        </option>
                      ))}
                      <option value="Manali">Manali, India</option>
                      <option value="Shimla">Shimla, India</option>
                      <option value="Agra">Agra, India</option>
                      <option value="Varanasi">Varanasi, India</option>
                      <option value="Bangalore">Bangalore, India</option>
                      <option value="Kochi">Kochi, India</option>
                    </select>
                  </div>

                  {/* Nights Counter */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nights to Stay
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleNightChange(index, -1)}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-bold text-sm text-slate-900 bg-white py-1.5 rounded-lg border border-slate-200">
                        {stop.nights} {stop.nights === 1 ? 'Night' : 'Nights'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleNightChange(index, 1)}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Transit to next */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Transit Method
                    </label>
                    <select
                      value={stop.transitMode || 'Train'}
                      onChange={(e) => handleCityChange(index, 'transitMode', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="Train / AC Express">🚆 Train / AC Express</option>
                      <option value="Flight / Air Travel">✈️ Flight / Air Travel</option>
                      <option value="Road Trip / Self-Drive">🚗 Road Trip / Private Cab</option>
                      <option value="Ferry / Cruise">🚢 Ferry / Coastal Cruise</option>
                      <option value="Direct Departure">🏁 Final Stop / Departure</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Stop Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={Plus}
              onClick={addCityStop}
              className="w-full border-dashed border-2 py-3"
            >
              Add Another City Stop to Route
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: Style & Budget */}
      {step === 3 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-indigo-600" />
              Step 3: Budget & Travel Style
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Help us tailor recommendations and pacing to your preferred comfort tier.
            </p>
          </div>

          <div className="space-y-6">
            {/* Total Budget Input */}
            <div>
              <Input
                label={`Total Estimated Trip Budget (${currency})`}
                type="number"
                min="5000"
                step="5000"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                required
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Allocates ~{formatMoney(Math.round(formData.budget / diffDays))}/day across stays, dining, transit, and activities.
              </p>
            </div>

            {/* Travel Pace */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Daily Itinerary Pace
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {TRAVEL_PACES.map((pace) => (
                  <button
                    key={pace.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, travelPace: pace.id })}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      formData.travelPace === pace.id
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{pace.label}</div>
                    <div className="text-[11px] text-slate-500 mt-1 leading-snug">{pace.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Accommodation Tier */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Accommodation Preference
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ACCOMMODATION_TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, accommodationTier: tier.id })}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      formData.accommodationTier === tier.id
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{tier.label}</div>
                    <div className="text-[11px] text-slate-500 mt-1 leading-snug">{tier.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Interests & Dietary */}
      {step === 4 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              Step 4: Travel Interests & Dining Preferences
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select what you'd love to experience most during this journey.
            </p>
          </div>

          <div className="space-y-6">
            {/* Interests Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PREFERENCE_OPTIONS.map((pref) => {
                const selected = formData.preferences.includes(pref.id);
                return (
                  <button
                    key={pref.id}
                    type="button"
                    onClick={() => togglePreference(pref.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      selected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 shadow-xs'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 ${
                      selected ? 'bg-indigo-600 text-white' : 'border border-slate-300'
                    }`}>
                      {selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold">{pref.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{pref.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Dietary Preference */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Dietary Preference
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['Vegetarian', 'Vegan', 'Non-Veg / Halal', 'Any Cuisine'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setFormData({ ...formData, dietary: d })}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      formData.dietary === d
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 font-bold'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="text-xs">{d}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 5: Day-by-Day Itinerary Preview & Cover Selection */}
      {step === 5 && (
        <div className="space-y-6">
          {/* Summary Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Step 5: Review Summary & Generated Day-by-Day Schedule
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Verify your multi-stop route schedule before opening the full trip workspace.
              </p>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase">Route Stops</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 mt-1 truncate">
                  {cityStops.map((s) => s.name).join(' → ')}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase">Timeline</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                  {diffDays} Days ({totalNights} Nights)
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase">Travelers</div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 mt-1">
                  {formData.travelersCount} ({formData.travelerGroup})
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500 uppercase">Budget Cap</div>
                <div className="text-xs sm:text-sm font-bold text-indigo-600 mt-1">
                  {formatMoney(formData.budget)}
                </div>
              </div>
            </div>

            {/* DAY-BY-DAY ITINERARY PREVIEW */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-indigo-600" />
                  Day-by-Day Schedule Distribution
                </h3>
                <span className="text-[11px] font-semibold text-slate-500">
                  {previewSchedule.length} Days Generated
                </span>
              </div>

              <div className="space-y-2.5">
                {previewSchedule.map((day) => (
                  <div
                    key={day.dayNumber}
                    className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center font-black text-indigo-600 shrink-0">
                        <span className="text-[10px] uppercase tracking-wider text-slate-400">Day</span>
                        <span className="text-base leading-none">{day.dayNumber}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-slate-900">
                            {day.title}
                          </span>
                          <Badge variant="indigo" className="text-[10px] font-bold py-0.5">
                            📍 {day.cityName}
                          </Badge>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {day.highlights.join(' • ')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cover Visual Selector */}
            <div className="space-y-3 pt-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Trip Cover Visual
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {COVER_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, coverImage: preset.url })}
                    className={`group relative aspect-video rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                      formData.coverImage === preset.url
                        ? 'border-indigo-600 ring-2 ring-indigo-600/30'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                      <span className="text-[11px] font-bold text-white leading-tight">{preset.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        {step > 1 ? (
          <Button
            type="button"
            variant="outline"
            size="md"
            icon={ArrowLeft}
            onClick={prevStep}
            disabled={loading}
          >
            Previous Step
          </Button>
        ) : (
          <Link to="/trips">
            <Button variant="outline" size="md">
              Cancel
            </Button>
          </Link>
        )}

        {step < 5 ? (
          <Button
            type="button"
            variant="primary"
            size="md"
            iconRight={ArrowRight}
            onClick={nextStep}
          >
            Continue to Step {step + 1}
          </Button>
        ) : (
          <Button
            type="button"
            variant="primary"
            size="lg"
            icon={Sparkles}
            onClick={handleFinalSubmit}
            disabled={loading}
            className="shadow-lg shadow-indigo-600/20"
          >
            {loading ? 'Creating Trip Workspace...' : 'Create Trip & Open Workspace'}
          </Button>
        )}
      </div>
    </div>
  );
}

export default CreateTrip;
