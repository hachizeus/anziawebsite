import express from 'express';
const router = express.Router();
import * as trackingController from '../controller/trackingController.js';
import { protect } from '../middleware/authMiddleware.js';

// Optional auth middleware - will use user ID if authenticated, session ID otherwise
const optionalAuth = (req, res, next) => {
  try {
    protect(req, res, next);
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Track user action
router.post('/track', optionalAuth, trackingController.trackAction);

// Get recently viewed products
router.get('/recently-viewed', optionalAuth, trackingController.getRecentlyViewed);

// Get cart items
router.get('/cart', optionalAuth, trackingController.getCartItems);

// Create order
router.post('/order', optionalAuth, trackingController.createOrder);

export default router;