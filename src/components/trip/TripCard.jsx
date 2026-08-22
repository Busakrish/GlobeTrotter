import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTrips } from '../../context/TripContext';
import { useNotification } from '../../context/NotificationContext';
import {
  Calendar,
  MapPin,
  Clock,
  MoreVertical,
  Trash2,
  Copy,
  Edit3,
  Users,
  Eye,
} from 'lucide-react';
import Badge from '../common/Badge';

const TOP_BORDER_COLORS = [
  'border-t-[#714B67]', // Primary Deep Plum
  'border-t-[#2AB79B]', // Teal
  'border-t-[#F16E62]', // Coral
  'border-t-[#3E8EDE]', // Blue
  'border-t-[#F0A63F]', // Yellow
];

export function TripCard({ trip, onDuplicate, onDelete, index = 0 }) {
  const { formatMoney } = useAuth();
  const { duplicateTrip, deleteTrip, calculateTripBudgetSummary, setActiveTripId } = useTrips();
  const { notifySuccess } = useNotification();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  const budgetSummary = calculateTripBudgetSummary(trip);
  const borderTopClass = TOP_BORDER_COLORS[index % TOP_BORDER_COLORS.length];

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDuplicate = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (onDuplicate) {
      onDuplicate();
    } else {
      const cloned = duplicateTrip(trip.id);
      if (cloned) {
        notifySuccess(`Duplicated "${trip.title}"`);
        navigate(`/trips/${cloned.id}`);
      }
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setMenuOpen(false);
    if (onDelete) {
      onDelete();
    } else {
      if (window.confirm(`Are you sure you want to delete "${trip.title}"?`)) {
        deleteTrip(trip.id);
        notifySuccess(`Deleted trip "${trip.title}"`);
      }
    }
  };

  const statusVariant = {
    Upcoming: 'emerald',
    Planning: 'sky',
    Ongoing: 'indigo',
    Completed: 'slate',
  }[trip.status] || 'indigo';

  return (
    <div className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-slate-200/90 border-t-4 ${borderTopClass} shadow-xs card-hover-lift text-left`}>
      {/* Cover Image & Header Badges */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        <img
          src={trip.coverImage}
          alt={trip.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between">
          <Badge variant={statusVariant} className="backdrop-blur-md bg-white/95 shadow-2xs font-bold text-[#1B1B26] rounded-[4px]">
            {trip.status || 'Upcoming'}
          </Badge>

          {/* Action dropdown button */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:bg-white shadow-2xs transition-colors cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-1.5 w-44 rounded-[6px] bg-white p-1.5 shadow-xl border border-slate-200 z-30 animate-scale-in text-xs font-medium space-y-0.5">
                <Link
                  to={`/trips/${trip.id}`}
                  onClick={() => {
                    setActiveTripId(trip.id);
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-[#714B67] rounded-[4px]"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  View Trip
                </Link>

                <Link
                  to={`/trips/${trip.id}/edit`}
                  onClick={() => {
                    setActiveTripId(trip.id);
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-[#714B67] rounded-[4px]"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                  Edit Details
                </Link>

                <button
                  type="button"
                  onClick={handleDuplicate}
                  className="flex items-center gap-2 w-full px-3 py-2 text-slate-700 hover:bg-slate-50 hover:text-[#714B67] rounded-[4px] cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  Duplicate Trip
                </button>

                <div className="my-1 border-t border-slate-100" />

                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex items-center gap-2 w-full px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-[4px] font-semibold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                  Delete Trip
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Destination Title on Image */}
        <div className="absolute bottom-3 inset-x-3 text-white">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-200 mb-0.5">
            <MapPin className="w-3.5 h-3.5 text-sky-300 shrink-0" />
            <span className="truncate">
              {trip.cities?.map((c) => c.name).join(' → ') || 'Multi-City Itinerary'}
            </span>
          </div>
          <h3 className="text-base font-bold leading-snug line-clamp-1 drop-shadow-sm font-display text-white">
            {trip.title}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-5 justify-between">
        <div>
          {/* Dates, Duration & Travelers */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {trip.startDate} - {trip.endDate}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <Clock className="w-3.5 h-3.5 text-[#714B67]" />
                {trip.durationDays}D
              </span>
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <Users className="w-3.5 h-3.5 text-sky-600" />
                {trip.travelersCount || 2}
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-[#1B1B26]/80 line-clamp-2 leading-relaxed mb-4">
            {trip.description}
          </p>

          {/* Budget Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-[11px] font-semibold mb-1">
              <span className="text-slate-500">Budget Progress</span>
              <span className={budgetSummary.status === 'over' ? 'text-rose-600 font-bold' : 'text-[#1B1B26] font-bold'}>
                {formatMoney(budgetSummary.totalSpent)} / {formatMoney(trip.budget)}
              </span>
            </div>
            <div className="w-full bg-[#F1F1F3] h-2 rounded-[4px] overflow-hidden">
              <div
                className={`h-full rounded-[4px] transition-all duration-300 ${
                  budgetSummary.status === 'over'
                    ? 'bg-rose-500'
                    : budgetSummary.percentageUsed > 85
                    ? 'bg-[#F0A63F]'
                    : 'bg-[#2AB79B]'
                }`}
                style={{ width: `${Math.min(100, budgetSummary.percentageUsed)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <Link
            to={`/trips/${trip.id}`}
            onClick={() => setActiveTripId(trip.id)}
            className="flex-1 py-2 px-3 text-center text-xs font-bold text-[#1B1B26] hover:text-black bg-[#F1F1F3] hover:bg-[#e5e5e8] rounded-[6px] transition-colors border border-slate-200"
          >
            View Trip
          </Link>
          <Link
            to={`/trips/${trip.id}/itinerary`}
            onClick={() => setActiveTripId(trip.id)}
            className="flex-1 py-2 px-3 text-center text-xs font-bold text-white bg-[#714B67] hover:bg-[#5e3c55] rounded-[6px] transition-colors shadow-2xs"
          >
            Build Plan
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TripCard;
