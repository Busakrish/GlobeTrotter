import ItineraryDay from '../models/ItineraryDay.js';
import DataStore from '../config/dataStore.js';
import { getIsMongoConnected } from '../config/db.js';

export const getTripItinerary = async (req, res) => {
  try {
    const { tripId } = req.params;
    let days = [];

    if (getIsMongoConnected()) {
      try {
        days = await ItineraryDay.find({ tripId }).sort({ dayNumber: 1 });
      } catch (e) {}
    }

    if (!days.length) {
      days = DataStore.find('itineraryDays', { tripId }).sort((a, b) => a.dayNumber - b.dayNumber);
    }

    return res.json({
      success: true,
      count: days.length,
      days,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addItineraryDay = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { dayNumber, title, cityName, date } = req.body;

    const existingDays = DataStore.find('itineraryDays', { tripId });
    const nextDayNum = dayNumber || existingDays.length + 1;

    const newDay = {
      id: `day-${tripId}-${nextDayNum}`,
      tripId,
      dayNumber: nextDayNum,
      date: date || new Date(Date.now() + 86400000 * (nextDayNum - 1)).toISOString().split('T')[0],
      cityName: cityName || 'City Stop',
      title: title || `Day ${nextDayNum} Exploration`,
      weather: { condition: 'Sunny', temp: 28, icon: 'Sun' },
      activities: [],
      notes: '',
    };

    if (getIsMongoConnected()) {
      try {
        await ItineraryDay.create(newDay);
      } catch (e) {}
    }

    DataStore.insert('itineraryDays', newDay);

    return res.status(201).json({
      success: true,
      message: `Added Day ${nextDayNum} to itinerary`,
      day: newDay,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteItineraryDay = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsMongoConnected()) {
      try {
        await ItineraryDay.findByIdAndDelete(id);
      } catch (e) {}
    }

    DataStore.findByIdAndDelete('itineraryDays', id);

    return res.json({
      success: true,
      message: 'Day removed from itinerary',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addActivity = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { dayNumber, title, name, category, startTime, time, durationMinutes, cost, estimatedCost, location, notes } = req.body;

    const targetDayNum = Number(dayNumber) || 1;
    let day = DataStore.findOne('itineraryDays', { tripId, dayNumber: targetDayNum });

    if (!day) {
      day = DataStore.insert('itineraryDays', {
        id: `day-${tripId}-${targetDayNum}`,
        tripId,
        dayNumber: targetDayNum,
        date: new Date().toISOString().split('T')[0],
        cityName: location || 'City Stop',
        title: `Day ${targetDayNum}`,
        activities: [],
      });
    }

    const activityId = `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newActivity = {
      id: activityId,
      activityId,
      title: title || name || 'New Activity',
      name: title || name || 'New Activity',
      category: category || 'Sightseeing',
      time: time || startTime || '10:00',
      startTime: time || startTime || '10:00',
      durationMinutes: Number(durationMinutes) || 90,
      cost: Number(cost || estimatedCost) || 500,
      estimatedCost: Number(cost || estimatedCost) || 500,
      location: location || '',
      notes: notes || '',
      completed: false,
    };

    const currentActivities = day.activities || [];
    currentActivities.push(newActivity);

    DataStore.findByIdAndUpdate('itineraryDays', day.id, { activities: currentActivities });

    return res.status(201).json({
      success: true,
      message: `Activity "${newActivity.title}" added to Day ${targetDayNum}`,
      activity: newActivity,
      day: { ...day, activities: currentActivities },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateActivity = async (req, res) => {
  try {
    const { id } = req.params; // activityId or dayId
    const updates = req.body;

    const allDays = DataStore.getCollection('itineraryDays');
    let updatedActivity = null;
    let foundDay = null;

    for (const day of allDays) {
      if (day.activities && day.activities.length) {
        const actIndex = day.activities.findIndex(
          (a) => a.id === id || a.activityId === id || a._id === id
        );
        if (actIndex !== -1) {
          foundDay = day;
          day.activities[actIndex] = {
            ...day.activities[actIndex],
            ...updates,
            title: updates.title || updates.name || day.activities[actIndex].title,
            name: updates.title || updates.name || day.activities[actIndex].name,
          };
          updatedActivity = day.activities[actIndex];
          break;
        }
      }
    }

    if (foundDay) {
      DataStore.findByIdAndUpdate('itineraryDays', foundDay.id, { activities: foundDay.activities });
      return res.json({
        success: true,
        message: 'Activity updated successfully',
        activity: updatedActivity,
      });
    }

    return res.json({
      success: true,
      message: 'Activity updated',
      activity: { id, ...updates },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const allDays = DataStore.getCollection('itineraryDays');
    let deleted = false;

    for (const day of allDays) {
      if (day.activities && day.activities.length) {
        const initialLen = day.activities.length;
        day.activities = day.activities.filter(
          (a) => a.id !== id && a.activityId !== id && a._id !== id
        );
        if (day.activities.length < initialLen) {
          DataStore.findByIdAndUpdate('itineraryDays', day.id, { activities: day.activities });
          deleted = true;
          break;
        }
      }
    }

    return res.json({
      success: true,
      message: deleted ? 'Activity removed from schedule' : 'Activity not found',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleActivityCompleted = async (req, res) => {
  try {
    const { id } = req.params;

    const allDays = DataStore.getCollection('itineraryDays');
    let updatedStatus = false;

    for (const day of allDays) {
      if (day.activities && day.activities.length) {
        const act = day.activities.find(
          (a) => a.id === id || a.activityId === id || a._id === id
        );
        if (act) {
          act.completed = !act.completed;
          updatedStatus = act.completed;
          DataStore.findByIdAndUpdate('itineraryDays', day.id, { activities: day.activities });
          break;
        }
      }
    }

    return res.json({
      success: true,
      message: updatedStatus ? 'Activity marked as completed' : 'Activity unmarked',
      completed: updatedStatus,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const reorderActivities = async (req, res) => {
  try {
    const { dayId } = req.params;
    const { activities } = req.body;

    if (dayId && activities) {
      DataStore.findByIdAndUpdate('itineraryDays', dayId, { activities });
    }

    return res.json({
      success: true,
      message: 'Schedule reordered successfully',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getTripItinerary,
  addItineraryDay,
  deleteItineraryDay,
  addActivity,
  updateActivity,
  deleteActivity,
  toggleActivityCompleted,
  reorderActivities,
};
