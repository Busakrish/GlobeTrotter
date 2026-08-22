import { Link } from 'react-router-dom';
import {
  Compass,
  Heart,
  Sparkles,
  MapPin,
  ShieldCheck,
  Globe,
  Share2,
  Send,
  ExternalLink,
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800/80 mt-auto text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-slate-800">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white font-display">
                GlobeTrotter
              </span>
            </Link>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Empowering personalized multi-city travel planning. Seamlessly arrange city stops, detect schedule overlaps, manage budgets, and explore curated world destinations.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-colors text-slate-400"
                title="Global Network"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-colors text-slate-400"
                title="Community Share"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-colors text-slate-400"
                title="Newsletter"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Discover */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <Link to="/explore" className="hover:text-white transition-colors">
                  All Destinations
                </Link>
              </li>
              <li>
                <Link to="/search/cities" className="hover:text-white transition-colors">
                  City Catalog
                </Link>
              </li>
              <li>
                <Link to="/search/activities" className="hover:text-white transition-colors">
                  Tours & Activities
                </Link>
              </li>
              <li>
                <Link to="/community" className="hover:text-white transition-colors">
                  Community Itineraries
                </Link>
              </li>
              <li>
                <Link to="/saved" className="hover:text-white transition-colors">
                  Saved Places
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Trip Tools */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              Trip Tools
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <Link to="/trips/create" className="hover:text-white transition-colors">
                  Plan Multi-City Trip
                </Link>
              </li>
              <li>
                <Link to="/recommendations" className="hover:text-white transition-colors">
                  AI Trip Matcher
                </Link>
              </li>
              <li>
                <Link to="/packing-list" className="hover:text-white transition-colors">
                  Packing Assistant
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-white transition-colors">
                  Traveler Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform & Support */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">
              GlobeTrotter
            </h4>
            <ul className="space-y-2 font-medium">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us & Mission
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-white transition-colors">
                  Traveler Profile
                </Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-white transition-colors">
                  Settings & Currency
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">
                  Admin Telemetry
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} GlobeTrotter Inc. Built with Google Stitch aesthetics.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-slate-400">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link to="/about" className="hover:text-slate-400">
              Terms of Service
            </Link>
            <span>•</span>
            <span className="text-emerald-500 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
