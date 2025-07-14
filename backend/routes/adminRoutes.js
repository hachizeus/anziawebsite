import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import User from '../models/Usermodel.js';
import Agent from '../models/agentModel.js';

const router = express.Router();

// Create agent for user (admin only)
router.post('/create-agent/:userId', protect, admin, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update user role to agent
    user.role = 'agent';
    await user.save();
    
    // Create agent profile
    const agent = new Agent({
      userId: user._id,
      email: user.email,
      subscription: 'basic',
      active: true,
      visible: true,
      subscriptionExpiry: new Date(new Date().setMonth(new Date().getMonth() + 1))
    });
    
    await agent.save();
    
    res.status(201).json({
      success: true,
      message: 'Agent profile created successfully',
      agent
    });
  } catch (error) {
    console.error('Error creating agent profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating agent profile',
      error: error.message
    });
  }
});

// Fix all agents route
router.post('/fix-all-agents', protect, admin, async (req, res) => {
  try {
    // Find all users with agent role
    const agentUsers = await User.find({ role: 'agent' });
    console.log(`Found ${agentUsers.length} users with agent role`);
    
    // Check which ones don't have agent profiles
    let fixedCount = 0;
    let createdAgents = [];
    
    for (const user of agentUsers) {
      const existingAgent = await Agent.findOne({ userId: user._id });
      
      if (!existingAgent) {
        console.log(`Creating agent profile for user ${user._id} (${user.email})`);
        
        // Create agent profile
        const newAgent = new Agent({
          userId: user._id,
          subscription: 'basic',
          email: user.email,
          active: true,
          visible: true,
          subscriptionExpiry: new Date(new Date().setMonth(new Date().getMonth() + 1))
        });
        
        await newAgent.save();
        fixedCount++;
        createdAgents.push({
          agentId: newAgent._id,
          userId: user._id,
          email: user.email
        });
        console.log(`Created agent profile with ID: ${newAgent._id}`);
      }
    }
    
    res.status(200).json({
      success: true,
      message: `Fixed ${fixedCount} agent profiles`,
      fixedCount,
      createdAgents
    });
  } catch (error) {
    console.error('Error fixing agents:', error);
    res.status(500).json({
      success: false,
      message: 'Error fixing agents',
      error: error.message
    });
  }
});

export default router;
