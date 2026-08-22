import mongoose from 'mongoose';

const groupMemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  name: { type: String, required: true },
  email: { type: String },
  role: { type: String, enum: ['owner', 'editor', 'viewer'], default: 'editor' },
  budget: { type: Number, default: 45000 },
  travelStyle: { type: String, default: 'Balanced Explorer' },
  interests: { type: [String], default: ['Culture', 'Food'] },
  foodPreferences: { type: [String], default: ['Local Cuisine', 'Street Food'] },
  activityPreferences: { type: [String], default: ['Sightseeing', 'Photography'] },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80' },
  joinedAt: { type: Date, default: Date.now },
});

const groupTripSchema = new mongoose.Schema(
  {
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip',
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide group trip name'],
      trim: true,
    },
    inviteCode: {
      type: String,
      unique: true,
      default: () => 'GLOBE-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
    },
    members: [groupMemberSchema],
    compatibilityScore: {
      type: Number,
      default: 88,
    },
    recommendedDestination: {
      type: String,
      default: 'Goa & Western Ghats',
    },
    recommendedActivities: {
      type: [String],
      default: ['Sunset Beach Cruise', 'Heritage Spice Plantation Walk', 'Old Latin Quarter Cafe Crawl'],
    },
    recommendedBudget: {
      type: Number,
      default: 45000,
    },
    compatibilityBreakdown: {
      budgetAlignment: { type: Number, default: 92 },
      paceAlignment: { type: Number, default: 85 },
      interestOverlap: { type: Number, default: 88 },
    },
  },
  {
    timestamps: true,
  }
);

export const GroupTrip = mongoose.model('GroupTrip', groupTripSchema);
export default GroupTrip;
