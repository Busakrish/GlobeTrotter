import express from 'express';
import {
  getTripChecklists,
  addChecklistItem,
  toggleChecklistItem,
  deleteChecklistItem,
} from '../controllers/checklistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/trips/:tripId/checklists', getTripChecklists);
router.post('/trips/:tripId/checklists', protect, addChecklistItem);
router.put('/checklists/:id/toggle', protect, toggleChecklistItem);
router.delete('/checklists/:id', protect, deleteChecklistItem);

export default router;
