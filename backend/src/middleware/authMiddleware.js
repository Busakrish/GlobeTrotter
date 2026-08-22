import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import DataStore from '../config/dataStore.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Handle demo tokens seamlessly
      if (token && (token.startsWith('demo-') || token === 'demo-token')) {
        const isAdmin = token.includes('admin');
        const defaultId = isAdmin ? 'user-admin' : 'user-priya-sharma';
        const defaultName = isAdmin ? 'Alex Rivera (Admin)' : 'Priya Sharma';
        const defaultEmail = isAdmin ? 'admin@globetrotter.io' : 'priya.sharma@globetrotter.io';
        const role = isAdmin ? 'admin' : 'traveler';

        const storeUser = DataStore.findById('users', defaultId) || DataStore.findOne('users', { email: defaultEmail });
        req.user = {
          _id: storeUser?.id || storeUser?._id || defaultId,
          id: storeUser?.id || storeUser?._id || defaultId,
          name: storeUser?.name || defaultName,
          email: storeUser?.email || defaultEmail,
          role: storeUser?.role || role,
        };
        return next();
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'globetrotter_secret_jwt_key_2026_secure'
      );

      // Try finding user in MongoDB
      try {
        req.user = await User.findById(decoded.id).select('-password');
      } catch (dbErr) {
        // Fallback for demo or in-memory mode
        const storeUser = DataStore.findById('users', decoded.id) || DataStore.findOne('users', { email: decoded.email });
        req.user = {
          _id: decoded.id,
          id: decoded.id,
          name: storeUser?.name || decoded.name || 'Demo Traveler',
          email: storeUser?.email || decoded.email || 'demo@globetrotter.io',
          role: storeUser?.role || decoded.role || 'traveler',
        };
      }

      if (!req.user) {
        const storeUser = DataStore.findById('users', decoded.id) || DataStore.findOne('users', { email: decoded.email });
        req.user = {
          _id: decoded.id,
          id: decoded.id,
          name: storeUser?.name || decoded.name || 'Demo Traveler',
          email: storeUser?.email || decoded.email || 'demo@globetrotter.io',
          role: storeUser?.role || decoded.role || 'traveler',
        };
      }

      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, invalid or expired token',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided',
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Forbidden: Administrator privileges required',
    });
  }
};

export default { protect, adminOnly };
