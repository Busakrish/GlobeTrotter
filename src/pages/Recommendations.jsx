import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import {
  Sparkles,
  Compass,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sliders,
  Send,
  Plane,
} from 'lucide-react';
import confetti from 'canvas-confetti';

const AI_PRESET_RECOMMENDATIONS = [
  {
    id: 'ai-rec-1',
    title: 'Konkan & Coastal Goa Sun & Seafood Odyssey',
    tagline: 'Colonial South Bombay Art Walk & Beachside Relaxation',
    matchScore: 98,
    destinations: ['Mumbai', 'Goa'],
    durationDays: 5,
    estimatedCost: 42000,
    style: 'Balanced Explorer',
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Irani cafe breakfast & Victorian architectural stroll in Colaba',
      'Scenic Konkan Railway ride along mist-covered mountain tunnels',
      'Scuba diving, dolphin cruise, and sunset shack dining in North Goa',
    ],
    whyItFits: 'Perfect match for moderate budget seeking beach relaxation, cultural architecture, and authentic local cuisine.',
  },
  {
    id: 'ai-rec-2',
    title: 'Mewar Royalty: Jaipur Forts to Udaipur Lake Palaces',
    tagline: 'Hilltop Fortresses, Rajasthani Folk Evenings & Sunset Boats',
    matchScore: 95,
    destinations: ['Jaipur', 'Udaipur'],
    durationDays: 6,
    estimatedCost: 54000,
    style: 'Luxury Heritage',
    coverImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Sunrise hot air balloon flight over Aravalli hills & Amer Fort',
      'Traditional Kalbelia dance and royal thali dinner at Chokhi Dhani',
      'Sunset boat cruise across Lake Pichola overlooking illuminated City Palace',
    ],
    whyItFits: 'Ideal for history and photography lovers looking for majestic palaces and vibrant handicrafts.',
  },
  {
    id: 'ai-rec-3',
    title: 'Neon Tokyo to Zen Shrines of Kyoto',
    tagline: 'High-Speed Shinkansen, Digital Art & Ancient Shinto Shrines',
    matchScore: 92,
    destinations: ['Tokyo', 'Kyoto'],
    durationDays: 7,
    estimatedCost: 175000,
    style: 'Cultural & Modern',
    coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'teamLab Planets digital mirror immersion in Toyosu',
      'Shinkansen bullet train journey past Mount Fuji',
      'Fushimi Inari thousand torii gates morning walking trail',
    ],
    whyItFits: 'Recommended for travelers fascinated by cutting-edge modern tech paired with tranquil historic shrines.',
  },
];

