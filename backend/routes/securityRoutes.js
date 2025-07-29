import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { getSecurityLogs } from '../middleware/securityLogger.js';

const router = express.Router();

// Get security logs (admin only)
router.get('/logs', protect, admin, (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const logs = getSecurityLogs(days);
    
    res.json({
      success: true,
      logs,
      total: logs.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve security logs'
    });
  }
});

// Security dashboard stats (admin only)
router.get('/stats', protect, admin, (req, res) => {
  try {
    const logs = getSecurityLogs(7);
    
    const stats = {
      totalEvents: logs.length,
      loginAttempts: logs.filter(log => log.eventType.includes('LOGIN')).length,
      failedLogins: logs.filter(log => log.eventType === 'LOGIN_FAILED').length,
      unauthorizedAccess: logs.filter(log => log.eventType === 'UNAUTHORIZED_ACCESS').length,
      rateLimitViolations: logs.filter(log => log.eventType === 'RATE_LIMIT_EXCEEDED').length,
      csrfViolations: logs.filter(log => log.eventType === 'CSRF_VIOLATION').length
    };
    
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve security stats'
    });
  }
});

export default router;