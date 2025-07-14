import express from 'express';
import { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  getUnreadCount
} from '../controller/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Get all notifications for the current user
router.get('/', getUserNotifications);

// Get unread notification count
router.get('/unread-count', getUnreadCount);

// Mark notification as read
router.put('/:notificationId/read', markNotificationAsRead);

// Mark all notifications as read
router.put('/mark-all-read', markAllNotificationsAsRead);

export default router;
