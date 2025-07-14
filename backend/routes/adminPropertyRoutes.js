import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getPendingProperties, updateproductApproval } from '../controller/adminController.js';

const router = express.Router();

// Get properties pending approval
router.get('/pending-properties', protect, admin, getPendingProperties);

// Approve or reject a product
router.post('/product-approval', protect, admin, updateproductApproval);

export default router;
