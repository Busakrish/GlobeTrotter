import { useState, useEffect } from 'react';
import { X, Users, MapPin, Calendar, Image as ImageIcon, Sparkles, Check, Search, Plus, Trash2 } from 'lucide-react';
import { usersApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const COVER_PRESETS = [
  {
    name: 'Goa Coastal',
    url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Rajasthan Heritage',
    url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Himalayan Mountain',
    url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: 'Tokyo Neon & Shrines',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
  },
];

export function CreateGroupModal({ isOpen, onClose, onCreate }) {
  const { currentUser } = useAuth();

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [coverImage, setCoverImage] = useState(COVER_PRESETS[0].url);
  const [description, setDescription] = useState('');

  // Search & Invite Users
  const [userSearch, setUserSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searching, setSearching] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Search platform users
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const search = async () => {
      setSearching(true);
      try {
        const res = await usersApi.searchUsers(userSearch);
        if (isMounted && res.success && Array.isArray(res.users)) {
          // Filter out current user from search suggestions
          const currentId = (currentUser?.id || currentUser?._id || '').toString();
          setSearchResults(res.users.filter((u) => (u.id || u._id).toString() !== currentId));
        }
      } catch (err) {
        if (isMounted) {
          setSearchResults([
            {
              id: 'user-admin',
              name: 'Alex Rivera (Admin)',
              email: 'admin@globetrotter.io',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
              role: 'admin',
            },
          ]);
        }
      } finally {
        if (isMounted) setSearching(false);
      }
    };

    const timer = setTimeout(search, 200);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isOpen, userSearch, currentUser]);

  if (!isOpen) return null;

  const toggleUserSelection = (userObj) => {
    const uId = (userObj.id || userObj._id).toString();
    setSelectedUsers((prev) => {
      if (prev.some((u) => (u.id || u._id).toString() === uId)) {
        return prev.filter((u) => (u.id || u._id).toString() !== uId);
      }
      return [...prev, userObj];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !destination.trim() || !startDate || !endDate) return;

    setSubmitting(true);
    try {
      await onCreate({
        name: name.trim(),
        title: (title || name).trim(),
        destination: destination.trim(),
        startDate,
        endDate,
        coverImage,
        description: description.trim(),
        invitedUserIds: selectedUsers.map((u) => (u.id || u._id).toString()),
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in text-left">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto scrollbar-thin space-y-6 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#714B67] uppercase tracking-wider mb-1">
              <Users className="w-3.5 h-3.5" />
              Collaborative Space
            </div>
            <h2 className="text-xl font-extrabold text-[#1B1B26] font-display">
              Create New Group Trip Journal
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Group Name & Trip Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Group Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. The Wandering Squad"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#714B67]/20 focus:border-[#714B67]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Trip Title
              </label>
              <input
                type="text"
                placeholder="e.g. Goa Coastal Sunsets 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#714B67]/20 focus:border-[#714B67]"
              />
            </div>
          </div>

          {/* Destination */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Destination <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. Goa, India or Rajasthan Palaces"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#714B67]/20 focus:border-[#714B67]"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#714B67]/20 focus:border-[#714B67]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                End Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#714B67]/20 focus:border-[#714B67]"
              />
            </div>
          </div>

          {/* Cover Image Presets & Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Trip Cover Image
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2.5">
              {COVER_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => setCoverImage(preset.url)}
                  className={`relative rounded-xl overflow-hidden h-16 border-2 transition-all cursor-pointer ${
                    coverImage === preset.url
                      ? 'border-[#714B67] ring-2 ring-[#714B67]/30 scale-[1.02]'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-1.5">
                    <span className="text-[10px] font-bold text-white leading-tight truncate">
                      {preset.name}
                    </span>
                  </div>
                  {coverImage === preset.url && (
                    <div className="absolute top-1 right-1 w-4 h-4 bg-[#714B67] rounded-full flex items-center justify-center text-white">
                      <Check className="w-2.5 h-2.5" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <input
              type="url"
              placeholder="Or paste custom image URL..."
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#714B67]/20 focus:border-[#714B67]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Trip Description
            </label>
            <textarea
              rows={2}
              placeholder="Describe your collaborative journey plans..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#714B67]/20 focus:border-[#714B67]"
            />
          </div>

          {/* Invite Existing Registered Users */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#714B67]" />
                Invite Traveling Members
              </label>
              <span className="text-[10px] text-slate-500 font-semibold">
                You will be Group Admin
              </span>
            </div>

            {/* Selected Users Chips */}
            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pb-1">
                {selectedUsers.map((u) => (
                  <span
                    key={u.id || u._id}
                    className="inline-flex items-center gap-1.5 bg-white border border-[#714B67]/30 text-xs font-bold text-[#714B67] px-2.5 py-1 rounded-full shadow-2xs"
                  >
                    <img
                      src={u.avatar || u.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                      alt={u.name}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                    {u.name}
                    <button
                      type="button"
                      onClick={() => toggleUserSelection(u)}
                      className="hover:text-rose-600 transition-colors cursor-pointer ml-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Search Input for Users */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search registered travelers (e.g. Alex Rivera)..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#714B67]/20 focus:border-[#714B67]"
              />
            </div>

            {/* Matching Users List */}
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
              {searchResults.length === 0 ? (
                <p className="text-[11px] text-slate-400 text-center py-2">
                  {searching ? 'Searching...' : 'Search existing registered travelers by name or email.'}
                </p>
              ) : (
                searchResults.map((u) => {
                  const isSelected = selectedUsers.some(
                    (su) => (su.id || su._id).toString() === (u.id || u._id).toString()
                  );
                  return (
                    <button
                      key={u.id || u._id}
                      type="button"
                      onClick={() => toggleUserSelection(u)}
                      className={`flex items-center justify-between w-full p-2 rounded-xl text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#714B67]/10 border border-[#714B67]/40'
                          : 'bg-white hover:bg-slate-100 border border-slate-200/60'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img
                          src={u.avatar || u.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                          alt={u.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate leading-tight">
                            {u.name}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">{u.email}</p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected
                            ? 'bg-[#714B67] text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {isSelected ? 'Invited' : '+ Add'}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <Button size="sm" variant="secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              icon={Sparkles}
              type="submit"
              disabled={submitting}
            >
              {submitting ? 'Creating Group...' : 'Create Group Journal'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateGroupModal;
