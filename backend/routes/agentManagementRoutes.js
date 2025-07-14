import express from 'express';
import mongoose from 'mongoose';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Ensure agent profile exists for a user
router.post('/ensure-agent-profile', protect, admin, async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    // Get the user
    const User = mongoose.model('User');
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update user role to agent if not already
    if (user.role !== 'agent') {
      user.role = 'agent';
      await user.save();
    }
    
    // Check if agent profile exists
    const Agent = mongoose.model('Agent');
    let agent = await Agent.findOne({ userId });
    
    // Create agent profile if it doesn't exist
    if (!agent) {
      agent = new Agent({
        userId,
        email: user.email,
        subscription: req.body.subscription || 'basic',
        active: true,
        visible: true,
        subscriptionExpiry: new Date(new Date().setMonth(new Date().getMonth() + 1))
      });
      
      await agent.save();
    }
    
    res.json({
      success: true,
      message: 'Agent profile ensured',
      agent
    });
  } catch (error) {
    console.error('Error ensuring agent profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error ensuring agent profile',
      error: error.message
    });
  }
});

// Remove agent profile for a user
router.post('/remove-agent-profile', protect, admin, async (req, res) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    // Get the user
    const User = mongoose.model('User');
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update user role if it's agent
    if (user.role === 'agent') {
      user.role = 'user';
      await user.save();
    }
    
    // Remove agent profile
    const Agent = mongoose.model('Agent');
    const result = await Agent.findOneAndDelete({ userId });
    
    res.json({
      success: true,
      message: result ? 'Agent profile removed' : 'No agent profile found',
      removed: !!result
    });
  } catch (error) {
    console.error('Error removing agent profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing agent profile',
      error: error.message
    });
  }
});

export default router;
