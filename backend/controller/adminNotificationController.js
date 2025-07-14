import AdminNotification from '../models/adminNotificationModel.js';

// Get all notifications
export const getNotifications = async (req, res) => {
  // Force clear any potential cache
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  try {
    const { limit = 50, skip = 0, unreadOnly = false } = req.query;
    
    console.log('Getting notifications with params:', { limit, skip, unreadOnly });
    
    const query = unreadOnly === 'true' ? { isRead: false } : {};
    
    // Check if there are any notifications in the database
    const count = await AdminNotification.countDocuments();
    console.log('Total notifications in database:', count);
    
    // If limit is 0, just return counts without notifications
    let notifications = [];
    if (Number(limit) !== 0) {
      notifications = await AdminNotification.find(query)
        .sort({ createdAt: -1 })
        .skip(Number(skip))
        .limit(Number(limit));
      
      console.log(`Found ${notifications.length} notifications matching query`);
      // Log the first notification for debugging
      if (notifications.length > 0) {
        console.log('First notification:', JSON.stringify(notifications[0]));
      }
    }
    
    const total = await AdminNotification.countDocuments(query);
    const unreadCount = await AdminNotification.countDocuments({ isRead: false });
    
    console.log('Response stats:', { total, unreadCount });
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    // Send response
    res.json({
      success: true,
      notifications,
      total,
      unreadCount
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notifications'
    });
  }
};

// Mark notification as read (delete from database)
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    const notification = await AdminNotification.findByIdAndDelete(id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting notification'
    });
  }
};

// Mark all notifications as read (delete all from database)
export const markAllAsRead = async (req, res) => {
  try {
    const result = await AdminNotification.deleteMany({});
    
    res.json({
      success: true,
      message: `All ${result.deletedCount} notifications deleted`
    });
  } catch (error) {
    console.error('Error deleting all notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting all notifications'
    });
  }
};

// Test endpoint to create a notification
export const createTestNotification = async (req, res) => {
  try {
    const notification = new AdminNotification({
      title: 'Test Notification',
      message: 'This is a test notification created at ' + new Date().toLocaleString(),
      type: 'system'
    });
    
    await notification.save();
    
    // Check if notification was saved correctly
    const savedNotification = await AdminNotification.findById(notification._id);
    console.log('Saved notification found:', savedNotification ? 'Yes' : 'No');
    
    // Count all notifications in the database
    const count = await AdminNotification.countDocuments();
    console.log('Total notifications after save:', count);
    
    res.json({
      success: true,
      message: 'Test notification created successfully',
      notification,
      totalCount: count
    });
  } catch (error) {
    console.error('Error creating test notification:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating test notification'
    });
  }
};

// Create notification (utility function for internal use)
export const createNotification = async (notificationData) => {
  try {
    console.log('Creating notification:', notificationData);
    const notification = new AdminNotification(notificationData);
    const savedNotification = await notification.save();
    console.log('Notification created successfully:', savedNotification._id);
    return savedNotification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};
