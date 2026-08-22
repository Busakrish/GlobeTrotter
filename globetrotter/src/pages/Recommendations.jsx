import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { aiApi } from '../services/api';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import {
  Sparkles,
  MapPin,
  Calendar,
  Sliders,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  TrendingDown,
  RefreshCw,
  Compass,
  Umbrella,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const VIBE_OPTIONS = [
  { id: 'Heritage', label: '🏛️ Heritage & History', color: '#714B67' },
  { id: 'Street Food', label: '🍜 Street Food & Dining', color: '#F16E62' },
  { id: 'Beach', label: '🏖️ Coastal & Beach', color: '#3E8EDE' },
  { id: 'Nature', label: '🌲 Nature & Mountain', color: '#2AB79B' },
  { id: 'Spiritual', label: '🕉️ Spiritual & Ghats', color: '#F0A63F' },
  { id: 'Adventure', label: '🧗 Adventure & Trekking', color: '#E05A47' },
  { id: 'Relaxation', label: '💆 Wellness & Chill', color: '#2AB79B' },
  { id: 'Photography', label: '📸 Scenic Photography', color: '#714B67' },
];

const DEFAULT_DESTINATIONS_DATA = {
  personaSummary: 'Curated for a Moderate traveler who loves Heritage, Street Food & Scenic Photography at a Relaxed pace.',
  recommendations: [
    {
      destinationId: 'dest-udaipur',
      name: 'Udaipur, Rajasthan',
      stateOrCountry: 'India',
      matchScore: 96,
      highlight: 'Romantic lake palaces, heritage boat rides, and rooftop Mewari dining.',
      idealDuration: '3 - 4 Days',
      estimatedBudgetPerPerson: 18000,
      accentColor: '#F16E62',
      topExperiences: ['City Palace Tour', 'Lake Pichola Sunset Cruise', 'Bagore Ki Haveli Dance Show'],
      tags: ['Heritage', 'Romantic', 'Architecture', 'Culture'],
    },
    {
      destinationId: 'dest-munnar',
      name: 'Munnar, Kerala',
      stateOrCountry: 'India',
      matchScore: 92,
      highlight: 'Emerald tea plantations, misty mountain vistas, and Ayurvedic wellness.',
      idealDuration: '3 - 5 Days',
      estimatedBudgetPerPerson: 15000,
      accentColor: '#2AB79B',
      topExperiences: ['Kolukkumalai Sunrise Jeep Safari', 'Tea Museum & Tasting', 'Eravikulam National Park'],
      tags: ['Nature', 'Relaxation', 'Scenic', 'Trekking'],
    },
    {
      destinationId: 'dest-varanasi',
      name: 'Varanasi, Uttar Pradesh',
      stateOrCountry: 'India',
      matchScore: 89,
      highlight: 'Ancient spiritual ghats, evening Ganga Aarti, and legendary silk weaving.',
      idealDuration: '2 - 3 Days',
      estimatedBudgetPerPerson: 11000,
      accentColor: '#F0A63F',
      topExperiences: ['Dawn Boat Ride on Ganga', 'Dashashwamedh Aarti', 'Kashi Street Food Trail'],
      tags: ['Spiritual', 'Street Food', 'Historic', 'Photography'],
    },
    {
      destinationId: 'dest-hampi',
      name: 'Hampi, Karnataka',
      stateOrCountry: 'India',
      matchScore: 87,
      highlight: 'UNESCO boulder landscape, Vijayanagara ruins, and riverside cafe culture.',
      idealDuration: '3 Days',
      estimatedBudgetPerPerson: 12500,
      accentColor: '#3E8EDE',
      topExperiences: ['Virupaksha Temple', 'Coracle Ride across Tungabhadra', 'Matanga Hill Sunset'],
      tags: ['Ruins', 'Adventure', 'UNESCO', 'Bohemian'],
    },
  ],
};

export function Recommendations() {
  const { createTrip } = useTrips();
  const { formatMoney } = useAuth();
  const { notifySuccess, notifyError } = useNotification();
  const navigate = useNavigate();

  // Active Tab
  const [activeTab, setActiveTab] = useState('destinations'); // 'destinations' | 'itinerary' | 'budget'

  // Persona filters
  const [selectedVibes, setSelectedVibes] = useState(['Heritage', 'Street Food', 'Scenic Photography']);
  const [budgetTier, setBudgetTier] = useState('Moderate');
  const [preferredPace, setPreferredPace] = useState('Relaxed');
  const [startingCity, setStartingCity] = useState('Mumbai');

  // Itinerary Generator Form State
  const [destination, setDestination] = useState('Goa');
  const [itineraryDays, setItineraryDays] = useState(4);
  const [itineraryBudget, setItineraryBudget] = useState(35000);
  const [travelers, setTravelers] = useState(2);
  const [travelStyle, setTravelStyle] = useState('Balanced Explorer');

  // Loading & Data States
  const [loading, setLoading] = useState(false);
  const [destinationsData, setDestinationsData] = useState(DEFAULT_DESTINATIONS_DATA);
  const [generatedItinerary, setGeneratedItinerary] = useState(null);
  const [budgetOptimizerData, setBudgetOptimizerData] = useState(null);

  // Toggle vibe selection
  const toggleVibe = (vibeId) => {
    setSelectedVibes((prev) =>
      prev.includes(vibeId) ? prev.filter((v) => v !== vibeId) : [...prev, vibeId]
    );
  };

  // Fetch Personalized Recommendations
  const fetchPersonalizedRecommendations = async () => {
    setLoading(true);
    try {
      const response = await aiApi.getPersonalizedRecommendations({
        userPersona: {
          vibes: selectedVibes,
          budgetTier,
          preferredPace,
          startingCity,
        },
        limit: 4,
      });

      if (response?.data) {
        setDestinationsData(response.data);
      }
    } catch (err) {
      console.warn('API error, using client fallback:', err);
    } finally {
      setLoading(false);
    }
  };

  // Generate Itinerary
  const handleGenerateItinerary = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await aiApi.generateItinerary({
        destination,
        days: itineraryDays,
        budget: itineraryBudget,
        travelers,
        travelStyle,
        interests: selectedVibes,
        pace: preferredPace,
      });

      if (res?.data) {
        setGeneratedItinerary(res.data);
        notifySuccess(`AI crafted ${itineraryDays}-day itinerary for ${destination}!`);
      }
    } catch (err) {
      notifyError('Failed to synthesize AI itinerary.');
    } finally {
      setLoading(false);
    }
  };

  // Run Budget Optimizer
  const handleRunBudgetOptimizer = async () => {
    setLoading(true);
    try {
      const res = await aiApi.optimizeBudget({
        destination,
        targetBudget: itineraryBudget,
        currentEstimatedCost: Math.round(itineraryBudget * 1.3),
        durationDays: itineraryDays,
      });
      if (res?.data) {
        setBudgetOptimizerData(res.data);
        notifySuccess('AI Budget Optimization strategies ready!');
      }
    } catch (err) {
      notifyError('Failed to calculate budget optimization.');
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchPersonalizedRecommendations();
  }, []);

  // Adopt Plan into user's trips
  const handleAdoptPlan = async (plan) => {
    try {
      const cityName = plan.name?.split(',')?.[0] || plan.destination || startingCity;
      const daysCount = plan.durationDays || Number(plan.idealDuration?.match(/\d+/)?.[0]) || 4;

      const newTrip = await createTrip({
        title: plan.title || `${plan.name} Exploration`,
        description: plan.highlight || plan.summary || 'AI-recommended personalized trip',
        coverImage: plan.coverImage || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
        startDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
        endDate: new Date(Date.now() + 86400000 * (5 + daysCount)).toISOString().split('T')[0],
        budget: plan.estimatedBudgetPerPerson || plan.totalEstimatedCost || plan.budget || 35000,
        budgetBreakdown: plan.budgetBreakdown,
        travelStyle: travelStyle,
        interests: selectedVibes,
        startingCity: cityName,
        days: plan.days && plan.days.length > 0 ? plan.days : undefined,
        packingList: plan.packingList && plan.packingList.length > 0 ? plan.packingList : undefined,
      });

      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch {}

      const tripId = newTrip?.id || newTrip?._id;
      notifySuccess(`Created "${newTrip?.title || 'Trip'}"! Opening builder.`);
      if (tripId) {
        navigate(`/trips/${tripId}/itinerary`);
      } else {
        navigate('/trips');
      }
    } catch (err) {
      console.error('Error creating trip:', err);
      notifyError('Failed to adopt trip plan.');
    }
  };

  return (
    <div className="space-y-8 text-left animate-fade-in pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#714B67] bg-[#714B67]/10 px-3 py-1 rounded-full border border-[#714B67]/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            AI & Smart Recommendation Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B26] tracking-tight">
            Personalized Travel Curator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Intelligent travel recommendations, custom itinerary planning & real-time trip optimization.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-[#F1F1F3] p-1 rounded-xl border border-slate-200 self-start">
          <button
            onClick={() => setActiveTab('destinations')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'destinations'
                ? 'bg-white text-[#714B67] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🎯 Curated Places
          </button>
          <button
            onClick={() => setActiveTab('itinerary')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'itinerary'
                ? 'bg-white text-[#714B67] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🗺️ Smart Itinerary
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'budget'
                ? 'bg-white text-[#714B67] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            💰 Budget Optimizer
          </button>
        </div>
      </div>

      {/* TAB 1: CURATED PLACES */}
      {activeTab === 'destinations' && (
        <div className="space-y-8">
          {/* Persona Tuning Panel */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-[#1B1B26] flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#714B67]" />
                Tune Your Travel Persona
              </h3>
              <Button
                size="sm"
                variant="outline"
                loading={loading}
                icon={RefreshCw}
                onClick={fetchPersonalizedRecommendations}
              >
                Refresh Suggestions
              </Button>
            </div>

            {/* Travel Vibes Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Your Vibes & Passions
              </label>
              <div className="flex flex-wrap gap-2">
                {VIBE_OPTIONS.map((vibe) => {
                  const isSelected = selectedVibes.includes(vibe.id);
                  return (
                    <button
                      key={vibe.id}
                      type="button"
                      onClick={() => toggleVibe(vibe.id)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                        isSelected
                          ? 'bg-[#714B67] text-white border-[#714B67] shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {vibe.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Parameters Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Budget Tier</label>
                <select
                  value={budgetTier}
                  onChange={(e) => setBudgetTier(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-[#F1F1F3]"
                >
                  <option value="Budget Backpacker">Backpacker / Budget</option>
                  <option value="Moderate">Moderate / Value</option>
                  <option value="Luxury & Heritage">Luxury & Heritage</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Trip Pace</label>
                <select
                  value={preferredPace}
                  onChange={(e) => setPreferredPace(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-[#F1F1F3]"
                >
                  <option value="Relaxed">Relaxed (Slow travel & cafe time)</option>
                  <option value="Moderate">Balanced (2-3 spots daily)</option>
                  <option value="Packed & Fast">Fast-Paced (Cover everything)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Starting From</label>
                <input
                  type="text"
                  value={startingCity}
                  onChange={(e) => setStartingCity(e.target.value)}
                  placeholder="e.g. Mumbai, Delhi"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-[#F1F1F3]"
                />
              </div>
            </div>
          </div>

          {/* AI Persona Summary Banner */}
          {destinationsData?.personaSummary && (
            <div className="p-4 rounded-2xl bg-[#714B67]/5 border border-[#714B67]/15 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#714B67] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#714B67] uppercase tracking-wide">AI Curator Match Profile</h4>
                <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">{destinationsData.personaSummary}</p>
              </div>
            </div>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {destinationsData?.recommendations?.map((rec) => (
              <div
                key={rec.destinationId}
                className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                style={{ borderTop: `4px solid ${rec.accentColor || '#714B67'}` }}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{rec.stateOrCountry}</span>
                      </div>
                      <h3 className="text-lg font-bold text-[#1B1B26] mt-0.5">{rec.name}</h3>
                    </div>
                    <Badge variant="emerald" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-extrabold text-xs">
                      {rec.matchScore}% Match
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-[#F1F1F3] p-3 rounded-xl">
                    {rec.highlight}
                  </p>

                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                      Top Experiences
                    </span>
                    <ul className="space-y-1">
                      {rec.topExperiences?.map((exp, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2AB79B] shrink-0" />
                          <span>{exp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {rec.tags?.map((tag, i) => (
                      <span key={i} className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-6">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 font-bold block">Est. Budget / person</span>
                    <span className="text-sm font-extrabold text-[#1B1B26]">
                      {formatMoney(rec.estimatedBudgetPerPerson)}
                    </span>
                    <span className="text-[10px] text-slate-500 ml-1.5">({rec.idealDuration})</span>
                  </div>

                  <Button
                    size="sm"
                    variant="primary"
                    icon={ArrowRight}
                    onClick={() => handleAdoptPlan(rec)}
                  >
                    Adopt Destination
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: SMART ITINERARY GENERATOR */}
      {activeTab === 'itinerary' && (
        <div className="space-y-8">
          <form onSubmit={handleGenerateItinerary} className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-[#1B1B26] flex items-center gap-2 border-b border-slate-100 pb-3">
              <Zap className="w-4 h-4 text-[#F16E62]" />
              Generate Multi-Day Itinerary
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Target Destination</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Goa, Jaipur, Manali"
                  required
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-[#F1F1F3]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Duration: <span className="text-[#714B67] font-bold">{itineraryDays} Days</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={itineraryDays}
                  onChange={(e) => setItineraryDays(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#714B67] mt-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Budget: <span className="text-[#2AB79B] font-bold">{formatMoney(itineraryBudget)}</span>
                </label>
                <input
                  type="range"
                  min="10000"
                  max="150000"
                  step="5000"
                  value={itineraryBudget}
                  onChange={(e) => setItineraryBudget(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2AB79B] mt-2"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" size="lg" loading={loading} icon={Sparkles}>
                Synthesize Itinerary
              </Button>
            </div>
          </form>

          {/* Generated Result */}
          {generatedItinerary && (
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-extrabold text-[#1B1B26]">{generatedItinerary.title}</h3>
                  <p className="text-xs text-slate-500 mt-1">{generatedItinerary.summary}</p>
                </div>
                <Button variant="primary" size="sm" icon={ArrowRight} onClick={() => handleAdoptPlan(generatedItinerary)}>
                  Save & Open in Builder
                </Button>
              </div>

              {/* Days Timeline */}
              <div className="space-y-4">
                {generatedItinerary.days?.map((day) => (
                  <div key={day.dayNumber} className="p-4 rounded-2xl bg-[#F1F1F3] border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#714B67] bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        Day {day.dayNumber}: {day.title}
                      </span>
                      <span className="text-xs text-slate-500 font-semibold">{day.cityName}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {day.activities?.map((act, i) => (
                        <div key={i} className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-[#1B1B26]">{act.name || act.title}</span>
                            <span className="text-[#2AB79B] font-bold">{formatMoney(act.cost || act.estimatedCost || 0)}</span>
                          </div>
                          <p className="text-[11px] text-slate-500">{act.description}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-1">
                            <span>⏱️ {act.time || '10:00'} ({act.durationMinutes || 90}m)</span>
                            <span>📍 {act.location}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BUDGET OPTIMIZER */}
      {activeTab === 'budget' && (
        <div className="space-y-6">
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#1B1B26] flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-[#2AB79B]" />
                  AI Budget Optimizer & Smart Reallocation
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Identifies luxury trade-offs and savings without compromising authentic trip experiences.
                </p>
              </div>

              <Button size="sm" variant="outline" loading={loading} onClick={handleRunBudgetOptimizer}>
                Run Analysis
              </Button>
            </div>

            {budgetOptimizerData && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-[#F1F1F3] text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Target Budget</span>
                    <p className="text-lg font-extrabold text-[#1B1B26]">{formatMoney(budgetOptimizerData.currentBudget)}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#F16E62]/10 text-center border border-[#F16E62]/20">
                    <span className="text-[10px] font-bold text-[#F16E62] uppercase">Initial Estimate</span>
                    <p className="text-lg font-extrabold text-[#F16E62]">{formatMoney(budgetOptimizerData.estimatedCost)}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#2AB79B]/10 text-center border border-[#2AB79B]/20">
                    <span className="text-[10px] font-bold text-[#2AB79B] uppercase">Potential Savings</span>
                    <p className="text-lg font-extrabold text-[#2AB79B]">{formatMoney(budgetOptimizerData.savingsTotal || budgetOptimizerData.potentialSavings)}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">AI Reallocation Strategies</h4>
                  {budgetOptimizerData.recommendations?.map((item, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-[#714B67] bg-[#714B67]/10 px-2 py-0.5 rounded-md">
                            {item.category}
                          </span>
                          <h5 className="text-xs font-bold text-[#1B1B26]">{item.title}</h5>
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{item.description}</p>
                      </div>
                      <span className="text-xs font-extrabold text-[#2AB79B] shrink-0 bg-[#2AB79B]/10 px-2.5 py-1 rounded-lg">
                        Save {formatMoney(item.savings || item.estimatedSavings)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Recommendations;
