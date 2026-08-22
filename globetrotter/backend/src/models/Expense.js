import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide an expense title'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['Flights', 'Accommodation', 'Food', 'Food & Dining', 'Transportation', 'Transport', 'Activities', 'Shopping', 'Other'],
      default: 'Other',
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an expense amount'],
    },
    currency: {
      type: String,
      default: 'INR',
    },
    date: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
