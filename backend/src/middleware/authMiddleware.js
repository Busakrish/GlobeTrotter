import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'globetrotter_secret_jwt_key_2026_secure'
      );

      // Try finding user in MongoDB
      try {
        req.user = await User.findById(decoded.id).select('-password');
      } catch (dbErr) {
        // Fallback for demo or in-memory mode
        req.user = {
          _id: decoded.id,
          id: decoded.id,
          name: decoded.name || 'Demo Traveler',
          email: decoded.email || 'demo@globetrotter.io',
          role: decoded.role || 'traveler',
        };
      }

      if (!req.user) {
        req.user = {
          _id: decoded.id,
          id: decoded.id,
          name: decoded.name || 'Demo Traveler',
          email: decoded.email || 'demo@globetrotter.io',
          role: decoded.role || 'traveler',
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
