import User from '../models/User.js';
import DataStore from '../config/dataStore.js';
import { getIsMongoConnected } from '../config/db.js';

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (getIsMongoConnected()) {
      try {
        const user = await User.findById(userId);
        if (user) {
          return res.json({ success: true, user });
        }
      } catch (e) {}
    }

    const storeUser = DataStore.findById('users', userId);
    if (storeUser) {
      const { password: _, ...userSafe } = storeUser;
      return res.json({ success: true, user: userSafe });
    }

    return res.json({ success: true, user: req.user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const {
      name,
      country,
      bio,
      travelStyle,
      travelInterests,
      preferredCurrency,
      language,
      notificationPreferences,
      profileImage,
      homeAirport,
      dietary,
      savedDestinations,
    } = req.body;

    const updates = {};
    if (name) updates.name = name;
    if (country) updates.country = country;
    if (bio !== undefined) updates.bio = bio;
    if (travelStyle) updates.travelStyle = travelStyle;
    if (travelInterests) updates.travelInterests = travelInterests;
    if (preferredCurrency) updates.preferredCurrency = preferredCurrency;
    if (language) updates.language = language;
    if (notificationPreferences) updates.notificationPreferences = notificationPreferences;
    if (profileImage) updates.profileImage = profileImage;
    if (homeAirport) updates.homeAirport = homeAirport;
    if (dietary) updates.dietary = dietary;
    if (savedDestinations) updates.savedDestinations = savedDestinations;

    if (getIsMongoConnected()) {
      try {
        const user = await User.findById(userId);
        if (user) {
          Object.assign(user, updates);
          const updated = await user.save();
          return res.json({ success: true, message: 'Profile updated successfully', user: updated });
        }
      } catch (e) {}
    }

    const updatedInStore = DataStore.findByIdAndUpdate('users', userId, updates);
    if (updatedInStore) {
      const { password: _, ...userSafe } = updatedInStore;
      return res.json({ success: true, message: 'Profile updated successfully', user: userSafe });
    }

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      user: { ...req.user, ...updates },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTravelPersonality = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { primaryArchetype, tagline, scores } = req.body;

    const personalityData = {
      primaryArchetype: primaryArchetype || 'The Cultural Explorer',
      tagline: tagline || 'Loves discovering local heritage, authentic dining, and hidden alleyways.',
      scores: scores || {
        adventure: 35,
        culture: 85,
        food: 75,
        nature: 50,
        relaxation: 60,
        shopping: 40,
        budget: 65,
        luxury: 45,
      },
    };

    if (getIsMongoConnected()) {
      try {
        const user = await User.findById(userId);
        if (user) {
          user.travelPersonality = personalityData;
          const updated = await user.save();
          return res.json({ success: true, travelPersonality: updated.travelPersonality });
        }
      } catch (e) {}
    }

    DataStore.findByIdAndUpdate('users', userId, { travelPersonality: personalityData });

    return res.json({
      success: true,
      travelPersonality: personalityData,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    const currentUserId = req.user ? (req.user._id || req.user.id || '').toString() : '';

    let users = [];
    if (getIsMongoConnected()) {
      try {
        const query = q
          ? {
              $or: [
                { name: { $regex: q, $options: 'i' } },
                { email: { $regex: q, $options: 'i' } },
              ],
            }
          : {};
        users = await User.find(query).select('id _id name email profileImage role travelStyle').lean();
      } catch (e) {}
    }

    if (!users || users.length === 0) {
      users = DataStore.getCollection('users') || [];
      if (q && q.trim()) {
        const search = q.toLowerCase();
        users = users.filter(
          (u) =>
            u.name?.toLowerCase().includes(search) ||
            u.email?.toLowerCase().includes(search)
        );
      }
    }

    const safeUsers = users.map((u) => ({
      id: (u.id || u._id).toString(),
      _id: (u._id || u.id).toString(),
      name: u.name,
      email: u.email,
      avatar: u.profileImage || u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: u.role || 'traveler',
      travelStyle: u.travelStyle || 'Balanced Explorer',
    }));

    return res.json({
      success: true,
      count: safeUsers.length,
      users: safeUsers,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default { getUserProfile, updateUserProfile, updateTravelPersonality, searchUsers };

