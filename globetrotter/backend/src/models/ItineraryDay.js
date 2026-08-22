import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  activityId: { type: String, default: () => 'act-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4) },
  name: { type: String, required: true },
  title: { type: String },
  description: { type: String, default: '' },
  location: { type: String, default: '' },
  startTime: { type: String, default: '10:00' },
  endTime: { type: String, default: '12:00' },
  time: { type: String, default: '10:00' },
  durationMinutes: { type: Number, default: 90 },
  category: {
    type: String,
    enum: ['Sightseeing', 'Food & Dining', 'Transport', 'Adventure', 'Shopping', 'Relaxation', 'Notes', 'Other'],
    default: 'Sightseeing',
  },
  estimatedCost: { type: Number, default: 500 },
  cost: { type: Number, default: 500 },
  latitude: { type: Number },
  longitude: { type: Number },
  notes: { type: String, default: '' },
  completed: { type: Boolean, default: false },
});

const itineraryDaySchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
      required: true,
    },
    dayNumber: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    cityName: {
      type: String,
      default: 'City',
    },
    title: {
      type: String,
      default: '',
    },
    weather: {
      condition: { type: String, default: 'Sunny' },
      temp: { type: Number, default: 28 },
      icon: { type: String, default: 'Sun' },
    },
    activities: [activitySchema],
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const ItineraryDay = mongoose.model('ItineraryDay', itineraryDaySchema);
export default ItineraryDay;
