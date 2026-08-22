import express from 'express';
import {
  getNotifications,
  markNotificationRead,
  clearNotifications,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getNotifications);
router.put('/:id/read', protect, markNotificationRead);
router.post('/clear', protect, clearNotifications);

export default router;
