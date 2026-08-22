import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Input, { TextArea, Select } from '../components/common/Input';
import Button from '../components/common/Button';
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
  { id: 'Adventure', label: '🧗 Adventure & Sports' },
  { id: 'Relaxation', label: '🏖️ Beach & Relaxation' },
  { id: 'Culture', label: '🏛️ Culture & Heritage' },
  { id: 'Food', label: '🍜 Food & Gastronomy' },
  { id: 'Nature', label: '🌿 Nature & Wildlife' },
  { id: 'Shopping', label: '🛍️ Shopping & Bazaars' },
  { id: 'History', label: '🏰 Palaces & History' },
  { id: 'Nightlife', label: '🍸 Nightlife & Music' },
];

export function CreateTrip() {
  const [searchParams] = useSearchParams();
  const initialCity = searchParams.get('city') || 'Mumbai';

  const { createTrip, cities } = useTrips();
  const { formatMoney, currency } = useAuth();
  const { notifySuccess } = useNotification();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    title: `Grand Tour: ${initialCity} & Beyond`,
    description: `A customized multi-city vacation exploring the cultural wonders, local food trails, and scenic attractions of ${initialCity}.`,
    startDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000 * 12).toISOString().split('T')[0],
    travelersCount: 2,
    startingCity: initialCity,
    secondaryCity: initialCity === 'Mumbai' ? 'Goa' : 'Jaipur',
    preferences: ['Culture', 'Food', 'Relaxation'],
    budget: 50000,
    budgetBreakdown: {
      flights: 12500,
      accommodation: 17500,
      food: 7500,
      transportation: 5000,
      activities: 5000,
      shopping: 2500,
    },
    travelStyle: 'Moderate', // 'Budget' | 'Moderate' | 'Luxury'
    coverImage: COVER_PRESETS[0].url,
    customCoverUrl: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const togglePreference = (prefId) => {
    setFormData((prev) => {
      const exists = prev.preferences.includes(prefId);
      if (exists) {
        return { ...prev, preferences: prev.preferences.filter((p) => p !== prefId) };
      }
      return { ...prev, preferences: [...prev.preferences, prefId] };
    });
  };

  const nextStep = () => {
    setError('');
    if (step === 1) {
      if (!formData.title.trim()) {
        setError('Please provide a trip title.');
        return;
      }
      if (new Date(formData.endDate) < new Date(formData.startDate)) {
        setError('End date cannot be earlier than start date.');
        return;
      }
    }
    setStep((prev) => Math.min(5, prev + 1));
  };

  const prevStep = () => {
    setError('');
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const startCityObj = cities.find(
      (c) => c.name.toLowerCase() === formData.startingCity.toLowerCase()
    ) || {
      name: formData.startingCity,
      country: 'India',
      coordinates: [18.9220, 72.8347],
    };

    const secondCityObj = cities.find(
      (c) => c.name.toLowerCase() === formData.secondaryCity.toLowerCase()
    ) || {
      name: formData.secondaryCity,
      country: 'India',
      coordinates: [15.2993, 74.1240],
    };

    const finalCities = [
      {
        id: 'stop-' + Date.now() + '-1',
        cityId: startCityObj.id || 'city-' + startCityObj.name.toLowerCase(),
        name: startCityObj.name,
        country: startCityObj.country || 'India',
        coordinates: startCityObj.coordinates || [18.9220, 72.8347],
        nights: 2,
        arrivalDate: formData.startDate,
        departureDate: formData.startDate,
        transitToNext: {
          toCity: secondCityObj.name,
          mode: 'Train / AC Express',
          durationMinutes: 300,
          durationText: '5h 00m',
          departureTime: '11:00',
          arrivalTime: '16:00',
          cost: 1600,
        },
      },
      {
        id: 'stop-' + Date.now() + '-2',
        cityId: secondCityObj.id || 'city-' + secondCityObj.name.toLowerCase(),
        name: secondCityObj.name,
        country: secondCityObj.country || 'India',
        coordinates: secondCityObj.coordinates || [15.2993, 74.1240],
        nights: 3,
        arrivalDate: formData.endDate,
        departureDate: formData.endDate,
        transitToNext: null,
      },
    ];

    setTimeout(async () => {
      try {
        const newTrip = await createTrip({
          title: formData.title,
          description: formData.description,
          startDate: formData.startDate,
          endDate: formData.endDate,
          travelersCount: Number(formData.travelersCount),
          budget: Number(formData.budget),
          budgetBreakdown: formData.budgetBreakdown,
          travelStyle: formData.travelStyle,
          interests: formData.preferences,
          coverImage: formData.customCoverUrl.trim() || formData.coverImage,
          startingCity: formData.startingCity,
          cities: finalCities,
        });

        try {
          confetti({ particleCount: 80, spread: 60 });
        } catch {}

        setLoading(false);
        const tripId = newTrip?.id || newTrip?._id;
        notifySuccess(`Trip "${newTrip?.title || 'Trip'}" created successfully! Opening workspace.`);
        navigate(tripId ? `/trips/${tripId}` : '/trips');
      } catch (err) {
        setLoading(false);
        setError('Failed to create trip. Please try again.');
      }
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto text-left animate-fade-in pb-16 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Step {step} of 5 — Multi-Step Trip Planner
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create a New Multi-City Trip
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Follow our 5-step wizard to setup timeline, preferences, category budget caps, and multi-city stops.
        </p>
      </div>

      {/* Step Indicator Bar */}
      <div className="grid grid-cols-5 gap-2">
        {[
          { num: 1, label: 'Basic Info' },
          { num: 2, label: 'Preferences' },
          { num: 3, label: 'Budget' },
          { num: 4, label: 'Travel Style' },
          { num: 5, label: 'Summary' },
        ].map((s) => (
          <button
            key={s.num}
            type="button"
            onClick={() => s.num < step && setStep(s.num)}
            className={`p-2.5 rounded-2xl text-left border transition-all ${
              step === s.num
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : step > s.num
                ? 'bg-indigo-50 text-indigo-900 border-indigo-200'
                : 'bg-white text-slate-400 border-slate-200'
            }`}
          >
            <span className="text-[10px] font-extrabold block opacity-80">Step {s.num}</span>
            <span className="text-xs font-bold truncate block">{s.label}</span>
          </button>
        ))}
      </div>

      <form onSubmit={step === 5 ? handleFinalSubmit : (e) => { e.preventDefault(); nextStep(); }} className="space-y-8">
        {/* STEP 1: Basic Information */}
        {step === 1 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Compass className="w-4 h-4 text-indigo-600" />
              Step 1 — Basic Trip Details & Destinations
            </h3>

            <Input
              label="Trip Name / Title"
              placeholder="e.g. Coastal Getaway: Mumbai to Goa"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <TextArea
              label="Description / Purpose"
              placeholder="What are the main goals of this vacation?"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Starting City Stop"
                value={formData.startingCity}
                onChange={(e) => setFormData({ ...formData, startingCity: e.target.value })}
                options={cities.map((c) => ({ value: c.name, label: `${c.name} (${c.country})` }))}
              />
              <Select
                label="Second City Stop (Multi-City)"
                value={formData.secondaryCity}
                onChange={(e) => setFormData({ ...formData, secondaryCity: e.target.value })}
                options={cities.map((c) => ({ value: c.name, label: `${c.name} (${c.country})` }))}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              <Input
                label="Number of Travelers"
                type="number"
                min="1"
                max="20"
                value={formData.travelersCount}
                onChange={(e) =>
                  setFormData({ ...formData, travelersCount: Number(e.target.value) })
                }
                required
              />
            </div>
          </div>
        )}

        {/* STEP 2: Travel Preferences */}
        {step === 2 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-indigo-600" />
              Step 2 — Select Travel Preferences & Themes
            </h3>
            <p className="text-xs text-slate-500">
              Select the experiences that matter most for this trip. We will tune recommendations and packing items accordingly.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {PREFERENCE_OPTIONS.map((pref) => {
                const selected = formData.preferences.includes(pref.id);
                return (
                  <button
                    key={pref.id}
                    type="button"
                    onClick={() => togglePreference(pref.id)}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-24 ${
                      selected
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-950 ring-2 ring-indigo-600/20'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs font-bold">{pref.label}</span>
                    {selected && (
                      <span className="self-end text-[10px] font-bold text-indigo-600 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Selected
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 3: Budget & Category Allocation */}
        {step === 3 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-indigo-600" />
              Step 3 — Total Budget & Category Allocation
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Total Budget Target ({currency}): <span className="font-extrabold text-indigo-600 text-base">{formatMoney(formData.budget)}</span>
              </label>
              <input
                type="range"
                min="10000"
                max="300000"
                step="5000"
                value={formData.budget}
                onChange={(e) => {
                  const b = Number(e.target.value);
                  setFormData({
                    ...formData,
                    budget: b,
                    budgetBreakdown: {
                      flights: Math.round(b * 0.25),
                      accommodation: Math.round(b * 0.35),
                      food: Math.round(b * 0.15),
                      transportation: Math.round(b * 0.10),
                      activities: Math.round(b * 0.10),
                      shopping: Math.round(b * 0.05),
                    }
                  });
                }}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Target Budget Breakdown
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(formData.budgetBreakdown).map(([cat, amt]) => (
                  <div key={cat} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                    <span className="capitalize font-semibold text-slate-500 block">{cat}</span>
                    <span className="text-sm font-extrabold text-slate-900 block mt-1">
                      {formatMoney(amt)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Travel Style */}
        {step === 4 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Step 4 — Select Travel Style
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  id: 'Budget',
                  title: '🎒 Budget Explorer',
                  desc: 'Hostels, public transit, local street foods & free self-guided walks.',
                },
                {
                  id: 'Moderate',
                  title: '✨ Moderate / Balanced',
                  desc: 'Boutique hotels, AC express trains, popular dining & guided tours.',
                },
                {
                  id: 'Luxury',
                  title: '👑 Luxury Heritage',
                  desc: '5-star heritage palaces, private chauffeur transfers & fine dining.',
                },
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, travelStyle: style.id })}
                  className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-32 ${
                    formData.travelStyle === style.id
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-950 ring-2 ring-indigo-600/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <h4 className="text-sm font-bold">{style.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{style.desc}</p>
                  </div>
                  {formData.travelStyle === style.id && (
                    <span className="text-[11px] font-bold text-indigo-600 flex items-center gap-1 mt-2">
                      <Check className="w-3.5 h-3.5" /> Selected
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 5: Generate Trip & Summary */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-5">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                Step 5 — Review Summary & Select Cover Visual
              </h3>

              {/* Summary Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Stops</span>
                  <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                    {formData.startingCity} → {formData.secondaryCity}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Dates</span>
                  <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                    {formData.startDate} to {formData.endDate}
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Travelers</span>
                  <span className="text-xs font-bold text-slate-900 mt-0.5 block">
                    {formData.travelersCount} Travelers
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Budget</span>
                  <span className="text-xs font-extrabold text-indigo-600 mt-0.5 block">
                    {formatMoney(formData.budget)}
                  </span>
                </div>
              </div>

              {/* Cover Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Select Trip Cover Photo
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {COVER_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          coverImage: preset.url,
                          customCoverUrl: '',
                        })
                      }
                      className={`relative h-24 rounded-2xl overflow-hidden border-2 transition-all group ${
                        formData.coverImage === preset.url && !formData.customCoverUrl
                          ? 'border-indigo-600 ring-2 ring-indigo-600/30'
                          : 'border-transparent hover:opacity-90'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                      <span className="absolute bottom-1.5 inset-x-2 text-[10px] font-bold text-white truncate drop-shadow-sm">
                        {preset.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {error && <p className="text-xs font-bold text-rose-600">{error}</p>}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-2">
          {step > 1 ? (
            <Button type="button" variant="outline" icon={ArrowLeft} onClick={prevStep}>
              Previous Step
            </Button>
          ) : (
            <Link to="/trips">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          )}

          {step < 5 ? (
            <Button type="button" variant="primary" size="md" iconRight={ArrowRight} onClick={nextStep}>
              Continue to Step {step + 1}
            </Button>
          ) : (
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              icon={Sparkles}
            >
              Create Trip & Open Workspace
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

export default CreateTrip;
