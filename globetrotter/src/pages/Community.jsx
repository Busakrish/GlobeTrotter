import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mockCommunityTrips } from '../data/mockCommunity';
import { useTrips } from '../context/TripContext';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import {
  Users,
  Search,
  Heart,
  Copy,
  MapPin,
  Clock,
  Sparkles,
  ExternalLink,
  Star,
  Share2,
} from 'lucide-react';

export function Community() {
  const { forkCommunityTrip } = useTrips();
  const { formatMoney } = useAuth();
  const { notifySuccess } = useNotification();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [likesMap, setLikesMap] = useState({});

  const toggleLike = (id, initialLikes) => {
    setLikesMap((prev) => {
      const current = prev[id] !== undefined ? prev[id] : initialLikes;
      const isLiked = prev[`${id}_liked`];
      return {
        ...prev,
        [id]: isLiked ? current - 1 : current + 1,
        [`${id}_liked`]: !isLiked,
      };
    });
  };

  const handleCopyTrip = (commTrip) => {
    const cloned = forkCommunityTrip(commTrip);
    notifySuccess(`Cloned "${commTrip.title}" to your My Trips! Opening builder.`);
    navigate(`/trips/${cloned.id}/itinerary`);
  };

  const filteredTrips = useMemo(() => {
    return mockCommunityTrips.filter((trip) => {
      if (selectedTag !== 'all' && !trip.tags?.includes(selectedTag)) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = trip.title.toLowerCase().includes(q);
        const matchDesc = trip.description.toLowerCase().includes(q);
        const matchAuthor = trip.author.name.toLowerCase().includes(q);
        const matchDest = trip.destinations?.some((d) => d.toLowerCase().includes(q));
        return matchTitle || matchDesc || matchAuthor || matchDest;
      }
      return true;
    });
  }, [searchQuery, selectedTag]);

  const allTags = ['all', 'Backpacker', 'Beach', 'Heritage', 'Luxury', 'Futuristic', 'Romantic', 'Adventure', 'Tropical'];

  return (
    <div className="space-y-8 text-left animate-fade-in pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100 mb-2">
          <Users className="w-3.5 h-3.5" />
          Global Travel Community
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Explore Community Itineraries
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Discover verified multi-city itineraries created by fellow globetrotters. Read their tips or copy the entire route into your account with 1 click.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search community itineraries by destination (Mumbai, Goa, Tokyo, Paris) or author..."
            className="w-full pl-12 pr-4 py-3 text-sm font-medium rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Tags */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
                selectedTag === tag
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tag === 'all' ? 'All Itineraries' : tag}
            </button>
          ))}
        </div>
      </div>

      {/* Community Grid */}
      {filteredTrips.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrips.map((trip) => {
            const likes = likesMap[trip.id] !== undefined ? likesMap[trip.id] : trip.likesCount;
            const isLiked = likesMap[`${trip.id}_liked`];

            return (
              <div
                key={trip.id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all card-hover"
              >
                <div>
                  {/* Cover */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={trip.coverImage}
                      alt={trip.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                    {/* Author badge top */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-slate-950/70 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-xs">
                        <img
                          src={trip.author.avatar}
                          alt={trip.author.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="font-bold text-[11px]">{trip.author.name}</span>
                      </div>

                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-xs">
                        <Star className="w-3 h-3 fill-current" />
                        {trip.rating}
                      </span>
                    </div>

                    <div className="absolute bottom-3 inset-x-3 text-white">
                      <div className="flex items-center gap-1.5 text-xs text-indigo-300 font-semibold mb-0.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{trip.destinations.join(' → ')}</span>
                      </div>
                      <h3 className="text-base font-bold line-clamp-1">{trip.title}</h3>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {trip.description}
                    </p>

                    {/* Stats row */}
                    <div className="flex items-center justify-between text-xs text-slate-500 pb-3 border-b border-slate-100 mb-3">
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        {trip.durationDays} Days
                      </span>
                      <span className="font-bold text-slate-900">
                        Budget: {formatMoney(trip.budget)}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {trip.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                  {/* Like button */}
                  <button
                    type="button"
                    onClick={() => toggleLike(trip.id, trip.likesCount)}
                    className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-xl border transition-colors ${
                      isLiked
                        ? 'bg-rose-50 border-rose-200 text-rose-600'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                    <span>{likes}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/trip/${trip.id}`}
                      className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                    >
                      View
                    </Link>

                    <Button
                      size="sm"
                      variant="primary"
                      icon={Copy}
                      onClick={() => handleCopyTrip(trip)}
                    >
                      Copy Trip
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No itineraries found"
          description="Try removing your search query or selecting another vibe tag."
          actionText="Reset Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedTag('all');
          }}
        />
      )}
    </div>
  );
}

export default Community;
