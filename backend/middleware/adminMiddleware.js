import { csrfProtection } from './csrfMiddleware.js';

// Enhanced admin middleware with CSRF protection
export const adminAuth = [
  csrfProtection,
  async (req, res, next) => {
    try {
      // Check if user is admin by email, isAdmin flag, or role
      if (
        req.user.email === process.env.ADMIN_EMAIL || 
        req.user.isAdmin === true ||
        req.user.role === 'admin'
      ) {
        next();
      } else {
        return res.status(403).json({
          success: false,
          message: "Not authorized as admin",
        });
      }
    } catch (error) {
      console.error("Admin auth error:", error);
      return res.status(403).json({
        success: false,
        message: "Not authorized as admin",
      });
    }
  }
];

export default adminAuth;
