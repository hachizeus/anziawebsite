import express from 'express';
import {
  getUserProfile,
  updateUserProfile
} from '../controller/Usercontroller.js';

// Simple middleware for now
const protect = (req, res, next) => {
  // TODO: Implement JWT verification
  next();
};

const adminOnly = (req, res, next) => {
  // TODO: Implement admin check
  next();
};

const router = express.Router();

// Protected routes
router.use(protect);

// Get current user profile
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);

export default router;