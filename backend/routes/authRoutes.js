import express from 'express';
import { 
  refreshAccessToken, 
  logout,
  revokeToken
} from '../controller/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { issueCsrfToken } from '../middleware/csrfMiddleware.js';

const router = express.Router();

// Refresh token route
router.post('/refresh-token', refreshAccessToken);

// Logout route
router.post('/logout', logout);

// Revoke token (for admins or users to revoke specific tokens)
router.post('/revoke-token', protect, revokeToken);

// Get CSRF token
router.get('/csrf-token', protect, issueCsrfToken);

export default router;
