import express from 'express';
import { getUserProfile, updateUserProfile, updateTravelPersonality } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/personality', protect, updateTravelPersonality);

export default router;
