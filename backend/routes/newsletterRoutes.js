import express from 'express';
import { getSubscribers, sendNewsletter, removeSubscriber } from '../controller/newsletterController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin only routes
router.get('/subscribers', protect, admin, getSubscribers);
router.post('/send', protect, admin, sendNewsletter);
router.delete('/subscribers/:subscriberId', protect, admin, removeSubscriber);

export default router;
