import DataStore from '../config/dataStore.js';
import User from '../models/User.js';
import { getIsMongoConnected } from '../config/db.js';

// Helper to get safe user profile
const getUserRecord = (userId) => {
  const users = DataStore.getCollection('users') || [];
  return users.find((u) => (u.id || u._id || '').toString() === userId.toString()) || null;
};

// 1. Get all group trips for the current user
export const getGroupTrips = async (req, res) => {
  try {
    const currentUserId = req.user ? (req.user._id || req.user.id || '').toString() : '';
    const allGroups = DataStore.getCollection('groupTrips') || [];
    const allMemories = DataStore.getCollection('groupJournalMemories') || [];

    // Filter groups where user is a member, creator, or admin
    const userGroups = allGroups.filter((g) => {
      if (req.user?.role === 'admin') return true;
      if (g.creatorId?.toString() === currentUserId) return true;
      return g.members?.some((m) => m.userId?.toString() === currentUserId || m.id?.toString() === currentUserId || m._id?.toString() === currentUserId);
    });

    const enrichedGroups = userGroups.map((g) => {
      const gId = (g.id || g._id).toString();
      const memories = allMemories.filter((m) => m.groupId === gId);
      const photoCount = memories.reduce((sum, m) => sum + (m.photos?.length || 0), 0);

      return {
        ...g,
        id: gId,
        _id: gId,
        memoriesCount: memories.length,
        photosCount: photoCount,
        latestMemory: memories[memories.length - 1] || null,
      };
    });

    return res.json({
      success: true,
      count: enrichedGroups.length,
      groups: enrichedGroups,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Get specific group trip by ID
export const getGroupTripById = async (req, res) => {
  try {
    const { groupId } = req.params;
    const currentUserId = req.user ? (req.user._id || req.user.id || '').toString() : '';

    const group =
      DataStore.findById('groupTrips', groupId) ||
      DataStore.findOne('groupTrips', { id: groupId }) ||
      DataStore.findOne('groupTrips', { _id: groupId });

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group trip journal not found' });
    }

    const gId = (group.id || group._id).toString();
    const allMemories = DataStore.getCollection('groupJournalMemories') || [];
    const memories = allMemories.filter((m) => m.groupId === gId).sort((a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt));
    const photoCount = memories.reduce((sum, m) => sum + (m.photos?.length || 0), 0);

    return res.json({
      success: true,
      group: {
        ...group,
        id: gId,
        _id: gId,
        memoriesCount: memories.length,
        photosCount: photoCount,
        memories,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Create a new trip group
export const createGroupTrip = async (req, res) => {
  try {
    const {
      name,
      title,
      destination,
      startDate,
      endDate,
      coverImage,
      description,
      invitedUserIds = [],
    } = req.body;

    if (!name || !destination || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide group name, destination, start date, and end date',
      });
    }

    const currentUserId = req.user ? (req.user._id || req.user.id || 'user-priya-sharma').toString() : 'user-priya-sharma';
    const currentUserObj = req.user || getUserRecord(currentUserId) || {
      name: 'Priya Sharma',
      email: 'priya.sharma@globetrotter.io',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    };

    const newGroupId = `group-${Date.now()}`;

    // Creator is always added as Admin
    const members = [
      {
        userId: currentUserId,
        id: currentUserId,
        _id: currentUserId,
        name: currentUserObj.name,
        email: currentUserObj.email,
        avatar: currentUserObj.profileImage || currentUserObj.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        role: 'admin',
        joinedAt: new Date().toISOString(),
      },
    ];

    // Add invited existing registered users (prevent duplicates)
    const existingUsers = DataStore.getCollection('users') || [];
    const addedIds = new Set([currentUserId]);

    invitedUserIds.forEach((uid) => {
      const uStr = uid.toString();
      if (!addedIds.has(uStr)) {
        const u = existingUsers.find((user) => (user.id || user._id || '').toString() === uStr);
        if (u) {
          addedIds.add(uStr);
          members.push({
            userId: uStr,
            id: uStr,
            _id: uStr,
            name: u.name,
            email: u.email,
            avatar: u.profileImage || u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            role: 'member',
            joinedAt: new Date().toISOString(),
          });
        }
      }
    });

    const defaultCover = coverImage || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80';

    const newGroup = {
      _id: newGroupId,
      id: newGroupId,
      name,
      title: title || name,
      destination,
      startDate,
      endDate,
      coverImage: defaultCover,
      description: description || `Shared travel journal and memory album for ${destination}.`,
      creatorId: currentUserId,
      creatorName: currentUserObj.name,
      adminIds: [currentUserId],
      members,
      inviteCode: `JOURNAL-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    DataStore.insert('groupTrips', newGroup);

    return res.status(201).json({
      success: true,
      message: 'Group trip journal created successfully!',
      group: newGroup,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Update group trip details
export const updateGroupTrip = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, title, destination, startDate, endDate, coverImage, description } = req.body;

    const group =
      DataStore.findById('groupTrips', groupId) ||
      DataStore.findOne('groupTrips', { id: groupId });

    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    const updates = {};
    if (name) updates.name = name;
    if (title) updates.title = title;
    if (destination) updates.destination = destination;
    if (startDate) updates.startDate = startDate;
    if (endDate) updates.endDate = endDate;
    if (coverImage) updates.coverImage = coverImage;
    if (description !== undefined) updates.description = description;
    updates.updatedAt = new Date().toISOString();

    const updated = DataStore.findByIdAndUpdate('groupTrips', group.id || group._id, updates);

    return res.json({
      success: true,
      message: 'Group trip journal updated successfully',
      group: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Add an existing user to group members
export const addGroupMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ success: false, message: 'Please provide user ID to add' });
    }

    const group =
      DataStore.findById('groupTrips', groupId) ||
      DataStore.findOne('groupTrips', { id: groupId });

    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    // Verify user exists in registered database
    const users = DataStore.getCollection('users') || [];
    const targetUser = users.find((u) => (u.id || u._id || '').toString() === userId.toString());

    if (!targetUser) {
      return res.status(404).json({ success: false, message: 'Registered user not found on platform' });
    }

    const currentMembers = group.members || [];
    const alreadyMember = currentMembers.some(
      (m) => (m.userId || m.id || m._id || '').toString() === userId.toString()
    );

    if (alreadyMember) {
      return res.status(400).json({ success: false, message: 'User is already a member of this group' });
    }

    const newMember = {
      userId: (targetUser.id || targetUser._id).toString(),
      id: (targetUser.id || targetUser._id).toString(),
      _id: (targetUser.id || targetUser._id).toString(),
      name: targetUser.name,
      email: targetUser.email,
      avatar: targetUser.profileImage || targetUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: 'member',
      joinedAt: new Date().toISOString(),
    };

    currentMembers.push(newMember);
    DataStore.findByIdAndUpdate('groupTrips', group.id || group._id, { members: currentMembers });

    return res.status(201).json({
      success: true,
      message: `${newMember.name} added to the group journal!`,
      member: newMember,
      members: currentMembers,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Remove a member from group
export const removeGroupMember = async (req, res) => {
  try {
    const { groupId, userId } = req.params;

    const group =
      DataStore.findById('groupTrips', groupId) ||
      DataStore.findOne('groupTrips', { id: groupId });

    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    let currentMembers = group.members || [];
    currentMembers = currentMembers.filter(
      (m) => (m.userId || m.id || m._id || '').toString() !== userId.toString()
    );

    DataStore.findByIdAndUpdate('groupTrips', group.id || group._id, { members: currentMembers });

    return res.json({
      success: true,
      message: 'Member removed from group',
      members: currentMembers,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 7. Get chronological memories feed for a group
export const getGroupMemories = async (req, res) => {
  try {
    const { groupId } = req.params;
    const allMemories = DataStore.getCollection('groupJournalMemories') || [];

    const groupMemories = allMemories
      .filter((m) => m.groupId === groupId)
      .sort((a, b) => new Date(a.date || a.createdAt) - new Date(b.date || b.createdAt));

    return res.json({
      success: true,
      count: groupMemories.length,
      memories: groupMemories,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 8. Add a memory post to group journal
export const createGroupMemory = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { photos = [], caption, location, date, time } = req.body;

    if (!photos || photos.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide at least one photo for the memory' });
    }

    const group =
      DataStore.findById('groupTrips', groupId) ||
      DataStore.findOne('groupTrips', { id: groupId });

    if (!group) return res.status(404).json({ success: false, message: 'Group not found' });

    const currentUserId = req.user ? (req.user._id || req.user.id || 'user-priya-sharma').toString() : 'user-priya-sharma';
    const currentUserObj = req.user || getUserRecord(currentUserId) || {
      name: 'Priya Sharma',
      email: 'priya.sharma@globetrotter.io',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    };

    const isGroupAdmin = group.creatorId === currentUserId || group.adminIds?.includes(currentUserId);

    const memoryId = `memory-${Date.now()}`;
    const newMemory = {
      _id: memoryId,
      id: memoryId,
      groupId,
      photos: Array.isArray(photos) ? photos : [photos],
      caption: caption || '',
      location: location || group.destination || '',
      date: date || new Date().toISOString().split('T')[0],
      time: time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      author: {
        userId: currentUserId,
        id: currentUserId,
        _id: currentUserId,
        name: currentUserObj.name,
        email: currentUserObj.email,
        avatar: currentUserObj.profileImage || currentUserObj.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        role: isGroupAdmin ? 'admin' : 'member',
      },
      likes: [],
      likesCount: 0,
      createdAt: new Date().toISOString(),
    };

    DataStore.insert('groupJournalMemories', newMemory);

    return res.status(201).json({
      success: true,
      message: 'Memory posted to group journal!',
      memory: newMemory,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 9. Delete memory post
export const deleteGroupMemory = async (req, res) => {
  try {
    const { groupId, memoryId } = req.params;
    const currentUserId = req.user ? (req.user._id || req.user.id || '').toString() : '';

    const memory =
      DataStore.findById('groupJournalMemories', memoryId) ||
      DataStore.findOne('groupJournalMemories', { id: memoryId });

    if (!memory) return res.status(404).json({ success: false, message: 'Memory not found' });

    DataStore.deleteById('groupJournalMemories', memory.id || memory._id);

    return res.json({
      success: true,
      message: 'Memory removed from journal',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 10. Like / unlike memory post
export const toggleMemoryLike = async (req, res) => {
  try {
    const { groupId, memoryId } = req.params;
    const currentUserId = req.user ? (req.user._id || req.user.id || 'user-priya-sharma').toString() : 'user-priya-sharma';

    const memory =
      DataStore.findById('groupJournalMemories', memoryId) ||
      DataStore.findOne('groupJournalMemories', { id: memoryId });

    if (!memory) return res.status(404).json({ success: false, message: 'Memory not found' });

    let likes = memory.likes || [];
    const isLiked = likes.includes(currentUserId);

    if (isLiked) {
      likes = likes.filter((uid) => uid !== currentUserId);
    } else {
      likes.push(currentUserId);
    }

    const updated = DataStore.findByIdAndUpdate('groupJournalMemories', memory.id || memory._id, {
      likes,
      likesCount: likes.length,
    });

    return res.json({
      success: true,
      isLiked: !isLiked,
      likesCount: likes.length,
      memory: updated,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getGroupTrips,
  getGroupTripById,
  createGroupTrip,
  updateGroupTrip,
  addGroupMember,
  removeGroupMember,
  getGroupMemories,
  createGroupMemory,
  deleteGroupMemory,
  toggleMemoryLike,
};
