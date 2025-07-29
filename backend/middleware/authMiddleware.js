import jwt from "jsonwebtoken";
import { trackFailedAttempt, clearFailedAttempts, checkAccountLockout } from './accountLockout.js';
import { logSecurityEvent, SECURITY_EVENTS } from './securityLogger.js';

// Protection middleware - Require valid token
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (!token) {
      logSecurityEvent(SECURITY_EVENTS.UNAUTHORIZED_ACCESS, {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        path: req.path
      });
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Handle admin token
    if (decoded.isAdmin === true || decoded.email === process.env.ADMIN_EMAIL) {
      req.user = {
        id: 'admin',
        email: decoded.email,
        isAdmin: true,
        role: 'admin'
      };
      return next();
    }
    
    // For regular users
    if (decoded.id) {
      req.user = {
        id: decoded.id,
        role: decoded.role || 'user'
      };
      return next();
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  } catch (error) {
    logSecurityEvent(SECURITY_EVENTS.UNAUTHORIZED_ACCESS, {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      path: req.path,
      error: error.message
    });
    return res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};

// Admin middleware - Require admin role
export const admin = (req, res, next) => {
  try {
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
};

export default protect;
