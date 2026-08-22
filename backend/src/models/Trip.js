import mongoose from 'mongoose';

const tripStopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, default: 'India' },
  coordinates: { type: [Number], default: [18.9220, 72.8347] },
  nights: { type: Number, default: 2 },
  arrivalDate: { type: String },
  departureDate: { type: String },
  transitToNext: {
    toCity: { type: String },
    mode: { type: String, default: 'Express Train' },
    durationMinutes: { type: Number, default: 180 },
    durationText: { type: String, default: '3h 00m' },
    departureTime: { type: String, default: '10:00' },
    arrivalTime: { type: String, default: '13:00' },
    cost: { type: Number, default: 1200 },
  },
});

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a trip name'],
      trim: true,
    },
    destination: {
      type: String,
      default: 'Multi-City Route',
    },
    country: {
      type: String,
      default: 'India',
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    durationDays: {
      type: Number,
      default: 5,
    },
    travelers: {
      type: Number,
      default: 2,
    },
    budget: {
      type: Number,
      default: 50000,
    },
    budgetBreakdown: {
      flights: { type: Number, default: 12500 },
      accommodation: { type: Number, default: 17500 },
      food: { type: Number, default: 7500 },
      transportation: { type: Number, default: 5000 },
      activities: { type: Number, default: 5000 },
      shopping: { type: Number, default: 2500 },
    },
    currency: {
      type: String,
      default: 'INR',
    },
    travelStyle: {
      type: String,
      default: 'Moderate',
    },
    interests: {
      type: [String],
      default: ['Culture', 'Food', 'Relaxation'],
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'planning', 'Upcoming', 'Ongoing', 'Completed', 'Planning'],
      default: 'upcoming',
    },
    description: {
      type: String,
      default: 'Personalized multi-city journey with scheduled stops and budget tracking.',
    },
    cities: [tripStopSchema],
    isPublic: {
      type: Boolean,
      default: false,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Trip = mongoose.model('Trip', tripSchema);
export default Trip;
