import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Plus,
  Search,
  MapPin,
  Calendar,
  Camera,
  ArrowRight,
  BookOpen,
} from 'lucide-react';
import { useGroupJournal } from '../context/GroupJournalContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import CreateGroupModal from '../components/journal/CreateGroupModal';

export function GroupJournals() {
  const { groupTrips, createGroupTrip, loading } = useGroupJournal();
  const { currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Filter groups
  const filteredGroups = (groupTrips || []).filter((g) => {
    const q = searchQuery.toLowerCase();
    return (
      g.name?.toLowerCase().includes(q) ||
      g.title?.toLowerCase().includes(q) ||
      g.destination?.toLowerCase().includes(q)
    );
  });

  const totalGroups = (groupTrips || []).length;
  const totalMemories = (groupTrips || []).reduce((sum, g) => sum + (g.memoriesCount || 0), 0);
  const totalPhotos = (groupTrips || []).reduce((sum, g) => sum + (g.photosCount || 0), 0);

  const currentUserId = (currentUser?.id || currentUser?._id || '').toString();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left animate-fade-in">
      {/* 1. Header & Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#714B67] uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            Collaborative Memory Space
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1B1B26] tracking-tight font-display">
            Group Trip Journals 📖
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Shared travel scrapbooks for you and your friends. Upload photos, capture stories, and relive every journey together.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => setCreateModalOpen(true)}
          >
            Create Trip Group
          </Button>
        </div>
      </div>

      {/* 2. Key Metrics Snapshot Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-5 rounded-[6px] bg-white border border-slate-200 border-t-4 border-t-[#714B67] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Trip Groups
            </span>
            <div className="w-8 h-8 rounded-[4px] bg-[#714B67]/10 text-[#714B67] flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#1B1B26]">{totalGroups}</p>
          <p className="text-[11px] text-[#2AB79B] font-semibold mt-1">Active shared spaces</p>
        </div>

        <div className="p-5 rounded-[6px] bg-white border border-slate-200 border-t-4 border-t-[#3E8EDE] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Shared Memories
            </span>
            <div className="w-8 h-8 rounded-[4px] bg-[#3E8EDE]/10 text-[#3E8EDE] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#1B1B26]">{totalMemories}</p>
          <p className="text-[11px] text-slate-500 font-medium mt-1">Chronological posts logged</p>
        </div>

        <div className="p-5 rounded-[6px] bg-white border border-slate-200 border-t-4 border-t-[#F0A63F] shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Photos Uploaded
            </span>
            <div className="w-8 h-8 rounded-[4px] bg-[#F0A63F]/15 text-[#F0A63F] flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#1B1B26]">{totalPhotos}</p>
          <p className="text-[11px] text-[#2AB79B] font-semibold mt-1">Shared gallery album</p>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search groups by name or destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#714B67]/20 focus:border-[#714B67]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <span>Showing <strong>{filteredGroups.length}</strong> group journals</span>
        </div>
      </div>

      {/* 4. Group Trips Grid */}
      {filteredGroups.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-2xs">
          <div className="w-16 h-16 rounded-2xl bg-[#714B67]/10 text-[#714B67] flex items-center justify-center mx-auto">
            <Users className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-base font-bold text-slate-900">No group trip journals found</h3>
            <p className="text-xs text-slate-500">
              {searchQuery
                ? `No group journals matched "${searchQuery}". Try a different search term.`
                : 'Create a collaborative group journal to start sharing photos and stories with fellow travelers!'}
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setCreateModalOpen(true)}
          >
            Create Your First Group Journal
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => {
            const isCreator = (group.creatorId || '').toString() === currentUserId;
            const members = group.members || [];
            const displayMembers = members.slice(0, 4);
            const extraCount = members.length - displayMembers.length;

            return (
              <div
                key={group.id || group._id}
                className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs card-hover-lift flex flex-col justify-between group text-left"
              >
                <div>
                  {/* Card Cover Photo */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
                    <img
                      src={group.coverImage}
                      alt={group.title || group.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/90 backdrop-blur-md text-[#714B67] shadow-xs">
                        {group.destination}
                      </span>
                      {isCreator && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#714B67] text-white shadow-xs">
                          Admin
                        </span>
                      )}
                    </div>

                    {/* Bottom Info inside cover */}
                    <div className="absolute bottom-3 inset-x-3 text-white">
                      <h3 className="text-base font-extrabold truncate leading-tight drop-shadow-sm font-display">
                        {group.name}
                      </h3>
                      <p className="text-[11px] text-slate-200 truncate mt-0.5 drop-shadow-xs">
                        {group.title || group.destination}
                      </p>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4">
                    {/* Dates & Location */}
                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#714B67]" />
                        <span>
                          {group.startDate} → {group.endDate}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {group.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {group.description}
                      </p>
                    )}

                    {/* Member Avatars */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div className="flex items-center -space-x-2">
                        {displayMembers.map((m, idx) => (
                          <img
                            key={idx}
                            src={m.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                            alt={m.name}
                            title={`${m.name} (${m.role || 'Member'})`}
                            className="w-7 h-7 rounded-full object-cover border-2 border-white ring-1 ring-slate-200"
                          />
                        ))}
                        {extraCount > 0 && (
                          <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600">
                            +{extraCount}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-[#714B67]" />
                          {group.memoriesCount || 0} posts
                        </span>
                        <span className="flex items-center gap-1">
                          <Camera className="w-3.5 h-3.5 text-[#3E8EDE]" />
                          {group.photosCount || 0} photos
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500">
                    {members.length} Traveler{members.length === 1 ? '' : 's'}
                  </span>
                  <Link to={`/groups/${group.id || group._id}`}>
                    <Button size="xs" variant="primary" icon={ArrowRight}>
                      Open Journal
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreate={createGroupTrip}
      />
    </div>
  );
}

export default GroupJournals;
