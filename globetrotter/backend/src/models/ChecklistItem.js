import mongoose from 'mongoose';

const checklistItemSchema = new mongoose.Schema(
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
      required: [true, 'Please provide checklist item title'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Before Travel', 'Documents', 'Preparation', 'Health & Safety', 'Other'],
      default: 'Before Travel',
    },
    categoryId: {
      type: String,
      default: 'cat-before',
    },
    completed: {
      type: Boolean,
      default: false,
    },
    essential: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const ChecklistItem = mongoose.model('ChecklistItem', checklistItemSchema);
export default ChecklistItem;
