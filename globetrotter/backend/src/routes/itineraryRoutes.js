import express from 'express';
import {
  getTripItinerary,
  addItineraryDay,
  deleteItineraryDay,
  addActivity,
  updateActivity,
  deleteActivity,
  toggleActivityCompleted,
  reorderActivities,
} from '../controllers/itineraryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

// Trip-nested routes
router.get('/trips/:tripId/itinerary', getTripItinerary);
router.post('/trips/:tripId/days', protect, addItineraryDay);
router.post('/trips/:tripId/activities', protect, addActivity);
router.post('/trips/:tripId/days/:dayNumber/activities', protect, addActivity);

// Direct item routes
router.put('/activities/:id', protect, updateActivity);
router.delete('/activities/:id', protect, deleteActivity);
router.post('/activities/:id/toggle', protect, toggleActivityCompleted);
router.delete('/days/:id', protect, deleteItineraryDay);
router.post('/days/:dayId/reorder', protect, reorderActivities);

export default router;
