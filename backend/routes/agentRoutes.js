import express from 'express';
import { 
  getAgentProfile,
  updateAgentProfile,
  getAgentProperties,
  createproduct,
  updateproduct,
  deleteproduct,
  toggleproductVisibility,
  requestAgentRole,
  getAllAgents,
  toggleAgentVisibility,
  createAgentProfile,
  getExploreProperties,
  getExploreproductById
} from '../controller/agentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly, agentOnly, adminOrAgent } from '../middleware/roleMiddleware.js';
import upload from '../middleware/multer.js';

const router = express.Router();

// Public routes
router.post('/request', requestAgentRole);
router.get('/explore/properties', getExploreProperties);
router.get('/explore/properties/:id', getExploreproductById);

// Agent routes (protected)
router.get('/profile', protect, agentOnly, getAgentProfile);
router.put('/profile', protect, agentOnly, updateAgentProfile);
router.get('/properties', protect, agentOnly, getAgentProperties);
router.post('/properties', protect, agentOnly, upload.fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 },
  { name: "video", maxCount: 1 }
]), createproduct);
router.put('/properties/:id', protect, agentOnly, upload.fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 },
  { name: "video", maxCount: 1 }
]), updateproduct);
router.put('/properties/:id/toggle-visibility', protect, agentOnly, toggleproductVisibility);
router.delete('/properties/:id', protect, agentOnly, deleteproduct);

// Admin routes (protected)
router.get('/all', protect, adminOnly, getAllAgents);
router.post('/create', protect, adminOnly, createAgentProfile);
router.put('/toggle-visibility', protect, adminOnly, toggleAgentVisibility);

// Direct agent creation route
router.post('/create-for-user/:userId', protect, adminOnly, async (req, res) => {
  try {
    const { userId } = req.params;
    const mongoose = await import('mongoose').then(m => m.default);
    const user = await mongoose.model('User').findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update user role to agent
    user.role = 'agent';
    await user.save();
    
    // Agent profile should be created automatically by the User model pre-save hook
    // Let's verify it was created
    const Agent = mongoose.model('Agent');
    const agent = await Agent.findOne({ userId });
    
    if (!agent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create agent profile automatically'
      });
    }
    
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

export default router;
