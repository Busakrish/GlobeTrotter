import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { groupJournalApi, usersApi } from '../services/api';
import { useAuth } from './AuthContext';

const GroupJournalContext = createContext(null);

export function GroupJournalProvider({ children }) {
  const { currentUser } = useAuth();

  const [groupTrips, setGroupTrips] = useState(() => {
    const saved = localStorage.getItem('globetrotter_group_trips');
    return saved ? JSON.parse(saved) : [];
  });

  const [memoriesMap, setMemoriesMap] = useState(() => {
    const saved = localStorage.getItem('globetrotter_group_memories');
    return saved ? JSON.parse(saved) : {};
  });

  const [loading, setLoading] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('globetrotter_group_trips', JSON.stringify(groupTrips));
  }, [groupTrips]);

  useEffect(() => {
    localStorage.setItem('globetrotter_group_memories', JSON.stringify(memoriesMap));
  }, [memoriesMap]);

  // Fetch groups from API
  const fetchGroups = useCallback(async () => {
    setLoading(true);
    try {
      const res = await groupJournalApi.getGroupTrips();
      if (res?.success && Array.isArray(res.groups)) {
        setGroupTrips(res.groups);
      }
    } catch (err) {
      console.warn('[GroupJournalContext] API fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups, currentUser]);

  // Fetch group detail & memories
  const fetchGroupDetail = useCallback(async (groupId) => {
    try {
      const [groupRes, memRes] = await Promise.all([
        groupJournalApi.getGroupTripById(groupId).catch(() => null),
        groupJournalApi.getGroupMemories(groupId).catch(() => null),
      ]);

      if (groupRes?.success && groupRes.group) {
        setGroupTrips((prev) =>
          prev.map((g) => (g.id === groupId || g._id === groupId ? { ...g, ...groupRes.group } : g))
        );
      }

      if (memRes?.success && Array.isArray(memRes.memories)) {
        setMemoriesMap((prev) => ({
          ...prev,
          [groupId]: memRes.memories,
        }));
      }
    } catch (e) {
      console.warn('[GroupJournalContext] Error fetching group detail:', e);
    }
  }, []);

  // Create new group trip
  const createGroupTrip = async (groupData) => {
    try {
      const res = await groupJournalApi.createGroupTrip(groupData);
      if (res.success && res.group) {
        const newG = { ...res.group, id: res.group.id || res.group._id };
        setGroupTrips((prev) => [newG, ...prev]);
        return { success: true, group: newG };
      }
    } catch (err) {
      console.warn('[GroupJournalContext] API create error, using local fallback:', err.message);
    }

    // Fallback
    const currentUserId = currentUser?.id || currentUser?._id || 'user-priya-sharma';
    const newG = {
      id: `group-${Date.now()}`,
      _id: `group-${Date.now()}`,
      name: groupData.name,
      title: groupData.title || groupData.name,
      destination: groupData.destination,
      startDate: groupData.startDate,
      endDate: groupData.endDate,
      coverImage: groupData.coverImage || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      description: groupData.description || `Shared travel album for ${groupData.destination}.`,
      creatorId: currentUserId,
      creatorName: currentUser?.name || 'Priya Sharma',
      adminIds: [currentUserId],
      members: [
        {
          userId: currentUserId,
          id: currentUserId,
          _id: currentUserId,
          name: currentUser?.name || 'Priya Sharma',
          email: currentUser?.email || 'priya.sharma@globetrotter.io',
          avatar: currentUser?.profileImage || currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
          role: 'admin',
          joinedAt: new Date().toISOString(),
        },
      ],
      inviteCode: `JOURNAL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      memoriesCount: 0,
      photosCount: 0,
      createdAt: new Date().toISOString(),
    };

    setGroupTrips((prev) => [newG, ...prev]);
    return { success: true, group: newG };
  };

  // Add member to group
  const addMemberToGroup = async (groupId, userObj) => {
    try {
      const res = await groupJournalApi.addGroupMember(groupId, userObj.id || userObj._id);
      if (res.success && res.members) {
        setGroupTrips((prev) =>
          prev.map((g) =>
            g.id === groupId || g._id === groupId ? { ...g, members: res.members } : g
          )
        );
        return { success: true, members: res.members };
      }
    } catch (err) {
      console.warn('[GroupJournalContext] API add member error, using local fallback:', err.message);
    }

    // Local fallback
    const newMember = {
      userId: (userObj.id || userObj._id).toString(),
      id: (userObj.id || userObj._id).toString(),
      _id: (userObj.id || userObj._id).toString(),
      name: userObj.name,
      email: userObj.email,
      avatar: userObj.profileImage || userObj.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: 'member',
      joinedAt: new Date().toISOString(),
    };

    setGroupTrips((prev) =>
      prev.map((g) => {
        if (g.id === groupId || g._id === groupId) {
          const members = g.members || [];
          if (!members.some((m) => (m.userId || m.id) === (userObj.id || userObj._id))) {
            return { ...g, members: [...members, newMember] };
          }
        }
        return g;
      })
    );

    return { success: true, member: newMember };
  };

  // Remove member from group
  const removeMemberFromGroup = async (groupId, userId) => {
    try {
      await groupJournalApi.removeGroupMember(groupId, userId);
    } catch (e) {
      console.warn(e);
    }

    setGroupTrips((prev) =>
      prev.map((g) => {
        if (g.id === groupId || g._id === groupId) {
          return {
            ...g,
            members: (g.members || []).filter((m) => (m.userId || m.id || m._id) !== userId),
          };
        }
        return g;
      })
    );
  };

  // Add memory post
  const addMemory = async (groupId, memoryData) => {
    try {
      const res = await groupJournalApi.createGroupMemory(groupId, memoryData);
      if (res.success && res.memory) {
        const newM = { ...res.memory, id: res.memory.id || res.memory._id };
        setMemoriesMap((prev) => ({
          ...prev,
          [groupId]: [...(prev[groupId] || []), newM],
        }));

        // Update group count
        setGroupTrips((prev) =>
          prev.map((g) => {
            if (g.id === groupId || g._id === groupId) {
              return {
                ...g,
                memoriesCount: (g.memoriesCount || 0) + 1,
                photosCount: (g.photosCount || 0) + (newM.photos?.length || 0),
              };
            }
            return g;
          })
        );
        return { success: true, memory: newM };
      }
    } catch (err) {
      console.warn('[GroupJournalContext] API memory error, using local fallback:', err.message);
    }

    // Fallback
    const currentUserId = currentUser?.id || currentUser?._id || 'user-priya-sharma';
    const newM = {
      id: `memory-${Date.now()}`,
      _id: `memory-${Date.now()}`,
      groupId,
      photos: memoryData.photos || [],
      caption: memoryData.caption || '',
      location: memoryData.location || '',
      date: memoryData.date || new Date().toISOString().split('T')[0],
      time: memoryData.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      author: {
        userId: currentUserId,
        id: currentUserId,
        _id: currentUserId,
        name: currentUser?.name || 'Priya Sharma',
        email: currentUser?.email || 'priya.sharma@globetrotter.io',
        avatar: currentUser?.profileImage || currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        role: 'member',
      },
      likes: [],
      likesCount: 0,
      createdAt: new Date().toISOString(),
    };

    setMemoriesMap((prev) => ({
      ...prev,
      [groupId]: [...(prev[groupId] || []), newM],
    }));

    setGroupTrips((prev) =>
      prev.map((g) => {
        if (g.id === groupId || g._id === groupId) {
          return {
            ...g,
            memoriesCount: (g.memoriesCount || 0) + 1,
            photosCount: (g.photosCount || 0) + (newM.photos?.length || 0),
          };
        }
        return g;
      })
    );

    return { success: true, memory: newM };
  };

  // Delete memory
  const deleteMemory = async (groupId, memoryId) => {
    try {
      await groupJournalApi.deleteGroupMemory(groupId, memoryId);
    } catch (e) {
      console.warn(e);
    }

    setMemoriesMap((prev) => {
      const currentList = prev[groupId] || [];
      const filtered = currentList.filter((m) => (m.id || m._id) !== memoryId);
      return { ...prev, [groupId]: filtered };
    });
  };

  // Toggle Like
  const toggleMemoryLike = async (groupId, memoryId) => {
    const currentUserId = currentUser?.id || currentUser?._id || 'user-priya-sharma';
    try {
      await groupJournalApi.toggleMemoryLike(groupId, memoryId);
    } catch (e) {
      console.warn(e);
    }

    setMemoriesMap((prev) => {
      const currentList = prev[groupId] || [];
      const updated = currentList.map((m) => {
        if ((m.id || m._id) === memoryId) {
          const likes = m.likes || [];
          const isLiked = likes.includes(currentUserId);
          const newLikes = isLiked ? likes.filter((u) => u !== currentUserId) : [...likes, currentUserId];
          return { ...m, likes: newLikes, likesCount: newLikes.length };
        }
        return m;
      });
      return { ...prev, [groupId]: updated };
    });
  };

  return (
    <GroupJournalContext.Provider
      value={{
        groupTrips,
        memoriesMap,
        loading,
        fetchGroups,
        fetchGroupDetail,
        createGroupTrip,
        addMemberToGroup,
        removeMemberFromGroup,
        addMemory,
        deleteMemory,
        toggleMemoryLike,
      }}
    >
      {children}
    </GroupJournalContext.Provider>
  );
}

export const useGroupJournal = () => {
  const context = useContext(GroupJournalContext);
  if (!context) {
    throw new Error('useGroupJournal must be used within a GroupJournalProvider');
  }
  return context;
};

export default GroupJournalContext;
