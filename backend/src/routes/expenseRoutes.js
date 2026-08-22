import express from 'express';
import {
  getTripExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from '../controllers/expenseController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/trips/:tripId/expenses', getTripExpenses);
router.post('/trips/:tripId/expenses', protect, addExpense);
router.put('/expenses/:id', protect, updateExpense);
router.delete('/expenses/:id', protect, deleteExpense);

export default router;
