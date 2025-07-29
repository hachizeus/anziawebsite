import express from 'express';
import { generateCSRFToken } from '../middleware/csrfMiddleware.js';

const router = express.Router();

// Get CSRF token endpoint
router.get('/csrf-token', generateCSRFToken, (req, res) => {
  res.json({
    success: true,
    message: 'CSRF token generated'
  });
});

export default router;