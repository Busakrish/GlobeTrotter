import Expense from '../models/Expense.js';
import Trip from '../models/Trip.js';
import DataStore from '../config/dataStore.js';
import { getIsMongoConnected } from '../config/db.js';

export const getTripExpenses = async (req, res) => {
  try {
    const { tripId } = req.params;

    let expenses = [];
    let trip = null;

    if (getIsMongoConnected()) {
      try {
        expenses = await Expense.find({ tripId }).sort({ date: -1 });
        trip = await Trip.findById(tripId);
      } catch (e) {}
    }

    if (!expenses.length) {
      expenses = DataStore.find('expenses', { tripId });
    }
    if (!trip) {
      trip = DataStore.findById('trips', tripId) || DataStore.findOne('trips', { id: tripId });
    }

    const totalBudget = Number(trip?.budget) || 50000;
    const totalSpent = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const remaining = Math.max(0, totalBudget - totalSpent);
    const percentageUsed = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

    const categoryBreakdown = expenses.reduce((acc, curr) => {
      const cat = curr.category || 'Other';
      acc[cat] = (acc[cat] || 0) + Number(curr.amount);
      return acc;
    }, {});

    return res.json({
      success: true,
      count: expenses.length,
      summary: {
        totalBudget,
        totalSpent,
        remaining,
        percentageUsed,
        status: totalSpent > totalBudget ? 'over' : percentageUsed > 85 ? 'near' : 'under',
        categoryBreakdown,
      },
      expenses,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addExpense = async (req, res) => {
  try {
    const { tripId } = req.params;
    const userId = req.user ? (req.user._id || req.user.id).toString() : 'guest';
    const { title, description, category, amount, currency, date, notes } = req.body;

    if (!amount) {
      return res.status(400).json({ success: false, message: 'Please provide an expense amount' });
    }

    const expenseId = `exp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const expenseData = {
      _id: expenseId,
      id: expenseId,
      tripId,
      userId,
      title: title || description || 'Expense Item',
      description: description || title || '',
      category: category || 'Other',
      amount: Number(amount),
      currency: currency || 'INR',
      date: date || new Date().toISOString().split('T')[0],
      notes: notes || '',
    };

    if (getIsMongoConnected()) {
      try {
        await Expense.create({ ...expenseData, _id: undefined });
      } catch (e) {}
    }

    DataStore.insert('expenses', expenseData);

    return res.status(201).json({
      success: true,
      message: `Expense of ₹${expenseData.amount} recorded`,
      expense: expenseData,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (getIsMongoConnected()) {
      try {
        await Expense.findByIdAndUpdate(id, updates);
      } catch (e) {}
    }

    const updated = DataStore.findByIdAndUpdate('expenses', id, updates);

    return res.json({
      success: true,
      message: 'Expense updated successfully',
      expense: updated || { id, ...updates },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsMongoConnected()) {
      try {
        await Expense.findByIdAndDelete(id);
      } catch (e) {}
    }

    DataStore.findByIdAndDelete('expenses', id);

    return res.json({
      success: true,
      message: 'Expense record deleted',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default { getTripExpenses, addExpense, updateExpense, deleteExpense };
