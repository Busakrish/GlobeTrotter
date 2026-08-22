import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Camera,
  Plus,
  Heart,
  Share2,
  Trash2,
  Image as ImageIcon,
  Clock,
  Check,
  UserPlus,
  BookOpen,
} from 'lucide-react';
import { useGroupJournal } from '../context/GroupJournalContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import AddMemoryModal from '../components/journal/AddMemoryModal';
import AddMemberModal from '../components/journal/AddMemberModal';
import PhotoLightboxModal from '../components/journal/PhotoLightboxModal';

export function GroupJournalDetail() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const {
    groupTrips,
    memoriesMap,
    fetchGroupDetail,
    addMemory,
    deleteMemory,
    toggleMemoryLike,
    addMemberToGroup,
    removeMemberFromGroup,
  } = useGroupJournal();

  const { currentUser } = useAuth();
  const currentUserId = (currentUser?.id || currentUser?._id || '').toString();

  // Find active group
  const group = useMemo(() => {
    return (groupTrips || []).find((g) => (g.id || g._id).toString() === groupId?.toString());
  }, [groupTrips, groupId]);

  // Memories for this group
  const memories = useMemo(() => {
    return (memoriesMap[groupId] || []).sort(
      (a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt)
    );
  }, [memoriesMap, groupId]);

  // All Photos for Photo Album tab
  const allPhotos = useMemo(() => {
    const list = [];
    memories.forEach((m) => {
      (m.photos || []).forEach((photoUrl) => {
        list.push({ url: photoUrl, memory: m });
      });
    });
    return list;
  }, [memories]);

  const [activeTab, setActiveTab] = useState('feed'); // 'feed' | 'album' | 'members'
  const [addMemoryOpen, setAddMemoryOpen] = useState(false);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);

  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxPhotos, setLightboxPhotos] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxMemory, setLightboxMemory] = useState(null);

  useEffect(() => {
    if (groupId) {
      fetchGroupDetail(groupId);
    }
  }, [groupId, fetchGroupDetail]);

  if (!group) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Group Trip Journal not found</h2>
        <p className="text-xs text-slate-500">The requested group journal does not exist or has been removed.</p>
        <Link to="/groups">
          <Button variant="primary" size="sm" icon={ArrowLeft}>
            Back to Group Journals
          </Button>
        </Link>
      </div>
    );
  }

  const isCreator = (group.creatorId || '').toString() === currentUserId;
  const isMember = (group.members || []).some(
    (m) => (m.userId || m.id || m._id || '').toString() === currentUserId
  );

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(group.inviteCode || 'JOURNAL-GLOBE');
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2000);
  };

  const openLightbox = (photos, index, memory) => {
    setLightboxPhotos(photos);
    setLightboxIndex(index);
    setLightboxMemory(memory);
    setLightboxOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6 text-left animate-fade-in">
      {/* 1. Top Back & Action Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/groups"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#714B67] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Group Journals
        </Link>

        <div className="flex items-center gap-2">
          <Button
            size="xs"
            variant="outline"
            icon={copiedInvite ? Check : Share2}
            onClick={handleCopyInvite}
          >
            {copiedInvite ? 'Code Copied!' : 'Invite Code'}
          </Button>

          <Button
            size="xs"
            variant="outline"
            icon={UserPlus}
            onClick={() => setAddMemberOpen(true)}
          >
            Add Traveler
          </Button>

          <Button
            size="xs"
            variant="primary"
            icon={Camera}
            onClick={() => setAddMemoryOpen(true)}
          >
            Add Memory
          </Button>
        </div>
      </div>

      {/* 2. Hero Cover Banner */}
      <div className="rounded-3xl bg-slate-950 text-white overflow-hidden relative shadow-md">
        <img
          src={group.coverImage}
          alt={group.name}
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        <div className="relative z-10 p-6 sm:p-8 flex flex-col justify-between min-h-[220px]">
          {/* Top badges */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#714B67] text-white shadow-xs">
                Group Journal
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-slate-200">
                {group.destination}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-300 bg-black/40 px-3 py-1 rounded-full backdrop-blur-xs">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>{group.startDate} → {group.endDate}</span>
            </div>
          </div>

          {/* Title & Info */}
          <div className="space-y-2 mt-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display drop-shadow-sm">
              {group.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {group.description || group.title}
            </p>

            {/* Member Avatars & Stats */}
            <div className="flex items-center justify-between pt-3 border-t border-white/10 mt-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center -space-x-2">
                  {(group.members || []).map((m, idx) => (
                    <img
                      key={idx}
                      src={m.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                      alt={m.name}
                      title={`${m.name} (${m.role || 'Member'})`}
                      className="w-7 h-7 rounded-full object-cover border-2 border-slate-900"
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-300 font-medium ml-1">
                  {(group.members || []).length} Traveling Friends
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-300 font-semibold">
                <span>{memories.length} Memories</span>
                <span>•</span>
                <span>{allPhotos.length} Photos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('feed')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'feed'
              ? 'bg-[#714B67] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Timeline Feed ({memories.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('album')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'album'
              ? 'bg-[#714B67] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Camera className="w-4 h-4" />
          Photo Album ({allPhotos.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('members')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'members'
              ? 'bg-[#714B67] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          Members ({(group.members || []).length})
        </button>
      </div>

      {/* 4. Tab 1: Chronological Timeline Feed */}
      {activeTab === 'feed' && (
        <div className="space-y-6">
          {memories.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4 shadow-2xs">
              <div className="w-16 h-16 rounded-2xl bg-[#714B67]/10 text-[#714B67] flex items-center justify-center mx-auto">
                <Camera className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h3 className="text-base font-bold text-slate-900">No memories shared yet</h3>
                <p className="text-xs text-slate-500">
                  Be the first member to upload photos and write about your travel experience in {group.destination}!
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => setAddMemoryOpen(true)}
              >
                Add First Memory Post
              </Button>
            </div>
          ) : (
            <div className="space-y-6 relative before:absolute before:inset-0 before:left-6 sm:before:left-8 before:w-0.5 before:bg-slate-200/80 before:z-0">
              {memories.map((memory) => {
                const isAuthor = (memory.author?.userId || memory.author?.id || '').toString() === currentUserId;
                const canDelete = isAuthor || isCreator;
                const isLiked = (memory.likes || []).includes(currentUserId);
                const photos = memory.photos || [];

                return (
                  <div key={memory.id || memory._id} className="relative z-10 flex gap-4 sm:gap-6 group">
                    {/* Author Avatar Timeline Node */}
                    <div className="shrink-0">
                      <img
                        src={memory.author?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                        alt={memory.author?.name}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl object-cover border-4 border-white shadow-md ring-1 ring-slate-200"
                      />
                    </div>

                    {/* Memory Card */}
                    <div className="flex-1 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow space-y-4">
                      {/* Author Info & Header */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-extrabold text-[#1B1B26]">
                              {memory.author?.name}
                            </span>
                            {memory.author?.role === 'admin' && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase bg-[#714B67]/10 text-[#714B67]">
                                Admin
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-slate-500 font-medium mt-0.5">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              {memory.date}
                            </span>
                            {memory.time && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {memory.time}
                              </span>
                            )}
                            {memory.location && (
                              <span className="flex items-center gap-1 text-[#714B67] font-semibold">
                                <MapPin className="w-3 h-3 text-[#714B67]" />
                                {memory.location}
                              </span>
                            )}
                          </div>
                        </div>

                        {canDelete && (
                          <button
                            type="button"
                            onClick={() => deleteMemory(groupId, memory.id || memory._id)}
                            className="text-slate-400 hover:text-rose-600 transition-colors p-1 rounded-lg hover:bg-rose-50 cursor-pointer"
                            title="Delete memory post"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Caption */}
                      {memory.caption && (
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                          {memory.caption}
                        </p>
                      )}

                      {/* Photos Gallery Grid */}
                      {photos.length > 0 && (
                        <div
                          className={`grid gap-2 rounded-2xl overflow-hidden ${
                            photos.length === 1
                              ? 'grid-cols-1 max-h-96'
                              : photos.length === 2
                              ? 'grid-cols-2 max-h-72'
                              : photos.length === 3
                              ? 'grid-cols-3 max-h-56'
                              : 'grid-cols-2 sm:grid-cols-4 max-h-56'
                          }`}
                        >
                          {photos.map((photoUrl, pIdx) => (
                            <div
                              key={pIdx}
                              onClick={() => openLightbox(photos, pIdx, memory)}
                              className="relative aspect-square w-full overflow-hidden group/photo cursor-pointer bg-slate-100 rounded-xl border border-slate-200/80"
                            >
                              <img
                                src={photoUrl}
                                alt={`Memory photo ${pIdx + 1}`}
                                className="w-full h-full object-cover group-hover/photo:scale-105 transition-transform duration-300"
                              />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <ImageIcon className="w-6 h-6 drop-shadow-md" />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Footer Actions: Likes & Interactions */}
                      <div className="flex items-center justify-between pt-2">
                        <button
                          type="button"
                          onClick={() => toggleMemoryLike(groupId, memory.id || memory._id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                            isLiked
                              ? 'bg-rose-50 text-rose-600 border border-rose-200'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                          <span>{memory.likesCount || (memory.likes || []).length || 0} Likes</span>
                        </button>

                        <span className="text-[11px] text-slate-400">
                          {photos.length} Photo{photos.length === 1 ? '' : 's'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. Tab 2: Combined Photo Album */}
      {activeTab === 'album' && (
        <div className="space-y-4">
          {allPhotos.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#3E8EDE]/10 text-[#3E8EDE] flex items-center justify-center mx-auto">
                <Camera className="w-8 h-8" />
              </div>
              <p className="text-xs text-slate-500">No photos uploaded to this group album yet.</p>
              <Button size="sm" variant="primary" icon={Camera} onClick={() => setAddMemoryOpen(true)}>
                Upload Photos
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {allPhotos.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => openLightbox(allPhotos.map((p) => p.url), idx, item.memory)}
                  className="relative aspect-square w-full group rounded-2xl overflow-hidden cursor-pointer bg-slate-100 shadow-2xs border border-slate-200/90"
                >
                  <img
                    src={item.url}
                    alt="Album photo"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5 text-white">
                    <p className="text-[10px] font-bold truncate">{item.memory?.author?.name}</p>
                    <p className="text-[9px] text-slate-300 truncate">{item.memory?.location || item.memory?.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. Tab 3: Traveling Members Roster */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Trip Members ({(group.members || []).length})
            </h3>
            <Button
              size="xs"
              variant="primary"
              icon={UserPlus}
              onClick={() => setAddMemberOpen(true)}
            >
              Add Existing Traveler
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(group.members || []).map((member) => {
              const isGroupAdmin = member.role === 'admin' || member.userId === group.creatorId;
              const isMe = (member.userId || member.id || member._id || '').toString() === currentUserId;

              return (
                <div
                  key={member.userId || member.id || member._id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white border border-slate-200/90 shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={member.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-slate-100"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {member.name} {isMe && '(You)'}
                        </p>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{member.email}</p>
                      <span className="inline-block mt-1 text-[9px] font-extrabold uppercase tracking-wider text-[#714B67] bg-[#714B67]/10 px-1.5 py-0.2 rounded">
                        {isGroupAdmin ? 'Admin' : 'Member'}
                      </span>
                    </div>
                  </div>

                  {isCreator && !isMe && (
                    <button
                      type="button"
                      onClick={() => removeMemberFromGroup(groupId, member.userId || member.id || member._id)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer"
                      title="Remove member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Memory Modal */}
      <AddMemoryModal
        isOpen={addMemoryOpen}
        onClose={() => setAddMemoryOpen(false)}
        group={group}
        onAddMemory={(data) => addMemory(groupId, data)}
      />

      {/* Add Member Modal */}
      <AddMemberModal
        isOpen={addMemberOpen}
        onClose={() => setAddMemberOpen(false)}
        group={group}
        onAddMember={(userObj) => addMemberToGroup(groupId, userObj)}
      />

      {/* Photo Lightbox Modal */}
      <PhotoLightboxModal
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        photos={lightboxPhotos}
        activeIndex={lightboxIndex}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
        memory={lightboxMemory}
      />
    </div>
  );
}

export default GroupJournalDetail;
