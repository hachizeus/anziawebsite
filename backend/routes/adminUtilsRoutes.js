import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { adminAuth } from '../middleware/adminMiddleware.js';

const router = express.Router();

// Clear all rate limiting lockouts (admin only)
router.post('/clear-lockouts', protect, adminAuth, async (req, res) => {
  try {
    // Import the rate limiting functions
    const { clearAllAttempts } = await import('../middleware/rateLimitMiddleware.js');
    
    // Clear all login attempts
    clearAllAttempts();
    
    console.log('Admin cleared all rate limiting lockouts');
    
    res.json({
      success: true,
      message: 'All rate limiting lockouts have been cleared'
    });
  } catch (error) {
    console.error('Error clearing lockouts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear lockouts'
    });
  }
});

// Get system status
router.get('/system-status', protect, adminAuth, (req, res) => {
  try {
    res.json({
      success: true,
      status: {
        server: 'running',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        nodeVersion: process.version
      }
    });
  } catch (error) {
    console.error('Error getting system status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get system status'
    });
  }
});

export default router;
