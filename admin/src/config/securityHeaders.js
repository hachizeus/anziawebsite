/**
 * Secure HTTP headers configuration
 * This file configures secure HTTP headers for the application
 */

// Content Security Policy directives
const cspDirectives = {
  // Default policy for all content types
  'default-src': ["'self'"],
  
  // Script sources
  'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net", "https://unpkg.com"],
  
  // Style sources
  'style-src': ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  
  // Image sources
  'img-src': ["'self'", "data:", "https://res.cloudinary.com", "https://images.unsplash.com"],
  
  // Font sources
  'font-src': ["'self'", "https://fonts.gstatic.com"],
  
  // Connect sources
  'connect-src': ["'self'", "https://api.cloudinary.com"],
  
  // Object sources (PDFs, Flash, etc.)
  'object-src': ["'none'"],
  
  // Media sources (audio, video)
  'media-src': ["'self'"],
  
  // Frame sources
  'frame-src': ["'none'"],
  
  // Form action destinations
  'form-action': ["'self'"],
  
  // Base URI restrictions
  'base-uri': ["'self'"],
  
  // Frame ancestors (prevents clickjacking)
  'frame-ancestors': ["'none'"],
  
  // Block mixed content
  'block-all-mixed-content': [],
  
  // Upgrade insecure requests
  'upgrade-insecure-requests': []
};

// Build CSP header string
const buildCspHeader = () => {
  return Object.entries(cspDirectives)
    .map(([directive, sources]) => {
      if (sources.length === 0) {
        return directive;
      }
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');
};

// Security headers configuration
const securityHeaders = {
  // Content Security Policy
  'Content-Security-Policy': buildCspHeader(),
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // Enable browser XSS protection
  'X-XSS-Protection': '1; mode=block',
  
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions policy (formerly Feature-Policy)
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  
  // HTTP Strict Transport Security
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
};

export default securityHeaders;