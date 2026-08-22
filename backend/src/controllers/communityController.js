import DataStore from '../config/dataStore.js';

export const getPublicTrips = async (req, res) => {
  try {
    const { category, style, q } = req.query;
    const trips = (DataStore.getCollection('trips') || []).filter((t) => t.isPublic === true);
    const users = DataStore.getCollection('users') || [];
    const userMap = {};
    users.forEach((u) => {
      userMap[(u.id || u._id).toString()] = u;
    });

    let enrichedTrips = trips.map((t) => {
      const u = userMap[(t.userId || '').toString()];
      const destinationsList = t.cities?.map((c) => c.name) ||
        (t.destination ? (typeof t.destination === 'string' ? t.destination.split(' → ') : t.destination) : []);

      return {
        ...t,
        destinations: destinationsList,
        likesCount: t.likesCount || 0,
        rating: t.rating || 5.0,
        tags: t.interests || [t.travelStyle || 'Balanced Explorer'],
        author: {
          name: u?.name || 'Traveler',
          email: u?.email || '',
          avatar: u?.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          handle: `@${(u?.name || 'traveler').toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
          badge: u?.role === 'admin' ? 'Platform Admin' : 'Verified Explorer',
        },
      };
    });

    if (category && category !== 'all') {
      enrichedTrips = enrichedTrips.filter(
        (t) =>
          t.travelStyle?.toLowerCase() === category.toLowerCase() ||
          t.tags?.some((tag) => tag.toLowerCase() === category.toLowerCase())
      );
    }

    if (q && q.trim()) {
      const search = q.toLowerCase();
      enrichedTrips = enrichedTrips.filter(
        (t) =>
          t.title?.toLowerCase().includes(search) ||
          t.description?.toLowerCase().includes(search) ||
          t.author?.name?.toLowerCase().includes(search) ||
          t.destinations?.some((d) => d.toLowerCase().includes(search))
      );
    }

    return res.json({
      success: true,
      count: enrichedTrips.length,
      trips: enrichedTrips,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getPublicTripByShareId = async (req, res) => {
  try {
    const { shareId } = req.params;
    const trip =
      DataStore.findById('trips', shareId) ||
      DataStore.findOne('trips', { id: shareId }) ||
      DataStore.findOne('trips', { shareId: shareId }) ||
      DataStore.getCollection('trips')[0];

    if (!trip) return res.status(404).json({ success: false, message: 'Public trip not found' });

    const tripId = (trip._id || trip.id).toString();
    const days = DataStore.find('itineraryDays', { tripId }).sort((a, b) => a.dayNumber - b.dayNumber);

    const users = DataStore.getCollection('users');
    const user = DataStore.findById('users', trip.userId) || DataStore.findOne('users', { id: trip.userId }) || users[0];

    const author = {
      name: user?.name || 'Priya Sharma',
      email: user?.email || 'priya.sharma@globetrotter.io',
      avatar: user?.profileImage || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      handle: `@${(user?.name || 'priya_sharma').toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      badge: user?.role === 'admin' ? 'Platform Admin' : 'Verified Explorer',
    };

    return res.json({
      success: true,
      trip: {
        ...trip,
        author,
        days,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const forkTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user ? (req.user._id || req.user.id).toString() : 'user-new';

    const source = DataStore.findById('trips', tripId) || DataStore.findOne('trips', { id: tripId });
    if (!source) return res.status(404).json({ success: false, message: 'Source trip not found' });

    const newTripId = `trip-fork-${Date.now()}`;
    const forked = {
      ...source,
      _id: newTripId,
      id: newTripId,
      userId,
      title: `${source.title || source.name} (Forked)`,
      name: `${source.title || source.name} (Forked)`,
      status: 'Planning',
      createdAt: new Date().toISOString(),
    };

    DataStore.insert('trips', forked);

    const originalDays = DataStore.find('itineraryDays', { tripId });
    originalDays.forEach((d, i) => {
      DataStore.insert('itineraryDays', {
        ...d,
        _id: `day-${newTripId}-${i + 1}`,
        id: `day-${newTripId}-${i + 1}`,
        tripId: newTripId,
      });
    });

    return res.status(201).json({
      success: true,
      message: 'Trip added to your personal library!',
      trip: forked,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const likeTrip = async (req, res) => {
  try {
    const { tripId } = req.params;
    const trip = DataStore.findById('trips', tripId) || DataStore.findOne('trips', { id: tripId });

    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    const likesCount = (trip.likesCount || 0) + 1;
    DataStore.findByIdAndUpdate('trips', trip.id, { likesCount });

    return res.json({
      success: true,
      likesCount,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default { getPublicTrips, getPublicTripByShareId, forkTrip, likeTrip };
