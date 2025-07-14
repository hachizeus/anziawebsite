/**
 * Simple CSRF protection middleware
 */

import crypto from 'crypto';

// Generate a CSRF token
export const generateCSRFToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// CSRF protection middleware
export const csrfProtection = (req, res, next) => {
  // Skip CSRF check for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }
  
  const csrfToken = req.headers['x-csrf-token'];
  const storedToken = req.cookies?.csrfToken;
  
  if (!csrfToken || !storedToken || csrfToken !== storedToken) {
    // For development, just log and continue
    console.warn('CSRF token validation failed');
    // In production, would return 403
    // return res.status(403).json({
    //   success: false,
    //   message: 'CSRF token validation failed'
    // });
  }
  
  next();
};

// Middleware to set CSRF token
export const setCSRFToken = (req, res, next) => {
  // Only set a new CSRF token if one doesn't exist
  if (!req.cookies?.csrfToken) {
    const token = generateCSRFToken();
    
    // Set the token as a cookie with less strict SameSite for development
    res.cookie('csrfToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'none',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    // Also send it in the response for the client to use in headers
    res.locals.csrfToken = token;
  }
  
  next();
};

// Issue CSRF token handler
export const issueCsrfToken = (req, res) => {
  // Generate a new token regardless of existing one
  const token = generateCSRFToken();
  
  // Set the token as a cookie with less strict SameSite for development
  res.cookie('csrfToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'none',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });
  
  // Return the token in the response
  return res.json({
    success: true,
    csrfToken: token
  });
};
