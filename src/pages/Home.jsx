import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { destinationsApi } from '../services/api';
import { mockDestinations } from '../data/mockDestinations';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import DestinationCard from '../components/destination/DestinationCard';
import Button from '../components/common/Button';
import Footer from '../components/layout/Footer';
import Modal from '../components/common/Modal';
import Navbar from '../components/layout/Navbar';
import {
  Compass,
  Search,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Heart,
  Users,
  CheckCircle2,
  PieChart,
  Plus,
  Map,
  DollarSign,
  Share2,
} from 'lucide-react';

export function Home() {
  const { currentUser } = useAuth();
  const { trips, addCityToTrip } = useTrips();
  const navigate = useNavigate();

  const [destinations, setDestinations] = useState(mockDestinations);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Add to trip modal state
  const [targetDestModal, setTargetDestModal] = useState(null);
  const [selectedTripId, setSelectedTripId] = useState(trips[0]?.id || '');
  const [nights, setNights] = useState(2);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await destinationsApi.getDestinations();
        if (res?.success && res.destinations?.length) {
          setDestinations(res.destinations);
        }
      } catch (e) {}
    };
    fetchDestinations();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/explore?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleAddStopSubmit = (e) => {
    e.preventDefault();
    if (!targetDestModal || !selectedTripId) return;

    addCityToTrip(selectedTripId, {
      id: targetDestModal.id,
      name: targetDestModal.name,
      country: targetDestModal.country,
      coordinates: targetDestModal.coordinates,
      nights: Number(nights),
    });

    setTargetDestModal(null);
    navigate(`/trips/${selectedTripId}/itinerary`);
  };

  const categoryPills = [
    { key: 'all', label: 'All Places' },
    { key: 'beach', label: '🏖️ Beaches' },
    { key: 'historical', label: '🏰 Palaces & Heritage' },
    { key: 'mountain', label: '🏔️ Mountains & Treks' },
    { key: 'city', label: '🏙️ Vibrant Cities' },
  ];

  const displayedDestinations = selectedCategory === 'all'
    ? destinations.slice(0, 6)
    : destinations.filter((d) => d.category === selectedCategory || d.secondaryCategories?.includes(selectedCategory)).slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F1F3] text-left">
      {/* Top Navbar */}
      <Navbar />

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-[#1B1B26] text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=2000&q=80"
            alt="World Travel"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1B1B26] via-[#1B1B26]/85 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#714B67]/40 backdrop-blur-md border border-[#714B67]/60 text-xs font-bold text-pink-200">
            <Sparkles className="w-4 h-4 text-[#F0A63F]" />
            Your Intelligent Multi-City Travel Platform
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight font-display">
            Plan journeys that feel like <br className="hidden sm:inline" />
            they were <span className="marker-underline-coral text-[#F16E62]">made for you.</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Personalize multi-city routes, build day-by-day itineraries, track expenses dynamically, and explore hand-picked global destinations without the chaos.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button to="/trips/create" size="lg" variant="primary" className="shadow-lg" icon={Plus}>
              Start Planning
            </Button>
            <Button to="/explore" size="lg" variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-white/20" iconRight={ArrowRight}>
              Explore Destinations
            </Button>
          </div>

          {/* Hero Search Box */}
          <div className="pt-6 max-w-3xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="p-2 rounded-[6px] bg-white/95 backdrop-blur-md shadow-2xl border border-white/20 flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="flex-1 flex items-center gap-3 px-3 w-full">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Where do you want to travel? (Goa, Jaipur, Mumbai, Paris, Tokyo...)"
                  className="w-full text-xs sm:text-sm font-medium text-[#1B1B26] bg-transparent placeholder:text-slate-400 focus:outline-none py-2"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  type="submit"
                  size="md"
                  variant="primary"
                  className="w-full sm:w-auto whitespace-nowrap"
                  iconRight={ArrowRight}
                >
                  Search
                </Button>
              </div>
            </form>

            {/* Category quick buttons */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto pt-4 scrollbar-none">
              {categoryPills.map((pill) => (
                <button
                  key={pill.key}
                  type="button"
                  onClick={() => setSelectedCategory(pill.key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedCategory === pill.key
                      ? 'bg-[#714B67] text-white shadow-xs'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 200 Cr Enterprise Metrics Banner */}
      <section className="bg-white border-y border-slate-200/80 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-slate-50 border border-indigo-100/80">
            <div className="text-2xl sm:text-4xl font-extrabold text-[#714B67] tracking-tight">₹200Cr+</div>
            <div className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider mt-1">Managed Travel Budgets</div>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/50 to-slate-50 border border-emerald-100/80">
            <div className="text-2xl sm:text-4xl font-extrabold text-emerald-600 tracking-tight">1.2M+</div>
            <div className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider mt-1">Active Global Travelers</div>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50/50 to-slate-50 border border-sky-100/80">
            <div className="text-2xl sm:text-4xl font-extrabold text-sky-600 tracking-tight">180+</div>
            <div className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider mt-1">Countries & Destinations</div>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/50 to-slate-50 border border-amber-100/80">
            <div className="text-2xl sm:text-4xl font-extrabold text-amber-600 tracking-tight">99.4%</div>
            <div className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider mt-1">Traveler Satisfaction</div>
          </div>
        </div>
      </section>

      {/* 2. Key Product Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#714B67] uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            Core Capabilities
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B26] tracking-tight">
            Everything You Need to Plan Seamless Trips
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            From discovering hidden gems to keeping your budget strictly on track.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-[6px] bg-white border border-slate-200 border-t-4 border-t-[#714B67] shadow-[0_2px_8px_rgba(0,0,0,0.06)] space-y-3">
            <div className="w-10 h-10 rounded-[6px] bg-[#714B67]/10 text-[#714B67] flex items-center justify-center font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1B1B26]">Personalized Trip Planning</h3>
            <p className="text-xs text-[#1B1B26]/75 leading-relaxed">
              Create journeys customized to your travel style, pace, dietary preferences, and traveler count with intuitive wizards.
            </p>
          </div>

          <div className="p-6 rounded-[6px] bg-white border border-slate-200 border-t-4 border-t-[#2AB79B] shadow-[0_2px_8px_rgba(0,0,0,0.06)] space-y-3">
            <div className="w-10 h-10 rounded-[6px] bg-[#2AB79B]/10 text-[#2AB79B] flex items-center justify-center font-bold">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1B1B26]">Smart Itineraries</h3>
            <p className="text-xs text-[#1B1B26]/75 leading-relaxed">
              Organize morning, afternoon, and evening activities with conflict detection and automated duration calculations.
            </p>
          </div>

          <div className="p-6 rounded-[6px] bg-white border border-slate-200 border-t-4 border-t-[#F0A63F] shadow-[0_2px_8px_rgba(0,0,0,0.06)] space-y-3">
            <div className="w-10 h-10 rounded-[6px] bg-[#F0A63F]/10 text-[#F0A63F] flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1B1B26]">Destination Discovery</h3>
            <p className="text-xs text-[#1B1B26]/75 leading-relaxed">
              Explore curated world cities, daily cost benchmarks, top attractions, and local dining tips before booking.
            </p>
          </div>

          <div className="p-6 rounded-[6px] bg-white border border-slate-200 border-t-4 border-t-[#F16E62] shadow-[0_2px_8px_rgba(0,0,0,0.06)] space-y-3">
            <div className="w-10 h-10 rounded-[6px] bg-[#F16E62]/10 text-[#F16E62] flex items-center justify-center font-bold">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1B1B26]">Budget & Expense Management</h3>
            <p className="text-xs text-[#1B1B26]/75 leading-relaxed">
              Log expenses by category (Stays, Dining, Transit, Activities) and visualize live charts with health status indicators.
            </p>
          </div>

          <div className="p-6 rounded-[6px] bg-white border border-slate-200 border-t-4 border-t-[#3E8EDE] shadow-[0_2px_8px_rgba(0,0,0,0.06)] space-y-3">
            <div className="w-10 h-10 rounded-[6px] bg-[#3E8EDE]/10 text-[#3E8EDE] flex items-center justify-center font-bold">
              <Map className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1B1B26]">Interactive Maps</h3>
            <p className="text-xs text-[#1B1B26]/75 leading-relaxed">
              View city stops and itinerary locations on interactive Leaflet maps with coordinated GPS points.
            </p>
          </div>

          <div className="p-6 rounded-[6px] bg-white border border-slate-200 border-t-4 border-t-[#714B67] shadow-[0_2px_8px_rgba(0,0,0,0.06)] space-y-3">
            <div className="w-10 h-10 rounded-[6px] bg-[#714B67]/10 text-[#714B67] flex items-center justify-center font-bold">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#1B1B26]">Collaborative Planning</h3>
            <p className="text-xs text-[#1B1B26]/75 leading-relaxed">
              Invite friends and family to your trip with email invites, shared access, and multi-user itinerary editing.
            </p>
          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className="py-14 bg-white border-y border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10 text-center">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2AB79B] uppercase tracking-wider mb-1">
              <Zap className="w-3.5 h-3.5" />
              Simple 6-Step Workflow
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B26] tracking-tight">
              How GlobeTrotter Works
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-left">
            {[
              { step: '01', title: 'Choose Destination', desc: 'Pick your dream places from our curated catalog.' },
              { step: '02', title: 'Create Trip', desc: 'Set dates, travelers count, and budget allocations.' },
              { step: '03', title: 'Build Itinerary', desc: 'Organize day stops and transit connections.' },
              { step: '04', title: 'Add Activities', desc: 'Schedule sights, dining, and walking tours.' },
              { step: '05', title: 'Track Budget', desc: 'Monitor live spending by category.' },
              { step: '06', title: 'Travel Confidently', desc: 'Access packing lists and offline plans anywhere.' },
            ].map((s, idx) => (
              <div key={s.step} className="p-4 rounded-[6px] bg-[#F1F1F3] border border-slate-200 space-y-2">
                <span className="text-xs font-black text-[#714B67] block">{s.step}</span>
                <h4 className="text-xs font-bold text-[#1B1B26] leading-snug">{s.title}</h4>
                <p className="text-[11px] text-slate-500 leading-normal">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Destinations Showcase */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#714B67] uppercase tracking-wider mb-1">
              <MapPin className="w-3.5 h-3.5" />
              Curated World Catalog
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B26] tracking-tight">
              Top Travel Destinations
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Explore daily budgets, heritage landmarks, and authentic dining spots.
            </p>
          </div>

          <Link to="/explore">
            <Button variant="secondary" size="sm" iconRight={ArrowRight}>
              View All Destinations ({destinations.length})
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedDestinations.map((dest, i) => (
            <DestinationCard
              key={dest.id || dest._id}
              destination={dest}
              index={i}
              onAddToTrip={(d) => setTargetDestModal(d)}
            />
          ))}
        </div>
      </section>

      {/* 5. Final CTA Banner */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-[6px] bg-[#714B67] p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8 text-left">
          <div className="max-w-xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-bold text-pink-200">
              <Sparkles className="w-3.5 h-3.5 text-[#F0A63F]" />
              Start Your Next Chapter
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight text-white font-display">
              Ready to create your next dream journey?
            </h3>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Join thousands of travelers planning multi-city adventures with intelligent schedules, real-time budgets, and collaborative itineraries.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/trips/create">
              <Button size="lg" variant="secondary" className="bg-white text-[#1B1B26] hover:bg-slate-100 font-bold" icon={Plus}>
                Create Your Trip
              </Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white/40 hover:bg-white/10 font-bold">
                Sign Up Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Add Destination To Trip Modal */}
      {targetDestModal && (
        <Modal
          isOpen={!!targetDestModal}
          onClose={() => setTargetDestModal(null)}
          title={`Add ${targetDestModal.name} to Itinerary`}
          subtitle="Select which itinerary you want to expand with this stop"
        >
          <form onSubmit={handleAddStopSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Trip Itinerary
              </label>
              <select
                value={selectedTripId}
                onChange={(e) => setSelectedTripId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-[6px] border border-slate-300 bg-white text-xs font-semibold text-[#1B1B26] focus:outline-none focus:ring-2 focus:ring-[#714B67]"
              >
                {trips.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.durationDays} Days)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Nights to Stay in {targetDestModal.name}
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={nights}
                onChange={(e) => setNights(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-[6px] border border-slate-300 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#714B67]"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" size="sm" onClick={() => setTargetDestModal(null)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" type="submit" icon={Plus}>
                Add Stop & Open Builder
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;
