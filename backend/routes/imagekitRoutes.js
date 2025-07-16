import express from 'express';
import { getAuthenticationParameters } from '../middleware/fileStorage.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   GET /api/imagekit/auth
 * @desc    Get ImageKit authentication parameters for frontend uploads
 * @access  Private
 */
router.get('/auth', protect, (req, res) => {
  try {
    const authParams = getAuthenticationParameters();
    res.json({
      success: true,
      authParams
    });
  } catch (error) {
    console.error('Error generating ImageKit auth parameters:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate authentication parameters'
    });
  }
});

export default router;