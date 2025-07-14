/**
 * Simple admin authentication API that doesn't rely on cookies
 */

import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/Usermodel.js';
import bcrypt from 'bcryptjs';
// Rate limiting imports removed

const router = express.Router();

// Admin login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findOne({ email });
    
    // Check if user exists and password matches
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    // Check if user is admin
    const isAdmin = user.isAdmin === true || user.role === 'admin';
    if (!isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized as admin'
      });
    }
    
    // Generate JWT token with 24 hour expiration
    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        isAdmin: true,
        role: user.role
      },
      process.env.JWT_SECRET || 'fallback_secret_key_for_development',
      { expiresIn: '24h' }
    );
    
    // Reset login attempts on successful login
    if (req.loginKey) {
      resetLoginAttempts(req);
    }
    
    // Return success with token and user info
    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: true,
        role: user.role || 'admin'
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Verify token endpoint
router.get('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }
    
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'fallback_secret_key_for_development'
    );
    
    res.json({
      success: true,
      user: decoded
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

export default router;