export function Recommendations() {
  const { createTrip } = useTrips();
  const { formatMoney } = useAuth();
  const { notifySuccess } = useNotification();
  const navigate = useNavigate();

  const [budget, setBudget] = useState(50000);
  const [duration, setDuration] = useState(5);
  const [style, setStyle] = useState('Balanced');
  const [interest, setInterest] = useState('Beach & Culture');
  const [generating, setGenerating] = useState(false);
  const [recommendations, setRecommendations] = useState(AI_PRESET_RECOMMENDATIONS);

  const handleGenerate = (e) => {
    e.preventDefault();
    setGenerating(true);

    setTimeout(() => {
      const destList = interest.includes('Beach')
        ? ['Mumbai', 'Goa', 'South Goa']
        : interest.includes('Heritage')
        ? ['Jaipur', 'Jodhpur', 'Udaipur']
        : interest.includes('Mountains')
        ? ['Manali', 'Solang Valley', 'Kasol']
        : ['Tokyo', 'Kyoto', 'Osaka'];

      const image = interest.includes('Beach')
        ? 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80'
        : interest.includes('Heritage')
        ? 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80'
        : interest.includes('Mountains')
        ? 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80'
        : 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80';

      const dynamicPlan = {
        id: 'ai-gen-' + Date.now(),
        title: `Custom ${style} ${interest} Experience`,
        tagline: `Optimized ${duration}-Day Journey • Est. ${formatMoney(Math.round(budget * 0.92))}`,
        matchScore: 99,
        destinations: destList,
        durationDays: duration,
        estimatedCost: Math.round(budget * 0.92),
        style: `${style} Vibe`,
        coverImage: image,
        highlights: [
          `Tailored ${duration}-day route traversing ${destList.join(', ')}`,
          `Customized activity pacing for ${style} travel style`,
          `Smart budget allocation target of ${formatMoney(budget)} with local transport & stay`,
        ],
        whyItFits: `Direct match for your selected ${duration}-day timeframe, ${style} travel style, and focus on ${interest}.`,
      };

      setRecommendations([dynamicPlan, ...AI_PRESET_RECOMMENDATIONS]);
      setGenerating(false);
      notifySuccess(`AI synthesized a ${duration}-day itinerary for ${formatMoney(budget)}!`);
    }, 600);
  };

  const handleAdoptAIPlan = (rec) => {
    const newTrip = createTrip({
      title: rec.title,
      description: `${rec.tagline}. ${rec.whyItFits}`,
      coverImage: rec.coverImage,
      startDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 86400000 * (5 + rec.durationDays)).toISOString().split('T')[0],
      budget: rec.estimatedCost,
      travelStyle: rec.style,
      interests: [interest, 'Sightseeing'],
      startingCity: rec.destinations[0],
    });

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {}

    notifySuccess(`Created "${newTrip.title}" from AI recommendation! Opening builder.`);
    navigate(`/trips/${newTrip.id}/itinerary`);
  };

  return (
    <div className="space-y-8 text-left animate-fade-in pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Smart Recommendation Engine
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          AI Multi-City Trip Generator
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Tell us your budget, preferred duration, and travel style — GlobeTrotter AI will curate the ideal multi-city routes and transit plans.
        </p>
      </div>

      {/* AI Wizard Controls */}
      <form onSubmit={handleGenerate} className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-6">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Sliders className="w-4 h-4 text-indigo-600" />
          Customize Travel Preferences
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Budget Slider */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Budget Target: <span className="font-extrabold text-indigo-600">{formatMoney(budget)}</span>
            </label>
            <input
              type="range"
              min="15000"
              max="250000"
              step="5000"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <span className="text-[10px] text-slate-400 font-semibold block mt-1">
              ₹15,000 to ₹2,50,000+
            </span>
          </div>

          {/* Duration Slider */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Duration: <span className="font-extrabold text-indigo-600">{duration} Days</span>
            </label>
            <input
              type="range"
              min="3"
              max="14"
              step="1"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <span className="text-[10px] text-slate-400 font-semibold block mt-1">
              3 to 14 Days
            </span>
          </div>

          {/* Style */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Travel Vibe
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Balanced">Balanced (Comfort & Value)</option>
              <option value="Backpacker">Backpacker (Budget Explorer)</option>
              <option value="Luxury">Luxury & Heritage</option>
              <option value="Solo">Solo Spontaneous</option>
            </select>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Primary Focus
            </label>
            <select
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Beach & Culture">Beach, Seafood & Culture</option>
              <option value="Heritage & Palaces">Heritage, Forts & Palaces</option>
              <option value="Mountains & Hikes">Himalayas & High Passes</option>
              <option value="Modern & Cyberpunk">Futuristic Tech & Gastronomy</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={generating}
            icon={Sparkles}
          >
            Generate AI Multi-City Plans
          </Button>
        </div>
      </form>

      {/* AI Recommendations Cards */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          AI Matched Itineraries
        </h3>

        <div className="grid grid-cols-1 gap-6">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row items-center gap-6"
            >
              {/* Image */}
              <div className="relative w-full lg:w-72 h-48 rounded-2xl overflow-hidden shrink-0">
                <img src={rec.coverImage} alt={rec.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <Badge variant="emerald" className="bg-emerald-500 text-white border-none font-bold">
                    {rec.matchScore}% Match
                  </Badge>
                </div>
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="text-xs font-bold">{rec.durationDays} Days • {rec.style}</p>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{rec.destinations.join(' → ')}</span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 leading-snug">{rec.title}</h4>
                <p className="text-xs text-slate-500 italic">{rec.tagline}</p>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  💡 <strong>Why this fits:</strong> {rec.whyItFits}
                </p>

                {/* Highlights */}
                <div className="space-y-1 pt-1">
                  {rec.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Column */}
              <div className="w-full lg:w-48 shrink-0 flex lg:flex-col items-center justify-between lg:justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100 gap-3">
                <div className="text-left lg:text-center">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Est. Budget</span>
                  <span className="text-base font-extrabold text-slate-900">
                    {formatMoney(rec.estimatedCost)}
                  </span>
                </div>

                <Button
                  size="sm"
                  variant="primary"
                  className="w-full"
                  icon={ArrowRight}
                  onClick={() => handleAdoptAIPlan(rec)}
                >
                  Adopt & Build
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Recommendations;
