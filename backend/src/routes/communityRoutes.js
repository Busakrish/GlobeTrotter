import express from 'express';
import {
  getPublicTrips,
  getPublicTripByShareId,
  forkTrip,
  likeTrip,
} from '../controllers/communityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/trips', getPublicTrips);
router.get('/trips/:shareId', getPublicTripByShareId);
router.post('/trips/:tripId/fork', protect, forkTrip);
router.post('/trips/:tripId/like', likeTrip);

export default router;
