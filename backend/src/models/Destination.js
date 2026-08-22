import mongoose from 'mongoose';

const attractionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String },
  cost: { type: Number, default: 0 },
  timeNeeded: { type: String, default: '2-3 hours' },
  rating: { type: Number, default: 4.8 },
});

const hiddenGemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  crowdLevel: { type: String, default: 'Low (Hidden)' },
  estimatedCost: { type: Number, default: 400 },
  bestTime: { type: String, default: 'Early morning or golden hour' },
  whyVisit: { type: String, required: true },
  description: { type: String, default: '' },
  image: { type: String },
});

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cuisine: { type: String, default: 'Local Cuisine' },
  rating: { type: Number, default: 4.8 },
  price: { type: String, default: '$$' },
});

const localModeSchema = new mongoose.Schema({
  phrases: [
    {
      phrase: { type: String, required: true },
      translation: { type: String, required: true },
      pronunciation: { type: String },
    },
  ],
  culturalEtiquette: { type: [String], default: [] },
  tippingCustoms: { type: String, default: '10% standard in restaurants' },
  transportationTips: { type: String, default: 'Metro and pre-paid taxis recommended' },
  emergencyContacts: {
    police: { type: String, default: '112 / 100' },
    ambulance: { type: String, default: '108 / 102' },
    touristHelpline: { type: String, default: '1363' },
  },
});

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide destination name'],
      unique: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'trending',
    },
    secondaryCategories: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      default: '',
    },
    image: {
      type: String,
      required: true,
    },
    bannerImage: {
      type: String,
    },
    images: {
      type: [String],
      default: [],
    },
    bestTimeToVisit: {
      type: [String],
      default: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
    },
    bestMonths: {
      type: [String],
      default: ['October to March'],
    },
    averageBudget: {
      type: Number,
      default: 4500,
    },
    avgDailyCost: {
      type: Number,
      default: 4500,
    },
    costIndex: {
      type: String,
      enum: ['$', '$$', '$$$', '$$$$'],
      default: '$$',
    },
    travelStyle: {
      type: String,
      default: 'Balanced',
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    reviewsCount: {
      type: Number,
      default: 1420,
    },
    tags: {
      type: [String],
      default: [],
    },
    attractions: [attractionSchema],
    popularPlaces: [attractionSchema],
    hiddenGems: [hiddenGemSchema],
    restaurants: [restaurantSchema],
    activities: {
      type: [String],
      default: [],
    },
    travelTips: {
      type: [String],
      default: [],
    },
    localMode: localModeSchema,
    latitude: {
      type: Number,
      default: 18.9220,
    },
    longitude: {
      type: Number,
      default: 72.8347,
    },
    coordinates: {
      type: [Number],
      default: [18.9220, 72.8347],
    },
  },
  {
    timestamps: true,
  }
);

export const Destination = mongoose.model('Destination', destinationSchema);
export default Destination;
