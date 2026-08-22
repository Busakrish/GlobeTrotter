import mongoose from 'mongoose';

const savedPlaceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    destinationId: {
      type: String,
    },
    name: {
      type: String,
      required: [true, 'Please provide place name'],
      trim: true,
    },
    country: {
      type: String,
      default: 'India',
    },
    type: {
      type: String,
      enum: ['Destination', 'Attraction', 'Restaurant', 'Activity', 'Hidden Gem', 'Other'],
      default: 'Destination',
    },
    description: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
    },
    location: {
      type: String,
      default: '',
    },
    coordinates: {
      type: [Number],
      default: [18.9220, 72.8347],
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    avgCost: {
      type: Number,
      default: 3500,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate saved places for the same user
savedPlaceSchema.index({ userId: 1, name: 1 }, { unique: true });

export const SavedPlace = mongoose.model('SavedPlace', savedPlaceSchema);
export default SavedPlace;
