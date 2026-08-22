import express from 'express';
import {
  getDestinations,
  getDestinationById,
  saveDestination,
  unsaveDestination,
  getSavedDestinations,
} from '../controllers/destinationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getDestinations);
router.get('/saved', protect, getSavedDestinations);
router.get('/:id', getDestinationById);
router.post('/:id/save', protect, saveDestination);
router.delete('/:id/save', protect, unsaveDestination);
router.delete('/saved/:id', protect, unsaveDestination);

export default router;
