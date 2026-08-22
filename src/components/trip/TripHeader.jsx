import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  MapPin,
  Clock,
  DollarSign,
  Share2,
  Edit3,
  Compass,
  ArrowLeft,
  CheckSquare,
  Package,
  Layers,
  PieChart,
  FileText,
} from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import ShareModal from './ShareModal';

export function TripHeader({ trip, activeTab = 'overview' }) {
  const { formatMoney } = useAuth();
  const navigate = useNavigate();
  const [shareModalOpen, setShareModalOpen] = useState(false);

  if (!trip) return null;

  const tabs = [
    { key: 'overview', label: 'Overview', path: `/trips/${trip.id || trip._id}`, icon: Layers },
    { key: 'itinerary', label: 'Day-by-Day Schedule', path: `/trips/${trip.id || trip._id}/itinerary`, icon: Compass },
    { key: 'calendar', label: 'Timeline / Calendar', path: `/trips/${trip.id || trip._id}/calendar`, icon: Calendar },
    { key: 'budget', label: 'Budget & Charts', path: `/trips/${trip.id || trip._id}/budget`, icon: PieChart },
    { key: 'checklist', label: 'Checklist', path: `/trips/${trip.id || trip._id}/checklist`, icon: CheckSquare },
    { key: 'packing', label: 'Packing List', path: `/trips/${trip.id || trip._id}/packing`, icon: Package },
    { key: 'documents', label: 'Document Vault', path: `/trips/${trip.id || trip._id}/documents`, icon: FileText },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Top back & action bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/trips"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Trips
        </Link>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={Share2}
            onClick={() => setShareModalOpen(true)}
          >
            Share
          </Button>

          <Button
            size="sm"
            variant="outline"
            icon={Edit3}
            to={`/trips/${trip.id}/edit`}
          >
            Edit Trip
          </Button>
        </div>
      </div>

      {/* Hero Banner Card */}
      <div className="rounded-3xl bg-slate-900 text-white overflow-hidden relative shadow-md">
        <img
          src={trip.coverImage}
          alt={trip.title}
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-between min-h-[220px]">
          {/* Top Status Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="indigo" className="bg-indigo-600 text-white font-bold border-none">
                {trip.status || 'Upcoming'}
              </Badge>
              <span className="text-xs text-slate-300 font-medium">
                {trip.travelStyle || 'Balanced Explorer'}
              </span>
            </div>

            {trip.isPublic && (
              <Badge variant="emerald" className="bg-emerald-500 text-white font-bold border-none">
                Public Itinerary
              </Badge>
            )}
          </div>

          {/* Bottom Title & Summary */}
          <div className="space-y-2 mt-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-300">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span>
                {trip.cities?.map((c) => c.name).join(' → ') || 'Multi-City Route'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight drop-shadow-xs">
              {trip.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {trip.startDate} to {trip.endDate}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-bold text-sky-300">
                <Clock className="w-3.5 h-3.5" />
                {trip.durationDays} Days
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 font-bold text-emerald-300">
                <DollarSign className="w-3.5 h-3.5" />
                Budget: {formatMoney(trip.budget)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <Link
                key={tab.key}
                to={tab.path}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        trip={trip}
      />
    </div>
  );
}

export default TripHeader;
