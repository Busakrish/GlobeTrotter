import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTrips } from '../../context/TripContext';
import { useNotification } from '../../context/NotificationContext';
import { Star, Heart, MapPin, Plus, Calendar } from 'lucide-react';
import Button from '../common/Button';

const TOP_BORDER_COLORS = [
  'border-t-[#F16E62]', // Coral
  'border-t-[#2AB79B]', // Teal
  'border-t-[#F0A63F]', // Yellow
  'border-t-[#3E8EDE]', // Blue
];

export function DestinationCard({ destination, onAddToTrip, index = 0 }) {
  const { formatMoney } = useAuth();
  const { isSaved, toggleSavePlace } = useTrips();
  const { notifySuccess } = useNotification();

  const saved = isSaved(destination.id);
  const borderTopClass = TOP_BORDER_COLORS[index % TOP_BORDER_COLORS.length];

  const handleToggleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSavePlace(destination);
    if (!saved) {
      notifySuccess(`Saved ${destination.name} to your Wishlist!`);
    } else {
      notifySuccess(`Removed ${destination.name} from saved places.`);
    }
  };

  return (
    <div className={`group flex flex-col justify-between overflow-hidden rounded-[6px] bg-white border border-slate-200 border-t-4 ${borderTopClass} shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.1)] transition-all card-hover text-left`}>
      <div>
        {/* Destination Image Banner */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          <img
            src={destination.image}
            alt={destination.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-black/20" />

          {/* Top Badges: Cost Tier & Save Heart */}
          <div className="absolute top-3 inset-x-3 flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-[4px] text-[11px] font-bold bg-white/95 backdrop-blur-md text-[#1B1B26] shadow-2xs">
              {destination.costIndex} Tier
            </span>

            <button
              type="button"
              onClick={handleToggleSave}
              className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                saved
                  ? 'bg-[#F16E62] text-white shadow-sm scale-110'
                  : 'bg-white/80 text-slate-700 hover:bg-white hover:text-[#F16E62]'
              }`}
              title={saved ? 'Remove from Saved' : 'Save to Wishlist'}
            >
              <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Bottom Title & Rating */}
          <div className="absolute bottom-3 inset-x-3 flex items-end justify-between text-white">
            <div>
              <div className="flex items-center gap-1 text-xs text-sky-200 font-semibold mb-0.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>
                  {destination.region ? `${destination.region}, ` : ''}
                  {destination.country}
                </span>
              </div>
              <h3 className="text-xl font-bold leading-tight drop-shadow-sm text-white">
                {destination.name}
              </h3>
            </div>

            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-xs font-bold bg-[#F0A63F] text-slate-950 shadow-2xs shrink-0">
              <Star className="w-3 h-3 fill-current" />
              {destination.rating}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5">
          <p className="text-xs text-[#1B1B26]/80 line-clamp-2 leading-relaxed mb-3">
            {destination.shortDescription || destination.description}
          </p>

          {/* Best travel season */}
          {destination.bestMonths && (
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Best: <strong className="text-[#1B1B26] font-semibold">{destination.bestMonths.join(', ')}</strong>
              </span>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {destination.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-[4px] bg-[#F1F1F3] text-[#1B1B26]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-3 mt-auto">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Daily</span>
          <span className="text-sm font-extrabold text-[#1B1B26]">
            {formatMoney(destination.avgDailyCost)}{' '}
            <span className="text-xs font-normal text-slate-500">/ day</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link to={`/explore/${destination.id}`}>
            <Button size="xs" variant="secondary" className="text-xs">
              Details
            </Button>
          </Link>

          <Button
            size="xs"
            variant="primary"
            icon={Plus}
            onClick={() => onAddToTrip && onAddToTrip(destination)}
          >
            Add to Trip
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DestinationCard;
