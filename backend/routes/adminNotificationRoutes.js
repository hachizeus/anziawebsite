import express from 'express';
import mongoose from 'mongoose';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getNotifications, markAsRead, markAllAsRead, createTestNotification } from '../controller/adminNotificationController.js';

const router = express.Router();

// Get all notifications
router.get('/', protect, admin, getNotifications);

// Mark notification as read
router.put('/:id/read', protect, admin, markAsRead);

// Mark all notifications as read
router.put('/read-all', protect, admin, markAllAsRead);

// Test endpoint to create a notification
router.post('/test', protect, admin, createTestNotification);

// Debug endpoint to check database connection
router.get('/debug', protect, admin, async (req, res) => {
  try {
    const AdminNotification = mongoose.model('AdminNotification');
    const count = await AdminNotification.countDocuments();
    const sample = await AdminNotification.find().limit(5);
    
    res.json({
      success: true,
      message: 'Database connection successful',
      count,
      sample
    });
  } catch (error) {
    console.error('Database debug error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection error',
      error: error.message
    });
  }
});

// Direct debug endpoint without authentication for testing
router.get('/public-debug', async (req, res) => {
  try {
    const AdminNotification = mongoose.model('AdminNotification');
    const count = await AdminNotification.countDocuments();
    const allNotifications = await AdminNotification.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      message: 'Database connection successful',
      count,
      notifications: allNotifications
    });
  } catch (error) {
    console.error('Public debug error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection error',
      error: error.message
    });
  }
});

// Force refresh notifications endpoint
router.get('/force-refresh', async (req, res) => {
  try {
    const AdminNotification = mongoose.model('AdminNotification');
    const notifications = await AdminNotification.find().sort({ createdAt: -1 });
    const unreadCount = await AdminNotification.countDocuments({ isRead: false });
    
    // Set cache control headers
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    res.json({
      success: true,
      message: 'Notifications refreshed',
      notifications,
      unreadCount
    });
  } catch (error) {
    console.error('Error refreshing notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error refreshing notifications',
      error: error.message
    });
  }
});

// Production routes only

// Direct endpoint to create a test agent request notification
router.get('/create-agent-notification', async (req, res) => {
  try {
    const AdminNotification = mongoose.model('AdminNotification');
    
    const notification = new AdminNotification({
      title: 'Test Agent Request',
      message: 'This is a test agent request notification',
      type: 'agent_request',
      isRead: false,
      createdAt: new Date()
    });
    
    await notification.save();
    
    res.json({
      success: true,
      message: 'Test agent request notification created',
      notification
    });
  } catch (error) {
    console.error('Error creating test agent notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating test agent notification',
      error: error.message
    });
  }
});

export default router;
