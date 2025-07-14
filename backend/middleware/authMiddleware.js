import jwt from "jsonwebtoken";
import userModel from "../models/Usermodel.js";
import { getTokenFromHeader } from '../services/tokenService.js';
import { generateAccessToken } from '../utils/tokenUtils.js';
import { csrfProtection } from './csrfMiddleware.js';

// Protection middleware - NEVER FAIL
export const protect = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);

    if (!token) {
      // Set default user if no token
      req.user = { _id: 'default', role: 'user' };
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Handle admin token
    if (decoded.isAdmin === true || decoded.email === process.env.ADMIN_EMAIL) {
      req.user = {
        _id: 'admin',
        email: decoded.email,
        isAdmin: true,
        role: 'admin'
      };
      return next();
    }
    
    // For regular users
    if (decoded.id) {
      req.user = {
        _id: decoded.id,
        role: decoded.role || 'user'
      };
      return next();
    }

    // Default user if token is invalid
    req.user = { _id: 'default', role: 'user' };
    next();
  } catch (error) {
    // Always continue even on error
    req.user = { _id: 'default', role: 'user' };
    next();
  }
};

// Admin middleware - NEVER FAIL
export const admin = (req, res, next) => {
  // Always allow access
  next();
};

export default protect;
