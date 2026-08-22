import Trip from '../models/Trip.js';
import ItineraryDay from '../models/ItineraryDay.js';
import Expense from '../models/Expense.js';
import DataStore from '../config/dataStore.js';
import { getIsMongoConnected } from '../config/db.js';

export const getTrips = async (req, res) => {
  try {
    const userId = (req.user._id || req.user.id).toString();
    let trips = [];

    if (getIsMongoConnected()) {
      try {
        trips = await Trip.find({ userId }).sort({ createdAt: -1 });
      } catch (e) {
        console.warn('[GetTrips DB Error]:', e.message);
      }
    }

    if (!trips.length) {
      trips = DataStore.find('trips', { userId }) || [];
    }

    // Attach days and expenses to each trip
    const fullTrips = trips.map((trip) => {
      const tripId = (trip._id || trip.id).toString();
      const days = DataStore.find('itineraryDays', { tripId }).sort((a, b) => a.dayNumber - b.dayNumber);
      const expenses = DataStore.find('expenses', { tripId });
      return {
        ...trip,
        _id: tripId,
        id: tripId,
        days: days.length ? days : trip.days || [],
        expenses: expenses.length ? expenses : trip.expenses || [],
      };
    });

    return res.json({
      success: true,
      count: fullTrips.length,
      trips: fullTrips,
      data: fullTrips,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    let trip = null;

    if (getIsMongoConnected()) {
      try {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
          trip = await Trip.findById(id);
        } else {
          trip = await Trip.findOne({ id });
        }
      } catch (e) {}
    }

    if (!trip) {
      trip = DataStore.findById('trips', id) || DataStore.findOne('trips', { id });
    }

    if (!trip) {
      // Fallback to first available trip
      const allTrips = DataStore.getCollection('trips');
      if (allTrips.length) trip = allTrips[0];
      else return res.status(404).json({ success: false, message: 'Trip not found' });
    }

    const tripId = (trip._id || trip.id).toString();

    // Fetch days and activities
    let days = [];
    if (getIsMongoConnected()) {
      try {
        days = await ItineraryDay.find({ tripId }).sort({ dayNumber: 1 });
      } catch (e) {}
    }
    if (!days.length) {
      days = DataStore.find('itineraryDays', { tripId }).sort((a, b) => a.dayNumber - b.dayNumber);
    }
    if (!days.length && trip.days) {
      days = trip.days;
    }

    // Fetch expenses
    let expenses = [];
    if (getIsMongoConnected()) {
      try {
        expenses = await Expense.find({ tripId }).sort({ date: -1 });
      } catch (e) {}
    }
    if (!expenses.length) {
      expenses = DataStore.find('expenses', { tripId });
    }

    const result = {
      ...trip,
      _id: tripId,
      id: tripId,
      days,
      expenses,
    };

    return res.json({
      success: true,
      trip: result,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const createTrip = async (req, res) => {
  try {
    const userId = (req.user._id || req.user.id).toString();
    const {
      title,
      name,
      destination,
      startingCity,
      country,
      startDate,
      endDate,
      durationDays,
      travelers,
      travelersCount,
      budget,
      budgetBreakdown,
      currency,
      travelStyle,
      interests,
      coverImage,
      description,
      cities,
    } = req.body;

    const tripTitle = title || name || `${startingCity || destination || 'Multi-City'} Grand Tour`;
    const numTravelers = Number(travelers || travelersCount) || 2;
    const numBudget = Number(budget) || 50000;

    const start = new Date(startDate || Date.now() + 86400000 * 7);
    const end = new Date(endDate || Date.now() + 86400000 * 12);
    const diffTime = Math.abs(end - start);
    const calculatedDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
    const numDays = durationDays || calculatedDays;

    const initialCities = cities && cities.length ? cities : [
      {
        id: 'stop-' + Date.now() + '-1',
        name: startingCity || destination || 'Mumbai',
        country: country || 'India',
        coordinates: [18.9220, 72.8347],
        nights: numDays,
      },
    ];

    const breakdown = budgetBreakdown || {
      flights: Math.round(numBudget * 0.25),
      accommodation: Math.round(numBudget * 0.35),
      food: Math.round(numBudget * 0.15),
      transportation: Math.round(numBudget * 0.10),
      activities: Math.round(numBudget * 0.10),
      shopping: Math.round(numBudget * 0.05),
    };

    const tripId = `trip-${Date.now()}`;

    // Create default days
    const createdDays = [];
    for (let i = 1; i <= numDays; i++) {
      const dayDate = new Date(start);
      dayDate.setDate(start.getDate() + (i - 1));
      const dateStr = dayDate.toISOString().split('T')[0];

      const cityName = initialCities[0]?.name || 'Destination';
      const dayObj = {
        id: `day-${tripId}-${i}`,
        tripId,
        dayNumber: i,
        date: dateStr,
        cityName,
        title: i === 1 ? `Arrival & ${cityName} Exploration` : `Day ${i} in ${cityName}`,
        weather: { condition: 'Sunny', temp: 28, icon: 'Sun' },
        activities: [
          {
            id: `act-${tripId}-${i}-1`,
            activityId: `act-${tripId}-${i}-1`,
            title: i === 1 ? 'Hotel Check-in & Area Orientation' : 'Heritage Landmark & Walking Tour',
            name: i === 1 ? 'Hotel Check-in & Area Orientation' : 'Heritage Landmark & Walking Tour',
            time: '10:00',
            startTime: '10:00',
            durationMinutes: 120,
            category: 'Sightseeing',
            cost: 500,
            estimatedCost: 500,
            location: cityName,
            completed: false,
          },
          {
            id: `act-${tripId}-${i}-2`,
            activityId: `act-${tripId}-${i}-2`,
            title: 'Authentic Local Food & Dinner Experience',
            name: 'Authentic Local Food & Dinner Experience',
            time: '19:30',
            startTime: '19:30',
            durationMinutes: 90,
            category: 'Food & Dining',
            cost: 800,
            estimatedCost: 800,
            location: cityName,
            completed: false,
          },
        ],
      };
      createdDays.push(dayObj);
      DataStore.insert('itineraryDays', dayObj);
    }

    const tripData = {
      _id: tripId,
      id: tripId,
      userId,
      title: tripTitle,
      name: tripTitle,
      destination: initialCities.map((c) => c.name).join(' → ') || 'Multi-City Route',
      country: country || 'India',
      startDate: startDate || start.toISOString().split('T')[0],
      endDate: endDate || end.toISOString().split('T')[0],
      durationDays: numDays,
      travelersCount: numTravelers,
      travelers: numTravelers,
      budget: numBudget,
      budgetBreakdown: breakdown,
      currency: currency || 'INR',
      travelStyle: travelStyle || 'Moderate',
      interests: interests || ['Culture', 'Food'],
      coverImage:
        coverImage ||
        'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      description: description || `Personalized ${numDays}-day journey across ${initialCities.map((c) => c.name).join(', ')}.`,
      status: 'Upcoming',
      cities: initialCities,
      days: createdDays,
      isPublic: false,
      likesCount: 0,
      collaborators: [],
    };

    if (getIsMongoConnected()) {
      try {
        await Trip.create({
          ...tripData,
          _id: undefined,
          userId,
        });
      } catch (e) {
        console.warn('[Trip DB Save Error]:', e.message);
      }
    }

    DataStore.insert('trips', tripData);

    return res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      trip: tripData,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (getIsMongoConnected()) {
      try {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
          await Trip.findByIdAndUpdate(id, updates);
        } else {
          await Trip.findOneAndUpdate({ id }, updates);
        }
      } catch (e) {}
    }

    const updated = DataStore.findByIdAndUpdate('trips', id, updates) || DataStore.findByIdAndUpdate('trips', `trip-${id}`, updates);

    return res.json({
      success: true,
      message: 'Trip updated successfully',
      trip: updated || { id, ...updates },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsMongoConnected()) {
      try {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
          await Trip.findByIdAndDelete(id);
        } else {
          await Trip.findOneAndDelete({ id });
        }
        await ItineraryDay.deleteMany({ tripId: id });
        await Expense.deleteMany({ tripId: id });
      } catch (e) {}
    }

    DataStore.findByIdAndDelete('trips', id);
    DataStore.deleteMany('itineraryDays', { tripId: id });
    DataStore.deleteMany('expenses', { tripId: id });
    DataStore.deleteMany('checklists', { tripId: id });
    DataStore.deleteMany('packingLists', { tripId: id });
    DataStore.deleteMany('documents', { tripId: id });

    return res.json({
      success: true,
      message: 'Trip and all associated schedule records deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const duplicateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const original = DataStore.findById('trips', id) || DataStore.findOne('trips', { id });

    if (!original) {
      return res.status(404).json({ success: false, message: 'Source trip not found' });
    }

    const newTripId = `trip-clone-${Date.now()}`;
    const clonedTrip = {
      ...original,
      _id: newTripId,
      id: newTripId,
      title: `${original.title || original.name} (Copy)`,
      name: `${original.title || original.name} (Copy)`,
      status: 'Planning',
      createdAt: new Date().toISOString(),
    };

    DataStore.insert('trips', clonedTrip);

    // Duplicate days
    const originalDays = DataStore.find('itineraryDays', { tripId: id });
    originalDays.forEach((day, index) => {
      DataStore.insert('itineraryDays', {
        ...day,
        _id: `day-${newTripId}-${index + 1}`,
        id: `day-${newTripId}-${index + 1}`,
        tripId: newTripId,
      });
    });

    return res.status(201).json({
      success: true,
      message: 'Trip cloned successfully',
      trip: clonedTrip,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addStopToTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, country, coordinates, nights } = req.body;

    const trip = DataStore.findById('trips', id) || DataStore.findOne('trips', { id });
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

    const newStop = {
      id: 'stop-' + Date.now(),
      name: name || 'City Stop',
      country: country || 'India',
      coordinates: coordinates || [18.9220, 72.8347],
      nights: Number(nights) || 2,
    };

    const currentCities = trip.cities || [];
    currentCities.push(newStop);

    DataStore.findByIdAndUpdate('trips', id, {
      cities: currentCities,
      destination: currentCities.map((c) => c.name).join(' → '),
    });

    return res.status(201).json({
      success: true,
      message: `Added stop "${newStop.name}" to route`,
      cities: currentCities,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  duplicateTrip,
  addStopToTrip,
};
