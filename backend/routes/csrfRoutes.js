/**
 * CSRF routes
 */

import express from 'express';
import { generateCSRFToken, setCSRFToken } from '../middleware/csrfMiddleware.js';

const router = express.Router();

// Get CSRF token
router.get('/csrf-token', setCSRFToken, (req, res) => {
  res.json({
    success: true,
    csrfToken: res.locals.csrfToken
  });
});

export default router;
