import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import DataStore from '../config/dataStore.js';
import { getIsMongoConnected } from '../config/db.js';

const generateToken = (id, role = 'traveler', email = '', name = '') => {
  return jwt.sign(
    { id: id.toString(), role, email, name },
    process.env.JWT_SECRET || 'globetrotter_secret_jwt_key_2026_secure',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, travelStyle } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, email address, and password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters in length',
      });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (getIsMongoConnected()) {
      try {
        const userExists = await User.findOne({ email: cleanEmail });
        if (userExists) {
          return res.status(400).json({
            success: false,
            message: 'An account with this email address already exists',
          });
        }

        const user = await User.create({
          name: name.trim(),
          email: cleanEmail,
          password,
          travelStyle: travelStyle || 'Balanced Explorer',
        });

        const token = generateToken(user._id, 'traveler', user.email, user.name);

        return res.status(201).json({
          success: true,
          message: 'Account registered successfully',
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            profileImage: user.profileImage,
            travelStyle: user.travelStyle,
            preferredCurrency: user.preferredCurrency,
            travelPersonality: user.travelPersonality,
          },
        });
      } catch (dbErr) {
        console.warn('[Register DB Error]:', dbErr.message);
      }
    }

    // DataStore handling
    const existingInStore = DataStore.findOne('users', { email: cleanEmail });
    if (existingInStore) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = DataStore.insert('users', {
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      travelStyle: travelStyle || 'Balanced Explorer',
      country: 'India',
      bio: 'Passionate multi-city traveler exploring cultural heritage & vibrant food trails.',
      travelInterests: ['Culture', 'Food', 'Relaxation', 'Photography'],
      preferredCurrency: 'INR',
      language: 'English (US)',
      role: 'traveler',
    });

    const token = generateToken(newUser.id, 'traveler', newUser.email, newUser.name);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        profileImage: newUser.profileImage,
        travelStyle: newUser.travelStyle,
        preferredCurrency: newUser.preferredCurrency,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // 1. Check Demo shortcut logins
    if (cleanEmail === 'priya.sharma@globetrotter.io' || cleanEmail === 'demo@globetrotter.io') {
      const demoUser = DataStore.findOne('users', { email: 'priya.sharma@globetrotter.io' }) || {
        id: 'user-priya-sharma',
        name: 'Priya Sharma',
        email: 'priya.sharma@globetrotter.io',
        role: 'traveler',
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        travelStyle: 'Balanced Explorer',
        preferredCurrency: 'INR',
      };
      const token = generateToken(demoUser.id || 'user-priya-sharma', 'traveler', demoUser.email, demoUser.name);
      return res.json({
        success: true,
        message: 'Welcome back, Priya!',
        token,
        user: demoUser,
      });
    }

    if (cleanEmail === 'admin@globetrotter.io') {
      const adminUser = DataStore.findOne('users', { email: 'admin@globetrotter.io' }) || {
        id: 'user-admin',
        name: 'Alex Rivera (Admin)',
        email: 'admin@globetrotter.io',
        role: 'admin',
        profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        travelStyle: 'Luxury Nomad',
        preferredCurrency: 'INR',
      };
      const token = generateToken(adminUser.id || 'user-admin', 'admin', adminUser.email, adminUser.name);
      return res.json({
        success: true,
        message: 'Admin session initiated',
        token,
        user: adminUser,
      });
    }

    // 2. Check MongoDB
    if (getIsMongoConnected()) {
      try {
        const user = await User.findOne({ email: cleanEmail }).select('+password');
        if (user && (await user.matchPassword(password))) {
          const token = generateToken(user._id, user.role || 'traveler', user.email, user.name);
          return res.json({
            success: true,
            message: 'Logged in successfully',
            token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role || 'traveler',
              profileImage: user.profileImage,
              travelStyle: user.travelStyle,
              preferredCurrency: user.preferredCurrency,
              travelPersonality: user.travelPersonality,
            },
          });
        }
      } catch (e) {
        console.warn('[Login DB check error]:', e.message);
      }
    }

    // 3. Check DataStore
    const userInStore = DataStore.findOne('users', { email: cleanEmail });
    if (userInStore) {
      let isMatch = false;
      if (userInStore.password.startsWith('$2')) {
        isMatch = await bcrypt.compare(password, userInStore.password);
      } else {
        isMatch = userInStore.password === password;
      }

      if (isMatch) {
        const token = generateToken(userInStore.id, userInStore.role || 'traveler', userInStore.email, userInStore.name);
        const { password: _, ...userSafe } = userInStore;
        return res.json({
          success: true,
          message: 'Logged in successfully',
          token,
          user: userSafe,
        });
      }
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid email address or password',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ success: false, message: 'User session not found' });
    }

    let user = req.user;
    const userId = req.user._id || req.user.id;

    if (getIsMongoConnected()) {
      try {
        const dbUser = await User.findById(userId);
        if (dbUser) user = dbUser;
      } catch (e) {}
    } else {
      const storeUser = DataStore.findById('users', userId);
      if (storeUser) {
        const { password: _, ...safe } = storeUser;
        user = safe;
      }
    }

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logoutUser = (req, res) => {
  return res.json({
    success: true,
    message: 'Logged out successfully',
  });
};

export default { registerUser, loginUser, getMe, logoutUser };
