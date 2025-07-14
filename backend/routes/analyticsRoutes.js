import express from 'express';
import { 
  getDashboardStats,
  getFinancialAnalytics,
  getproductAnalytics
} from '../controller/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All routes are protected and admin-only
router.use(protect);
router.use(adminOnly);

// Analytics endpoints
router.get('/dashboard', getDashboardStats);
router.get('/financial', getFinancialAnalytics);
router.get('/product', getproductAnalytics);

export default router;
