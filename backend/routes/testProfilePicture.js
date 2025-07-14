import express from 'express';
import Agent from '../models/agentModel.js';
import User from '../models/Usermodel.js';

const router = express.Router();

// Test endpoint to check profile picture data
router.get('/test-profile-pictures', async (req, res) => {
  try {
    // Get all agents with their user data
    const agents = await Agent.find()
      .populate('userId', 'name email profilePicture profileImage')
      .select('profilePicture userId');

    const results = agents.map(agent => ({
      agentId: agent._id,
      agentProfilePicture: agent.profilePicture,
      userId: agent.userId?._id,
      userName: agent.userId?.name,
      userEmail: agent.userId?.email,
      userProfilePicture: agent.userId?.profilePicture,
      userProfileImage: agent.userId?.profileImage,
      synced: agent.profilePicture === agent.userId?.profilePicture
    }));

    res.json({
      success: true,
      count: results.length,
      agents: results
    });
  } catch (error) {
    console.error('Error testing profile pictures:', error);
    res.status(500).json({
      success: false,
      message: 'Error testing profile pictures',
      error: error.message
    });
  }
});

// Test endpoint to sync a specific agent's profile picture
router.post('/sync-profile-picture/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    
    const agent = await Agent.findById(agentId).populate('userId');
    
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    if (!agent.userId) {
      return res.status(404).json({
        success: false,
        message: 'User not found for this agent'
      });
    }

    // Sync profile picture
    if (agent.profilePicture) {
      agent.userId.profilePicture = agent.profilePicture;
      agent.userId.profileImage = agent.profilePicture;
      await agent.userId.save();
    }

    res.json({
      success: true,
      message: 'Profile picture synced successfully',
      agentProfilePicture: agent.profilePicture,
      userProfilePicture: agent.userId.profilePicture
    });
  } catch (error) {
    console.error('Error syncing profile picture:', error);
    res.status(500).json({
      success: false,
      message: 'Error syncing profile picture',
      error: error.message
    });
  }
});

export default router;
