import Destination from '../models/Destination.js';
import SavedPlace from '../models/SavedPlace.js';
import DataStore from '../config/dataStore.js';
import { getIsMongoConnected } from '../config/db.js';

export const getDestinations = async (req, res) => {
  try {
    const { q, category, country, costIndex, travelStyle, minRating, sort } = req.query;

    let destinations = [];

    if (getIsMongoConnected()) {
      try {
        const query = {};
        if (category && category !== 'all') {
          query.$or = [{ category }, { secondaryCategories: category }];
        }
        if (country && country !== 'all') query.country = country;
        if (costIndex && costIndex !== 'all') query.costIndex = costIndex;
        if (travelStyle && travelStyle !== 'all') query.travelStyle = travelStyle;
        if (minRating && minRating !== 'all') query.rating = { $gte: Number(minRating) };

        if (q && q.trim()) {
          const regex = new RegExp(q.trim(), 'i');
          query.$or = [
            { name: regex },
            { country: regex },
            { region: regex },
            { description: regex },
            { tags: regex },
          ];
        }

        let sortOption = { rating: -1 };
        if (sort === 'cost_asc') sortOption = { avgDailyCost: 1 };
        if (sort === 'cost_desc') sortOption = { avgDailyCost: -1 };
        if (sort === 'name') sortOption = { name: 1 };

        destinations = await Destination.find(query).sort(sortOption);
      } catch (e) {
        console.warn('[GetDestinations DB Error]:', e.message);
      }
    }

    if (!destinations.length) {
      let items = DataStore.getCollection('destinations');

      if (category && category !== 'all') {
        items = items.filter(
          (d) => d.category === category || d.secondaryCategories?.includes(category)
        );
      }
      if (country && country !== 'all') {
        items = items.filter((d) => d.country?.toLowerCase() === country.toLowerCase());
      }
      if (costIndex && costIndex !== 'all') {
        items = items.filter((d) => d.costIndex === costIndex);
      }
      if (travelStyle && travelStyle !== 'all') {
        items = items.filter((d) => d.travelStyle?.toLowerCase() === travelStyle.toLowerCase());
      }
      if (minRating && minRating !== 'all') {
        items = items.filter((d) => (d.rating || 0) >= Number(minRating));
      }
      if (q && q.trim()) {
        const search = q.toLowerCase().trim();
        items = items.filter(
          (d) =>
            d.name.toLowerCase().includes(search) ||
            d.country.toLowerCase().includes(search) ||
            d.description?.toLowerCase().includes(search) ||
            d.tags?.some((t) => t.toLowerCase().includes(search))
        );
      }

      destinations = items;
    }

    return res.json({
      success: true,
      count: destinations.length,
      destinations,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getDestinationById = async (req, res) => {
  try {
    const { id } = req.params;
    let destination = null;

    if (getIsMongoConnected()) {
      try {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
          destination = await Destination.findById(id);
        } else {
          destination = await Destination.findOne({
            $or: [{ id }, { name: new RegExp('^' + id.replace('dest-', '') + '$', 'i') }],
          });
        }
      } catch (e) {}
    }

    if (!destination) {
      destination =
        DataStore.findOne('destinations', { id }) ||
        DataStore.findOne('destinations', { _id: id }) ||
        DataStore.getCollection('destinations').find(
          (d) => d.name.toLowerCase() === id.replace('dest-', '').toLowerCase()
        );
    }

    if (!destination) {
      // Fallback to default
      const defaultDest = DataStore.getCollection('destinations')[0];
      if (defaultDest) destination = defaultDest;
      else return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    return res.json({
      success: true,
      destination,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const saveDestination = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;
    const placeData = req.body || {};

    let targetDest = null;
    if (getIsMongoConnected()) {
      try {
        if (id && id.match(/^[0-9a-fA-F]{24}$/)) {
          targetDest = await Destination.findById(id);
        } else if (id) {
          targetDest = await Destination.findOne({ id });
        }
      } catch (e) {}
    }
    if (!targetDest && id) {
      targetDest = DataStore.findOne('destinations', { id }) || DataStore.findOne('destinations', { _id: id });
    }

    const placeToSave = {
      userId: userId.toString(),
      destinationId: id || targetDest?.id || placeData.id,
      name: placeData.name || targetDest?.name || 'Saved Destination',
      country: placeData.country || targetDest?.country || 'India',
      type: placeData.type || 'Destination',
      description: placeData.description || targetDest?.shortDescription || targetDest?.description || '',
      image: placeData.image || targetDest?.image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      rating: placeData.rating || targetDest?.rating || 4.8,
      avgCost: placeData.avgCost || targetDest?.avgDailyCost || 4000,
      coordinates: placeData.coordinates || targetDest?.coordinates || [18.9220, 72.8347],
    };

    if (getIsMongoConnected()) {
      try {
        await SavedPlace.findOneAndUpdate(
          { userId, name: placeToSave.name },
          placeToSave,
          { upsert: true, new: true }
        );
      } catch (e) {}
    }

    // Always ensure in DataStore
    const existing = DataStore.findOne('savedPlaces', { userId: userId.toString(), name: placeToSave.name });
    if (!existing) {
      DataStore.insert('savedPlaces', placeToSave);
    }

    return res.status(201).json({
      success: true,
      message: `Saved "${placeToSave.name}" to wishlist`,
      place: placeToSave,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const unsaveDestination = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;

    if (getIsMongoConnected()) {
      try {
        await SavedPlace.deleteMany({
          userId,
          $or: [{ destinationId: id }, { _id: id }, { name: id }],
        });
      } catch (e) {}
    }

    // Remove from DataStore
    const all = DataStore.getCollection('savedPlaces');
    const filtered = all.filter(
      (p) =>
        p.userId !== userId.toString() ||
        (p.destinationId !== id && p.id !== id && p._id !== id && p.name !== id)
    );
    DataStore.setCollection('savedPlaces', filtered);

    return res.json({
      success: true,
      message: 'Place removed from saved wishlist',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getSavedDestinations = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    let saved = [];

    if (getIsMongoConnected()) {
      try {
        saved = await SavedPlace.find({ userId }).sort({ createdAt: -1 });
      } catch (e) {}
    }

    if (!saved.length) {
      saved = DataStore.find('savedPlaces', { userId: userId.toString() });
    }

    return res.json({
      success: true,
      count: saved.length,
      savedPlaces: saved,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getCities = async (req, res) => {
  try {
    const { country, q } = req.query;
    let cities = DataStore.getCollection('cities') || [];

    if (country && country !== 'all') {
      cities = cities.filter((c) => c.country?.toLowerCase() === country.toLowerCase());
    }

    if (q && q.trim()) {
      const search = q.toLowerCase();
      cities = cities.filter(
        (c) =>
          c.name?.toLowerCase().includes(search) ||
          c.country?.toLowerCase().includes(search) ||
          c.region?.toLowerCase().includes(search)
      );
    }

    return res.json({
      success: true,
      count: cities.length,
      cities,
      data: cities,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getActivities = async (req, res) => {
  try {
    const { cityId, cityName, category, q } = req.query;
    let activities = DataStore.getCollection('activities') || [];

    if (cityId && cityId !== 'all') {
      activities = activities.filter((a) => a.cityId === cityId);
    }

    if (cityName && cityName !== 'all') {
      activities = activities.filter((a) => a.cityName?.toLowerCase() === cityName.toLowerCase());
    }

    if (category && category !== 'all') {
      activities = activities.filter(
        (a) =>
          a.category?.toLowerCase() === category.toLowerCase() ||
          a.categoryKey?.toLowerCase() === category.toLowerCase()
      );
    }

    if (q && q.trim()) {
      const search = q.toLowerCase();
      activities = activities.filter(
        (a) =>
          a.title?.toLowerCase().includes(search) ||
          a.name?.toLowerCase().includes(search) ||
          a.description?.toLowerCase().includes(search) ||
          a.cityName?.toLowerCase().includes(search)
      );
    }

    return res.json({
      success: true,
      count: activities.length,
      activities,
      data: activities,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getDestinations,
  getDestinationById,
  saveDestination,
  unsaveDestination,
  getSavedDestinations,
  getCities,
  getActivities,
};

