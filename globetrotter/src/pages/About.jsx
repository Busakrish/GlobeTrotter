import { Link } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import Button from '../components/common/Button';
import {
  Compass,
  Sparkles,
  ShieldCheck,
  Zap,
  PieChart,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  Code2,
  CheckCircle2,
} from 'lucide-react';

export function About() {
  const features = [
    {
      icon: Compass,
      title: 'Multi-City Stop Reordering',
      desc: 'Seamlessly chain multiple city destinations together. Automatically calculates train and flight transit durations and updates daily schedule slots.',
    },
    {
      icon: Zap,
      title: 'Intelligent Conflict Engine',
      desc: 'Real-time schedule evaluator detects when planned activities start before transit arrival, offering 1-click safe auto-resolution.',
    },
    {
      icon: PieChart,
      title: 'Dynamic Budget Allocation',
      desc: 'Interactive Recharts donut and bar visualizations track spending across Stays, Transport, Dining, and Tours with Under/Near/Over budget alerts.',
    },
    {
      icon: Users,
      title: '1-Click Community Forking',
      desc: 'Discover and clone verified multi-city routes crafted by fellow travelers into your account with celebratory animations.',
    },
  ];

  const faqs = [
    {
      q: 'How does GlobeTrotter handle multi-city travel schedules?',
      a: 'Unlike traditional single-destination apps, GlobeTrotter structures journeys into ordered city stops with transit segments between them. When you change nights or reorder cities, all day schedules automatically adjust.',
    },
    {
      q: 'What is Schedule Conflict Detection?',
      a: 'If you schedule a tour or dinner at 2:00 PM in a new city, but your train or flight arrives at 3:30 PM, GlobeTrotter flags the overlap and lets you resolve it with 1 click.',
    },
    {
      q: 'Is my itinerary data saved?',
      a: 'Yes, all trips, expenses, custom activities, saved wishlist destinations, and packing lists are automatically persisted in your local browser storage.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-left">
      {/* Hero */}
      <section className="bg-slate-950 text-white py-16 lg:py-24 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-xs font-bold text-indigo-300 border border-indigo-400/30">
            <Compass className="w-4 h-4 text-indigo-400" />
            About GlobeTrotter
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display leading-tight">
            Empowering Personalized <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400">
              Multi-City Travel Planning
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Planning multi-destination vacations is complex. We built GlobeTrotter to turn chaotic spreadsheets into fluid, visually stunning itineraries with intelligent conflict resolution.
          </p>
        </div>
      </section>

      {/* Mission & Problem Statement */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 space-y-12">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            The Problem We Are Solving
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Most modern travel apps treat vacations as static single-city bookings. But real travelers explore multiple destinations in a single vacation (e.g., Mumbai to Goa, or Tokyo to Kyoto). Multi-city planning involves transit connectors, arrival bottlenecks, overlapping activity schedules, and distributed budgets.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            GlobeTrotter bridges this gap by unifying route mapping, day-by-day scheduling, conflict detection, and dynamic financial charts into a cohesive Stitch-inspired interface.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 text-center">
            Key Architecture & Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-3"
                >
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-2"
              >
                <h4 className="text-sm font-bold text-slate-900">{faq.q}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="p-8 sm:p-10 rounded-3xl bg-indigo-600 text-white text-center space-y-4 shadow-lg">
          <h3 className="text-xl sm:text-2xl font-extrabold">Ready to start planning your next journey?</h3>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-lg mx-auto leading-relaxed">
            Create your personalized multi-city itinerary now with our interactive builder.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link to="/trips/create">
              <Button size="lg" variant="secondary" className="bg-white text-indigo-950 hover:bg-slate-100 font-bold" iconRight={ArrowRight}>
                Plan Trip Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default About;
