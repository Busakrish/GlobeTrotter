import express from 'express';
import {
  getGroupTrips,
  getGroupTripById,
  createGroupTrip,
  updateGroupTrip,
  addGroupMember,
  removeGroupMember,
  getGroupMemories,
  createGroupMemory,
  deleteGroupMemory,
  toggleMemoryLike,
} from '../controllers/groupJournalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getGroupTrips)
  .post(protect, createGroupTrip);

router.route('/:groupId')
  .get(protect, getGroupTripById)
  .put(protect, updateGroupTrip);

router.route('/:groupId/members')
  .post(protect, addGroupMember);

router.route('/:groupId/members/:userId')
  .delete(protect, removeGroupMember);

router.route('/:groupId/memories')
  .get(protect, getGroupMemories)
  .post(protect, createGroupMemory);

router.route('/:groupId/memories/:memoryId')
  .delete(protect, deleteGroupMemory);

router.route('/:groupId/memories/:memoryId/like')
  .post(protect, toggleMemoryLike);

export default router;
