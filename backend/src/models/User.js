import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 6,
      select: false,
    },
    profileImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    country: {
      type: String,
      default: 'India',
    },
    bio: {
      type: String,
      default: 'Passionate multi-city traveler exploring cultural heritage & vibrant food trails.',
    },
    travelStyle: {
      type: String,
      default: 'Balanced Explorer',
    },
    travelInterests: {
      type: [String],
      default: ['Culture', 'Food', 'Relaxation', 'Photography'],
    },
    travelPersonality: {
      primaryArchetype: {
        type: String,
        default: 'The Cultural Explorer',
      },
      tagline: {
        type: String,
        default: 'Loves discovering local heritage, authentic dining, and hidden alleyways.',
      },
      scores: {
        adventure: { type: Number, default: 35 },
        culture: { type: Number, default: 85 },
        food: { type: Number, default: 75 },
        nature: { type: Number, default: 50 },
        relaxation: { type: Number, default: 60 },
        shopping: { type: Number, default: 40 },
        budget: { type: Number, default: 65 },
        luxury: { type: Number, default: 45 },
      },
    },
    preferredCurrency: {
      type: String,
      default: 'INR',
      enum: ['INR', 'USD', 'EUR'],
    },
    language: {
      type: String,
      default: 'English (US)',
    },
    notificationPreferences: {
      tripReminders: { type: Boolean, default: true },
      budgetAlerts: { type: Boolean, default: true },
      recommendations: { type: Boolean, default: true },
      activityReminders: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
export default User;
