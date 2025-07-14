/**
 * Secure authentication routes
 */

import express from 'express';
import { setCSRFToken } from '../middleware/csrfMiddleware.js';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenUtils.js';
import jwt from 'jsonwebtoken';
import User from '../models/Usermodel.js';

const router = express.Router();

// Get CSRF token
router.get('/csrf-token', setCSRFToken, (req, res) => {
  res.json({
    success: true,
    csrfToken: res.locals.csrfToken
  });
});

// Verify token
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_for_development');
    
    res.json({
      success: true,
      message: 'Token is valid'
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

// Secure login
router.post('/login', setCSRFToken, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    
    // Check if user exists and password matches
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
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
    
    // Return success with access token and user info
    res.json({
      success: true,
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin || user.role === 'admin' || false,
        role: user.role || 'user'
      },
      csrfToken: res.locals.csrfToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  // Clear refresh token cookie
  res.clearCookie('refreshToken');
  
  // Clear CSRF token cookie
  res.clearCookie('csrfToken');
  
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

export default router;
