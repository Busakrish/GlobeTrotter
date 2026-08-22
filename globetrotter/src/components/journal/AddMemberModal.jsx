import { useState, useEffect } from 'react';
import { X, Search, UserPlus, Check, User, AlertCircle, Sparkles } from 'lucide-react';
import { usersApi } from '../../services/api';
import Button from '../common/Button';

export function AddMemberModal({ isOpen, onClose, group, onAddMember }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addedIds, setAddedIds] = useState(new Set());
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Existing member IDs
  const existingMemberIds = new Set(
    (group?.members || []).map((m) => (m.userId || m.id || m._id || '').toString())
  );

  // Search users on platform
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await usersApi.searchUsers(searchQuery);
        if (isMounted && res.success && Array.isArray(res.users)) {
          setUsers(res.users);
        }
      } catch (err) {
        // Fallback default registered users
        if (isMounted) {
          setUsers([
            {
              id: 'user-admin',
              _id: 'user-admin',
              name: 'Alex Rivera (Admin)',
              email: 'admin@globetrotter.io',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
              role: 'admin',
              travelStyle: 'Balanced Explorer',
            },
            {
              id: 'user-priya-sharma',
              _id: 'user-priya-sharma',
              name: 'Priya Sharma',
              email: 'priya.sharma@globetrotter.io',
              avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
              role: 'traveler',
              travelStyle: 'Cultural Explorer',
            },
          ]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const timer = setTimeout(fetchUsers, 200);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isOpen, searchQuery]);

  if (!isOpen) return null;

  const handleAdd = async (userObj) => {
    const uId = (userObj.id || userObj._id).toString();
    setActionLoadingId(uId);
    try {
      await onAddMember(userObj);
      setAddedIds((prev) => new Set([...prev, uId]));
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fade-in text-left">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#714B67] uppercase tracking-wider mb-1">
              <UserPlus className="w-3.5 h-3.5" />
              Invite Collaborators
            </div>
            <h3 className="text-lg font-extrabold text-[#1B1B26] font-display">
              Add Members to {group?.name || 'Group Journal'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search registered travelers by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#714B67]/20 focus:border-[#714B67]"
            autoFocus
          />
        </div>

        {/* User Search Results List */}
        <div className="max-h-72 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">Searching platform users...</div>
          ) : users.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No registered users matched "{searchQuery}".
            </div>
          ) : (
            users.map((u) => {
              const uId = (u.id || u._id).toString();
              const isAlreadyInGroup = existingMemberIds.has(uId) || addedIds.has(uId);
              const isBusy = actionLoadingId === uId;

              return (
                <div
                  key={uId}
                  className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={u.avatar || u.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                      alt={u.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-200"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{u.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{u.email}</p>
                      <span className="inline-block mt-0.5 text-[9px] font-bold uppercase tracking-wider text-[#714B67] bg-[#714B67]/10 px-1.5 py-0.2 rounded">
                        {u.travelStyle || 'Traveler'}
                      </span>
                    </div>
                  </div>

                  <div>
                    {isAlreadyInGroup ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                        <Check className="w-3.5 h-3.5" />
                        Member
                      </span>
                    ) : (
                      <Button
                        size="xs"
                        variant="primary"
                        icon={UserPlus}
                        onClick={() => handleAdd(u)}
                        disabled={isBusy}
                      >
                        {isBusy ? 'Adding...' : 'Add'}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Note */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11px] text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#F0A63F]" />
            Only registered users with active accounts can join.
          </p>
          <Button size="xs" variant="secondary" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddMemberModal;
