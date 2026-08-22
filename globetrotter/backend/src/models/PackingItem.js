import mongoose from 'mongoose';

const packingItemSchema = new mongoose.Schema(
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
    name: {
      type: String,
      required: [true, 'Please provide packing item name'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['Clothing', 'Toiletries', 'Electronics', 'Documents', 'Health', 'Gear', 'Other'],
      default: 'Clothing',
    },
    quantity: {
      type: Number,
      default: 1,
    },
    packed: {
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

export const PackingItem = mongoose.model('PackingItem', packingItemSchema);
export default PackingItem;
