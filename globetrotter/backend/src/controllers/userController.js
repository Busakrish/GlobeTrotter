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

export default { getUserProfile, updateUserProfile, updateTravelPersonality };
