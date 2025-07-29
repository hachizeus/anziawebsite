import { fileURLToPath } from 'url';
import path from 'path';
import { apiLimiter, authLimiter, productLimiter } from './rateLimitMiddleware.js';
import { generateCSRFToken, verifyCSRFToken } from './csrfMiddleware.js';
import { logSecurityMiddleware } from './securityLogger.js';

// Export rate limiters
export { apiLimiter, authLimiter, productLimiter };

// Basic security middleware
const setSecurityHeaders = (req, res, next) => {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://res.cloudinary.com; connect-src 'self' https://api.cloudinary.com");
  next();
};

// Simple NoSQL injection protection
const sanitizeRequest = (req, res, next) => {
  if (req.body) {
    const sanitized = {};
    Object.keys(req.body).forEach(key => {
      // Convert any $ or . in keys to _
      const newKey = key.replace(/[$\.]/g, '_');
      sanitized[newKey] = req.body[key];
    });
    req.body = sanitized;
  }
  next();
};

// Simple XSS protection
const xssProtection = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        // Basic XSS sanitization
        req.body[key] = req.body[key]
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#x27;')
          .replace(/\//g, '&#x2F;');
      }
    });
  }
  next();
};

// Security middleware configuration
export const configureSecurityMiddleware = (app) => {
  // Security logging
  app.use(logSecurityMiddleware);
  
  // Set security headers
  app.use(setSecurityHeaders);
  
  // CSRF protection
  app.use(generateCSRFToken);
  
  // Data sanitization against NoSQL query injection
  app.use(sanitizeRequest);
  
  // Data sanitization against XSS
  app.use(xssProtection);
  
  // Apply rate limiting to all routes
  app.use('/api/', apiLimiter);
  
  return app;
};

// Export CSRF middleware
export { generateCSRFToken, verifyCSRFToken };
