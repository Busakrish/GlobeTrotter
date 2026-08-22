import DataStore from '../config/dataStore.js';

export const getPublicTrips = async (req, res) => {
  try {
    const { category, style, q } = req.query;
    let trips = DataStore.getCollection('trips');

    if (category && category !== 'all') {
      trips = trips.filter((t) => t.travelStyle?.toLowerCase() === category.toLowerCase());
    }

    if (q && q.trim()) {
      const search = q.toLowerCase();
      trips = trips.filter(
        (t) =>
          t.title?.toLowerCase().includes(search) ||
          t.destination?.toLowerCase().includes(search) ||
          t.country?.toLowerCase().includes(search)
      );
    }

    return res.json({
      success: true,
      count: trips.length,
      trips,
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
      DataStore.getCollection('trips')[0];

    if (!trip) return res.status(404).json({ success: false, message: 'Public trip not found' });

    const tripId = (trip._id || trip.id).toString();
    const days = DataStore.find('itineraryDays', { tripId }).sort((a, b) => a.dayNumber - b.dayNumber);

    return res.json({
      success: true,
      trip: {
        ...trip,
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
