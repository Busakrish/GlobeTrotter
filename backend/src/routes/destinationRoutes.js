import express from 'express';
import {
  getDestinations,
  getDestinationById,
  saveDestination,
  unsaveDestination,
  getSavedDestinations,
  getCities,
  getActivities,
} from '../controllers/destinationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getDestinations);
router.get('/cities', getCities);
router.get('/activities', getActivities);
router.get('/saved', protect, getSavedDestinations);
router.get('/:id', getDestinationById);
router.post('/:id/save', protect, saveDestination);
router.delete('/:id/save', protect, unsaveDestination);
router.delete('/saved/:id', protect, unsaveDestination);

export default router;
