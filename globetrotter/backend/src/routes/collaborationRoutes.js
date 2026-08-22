import express from 'express';
import {
  getTripCollaborators,
  addCollaborator,
  removeCollaborator,
} from '../controllers/collaborationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/trips/:tripId/collaborators', getTripCollaborators);
router.post('/trips/:tripId/collaborators', protect, addCollaborator);
router.delete('/trips/:tripId/collaborators/:userId', protect, removeCollaborator);

export default router;
