import mongoose from 'mongoose';

const journalHighlightSchema = new mongoose.Schema({
  day: { type: Number, default: 1 },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: String, default: 'Sparkles' },
  location: { type: String, default: '' },
  photo: { type: String },
});

const travelJournalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide journal title'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    },
    photos: {
      type: [String],
      default: [],
    },
    locations: {
      type: [String],
      default: [],
    },
    highlights: [journalHighlightSchema],
    rating: {
      type: Number,
      default: 5,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const TravelJournal = mongoose.model('TravelJournal', travelJournalSchema);
export default TravelJournal;
