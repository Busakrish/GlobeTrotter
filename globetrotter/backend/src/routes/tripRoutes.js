import express from 'express';
import {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  duplicateTrip,
  addStopToTrip,
} from '../controllers/tripController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getTrips)
  .post(protect, createTrip);

router.route('/:id')
  .get(getTripById)
  .put(protect, updateTrip)
  .delete(protect, deleteTrip);

router.post('/:id/duplicate', protect, duplicateTrip);
router.post('/:id/stops', protect, addStopToTrip);

export default router;
