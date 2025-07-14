/**
 * Simple security middleware without external dependencies
 */

// Set security headers
const setSecurityHeaders = (req, res, next) => {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://res.cloudinary.com; connect-src 'self' https://api.cloudinary.com");
  next();
};

// Prevent clickjacking
const preventClickjacking = (req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  next();
};

// Prevent MIME type sniffing
const preventMimeSniffing = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
};

// Enable XSS protection
const enableXssProtection = (req, res, next) => {
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
};

// Prevent cache for sensitive routes
const preventCache = (req, res, next) => {
  if (
    req.path.includes('/api/auth') ||
    req.path.includes('/api/admin')
  ) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  next();
};

// Combine all security middleware
const securityMiddleware = [
  setSecurityHeaders,
  preventClickjacking,
  preventMimeSniffing,
  enableXssProtection,
  preventCache
];

export default securityMiddleware;
