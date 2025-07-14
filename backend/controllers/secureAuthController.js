import bcrypt from 'bcryptjs';
import User from '../models/Usermodel.js';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenUtils.js';
import { setCSRFToken } from '../middleware/csrfMiddleware.js';

// Login attempts tracking
const loginAttempts = new Map();

// Reset login attempts after successful login
const resetLoginAttempts = (ip) => {
  loginAttempts.delete(ip);
};

// Track failed login attempts
const trackFailedLogin = (ip) => {
  const attempts = loginAttempts.get(ip) || 0;
  loginAttempts.set(ip, attempts + 1);
  
  // If too many attempts, implement exponential backoff
  return attempts + 1;
};

// Check if IP is blocked due to too many failed attempts
const isIPBlocked = (ip) => {
  const attempts = loginAttempts.get(ip) || 0;
  
  if (attempts >= 10) {
    return true;
  }
  
  return false;
};

// Enhanced secure login controller
export const secureLogin = [
  setCSRFToken,
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const ip = req.ip || req.connection.remoteAddress;
      
      // Check if IP is blocked due to too many failed attempts
      if (isIPBlocked(ip)) {
        return res.status(429).json({
          success: false,
          message: 'Too many failed login attempts. Please try again later.'
        });
      }
      
      // Find user by email
      const user = await User.findOne({ email });
      
      // If user not found or password doesn't match
      if (!user || !(await bcrypt.compare(password, user.password))) {
        const attempts = trackFailedLogin(ip);
        
        // Calculate remaining attempts before lockout
        const remainingAttempts = Math.max(0, 10 - attempts);
        
        return res.status(401).json({
          success: false,
          message: `Invalid email or password. ${remainingAttempts > 0 ? `${remainingAttempts} attempts remaining.` : 'Account temporarily locked.'}`
        });
      }
      
      // Reset login attempts on successful login
      resetLoginAttempts(ip);
      
      // Generate tokens
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);
      
      // Set refresh token as HTTP-only cookie
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      // Update last login timestamp
      await User.findByIdAndUpdate(user._id, {
        lastLogin: new Date()
      });
      
      // Return success with access token and user info
      return res.json({
        success: true,
        accessToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin || false,
          role: user.role || 'user'
        },
        csrfToken: res.locals.csrfToken
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error during login'
      });
    }
  }
];

// Secure logout controller
export const secureLogout = (req, res) => {
  // Clear refresh token cookie
  res.clearCookie('refreshToken');
  
  // Clear CSRF token cookie
  res.clearCookie('csrfToken');
  
  return res.json({
    success: true,
    message: 'Logged out successfully'
  });
};

export default { secureLogin, secureLogout };
