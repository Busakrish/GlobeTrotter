import express from 'express';
import { getUserProfile, updateUserProfile, updateTravelPersonality, searchUsers } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/search', protect, searchUsers);
router.get('/', protect, searchUsers);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/personality', protect, updateTravelPersonality);

export default router;
