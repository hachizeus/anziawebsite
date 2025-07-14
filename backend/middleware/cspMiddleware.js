/**
 * Content Security Policy middleware
 * This middleware sets strict CSP headers to prevent XSS attacks
 */

const cspMiddleware = () => {
  return (req, res, next) => {
    // Set Content-Security-Policy header
    res.setHeader('Content-Security-Policy', [
      // Default policy for all content types
      "default-src 'self'",
      
      // Script sources
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
      
      // Style sources
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      
      // Image sources
      "img-src 'self' data: https://res.cloudinary.com https://images.unsplash.com",
      
      // Font sources
      "font-src 'self' https://fonts.gstatic.com",
      
      // Connect sources
      "connect-src 'self' https://api.cloudinary.com",
      
      // Object sources (PDFs, Flash, etc.)
      "object-src 'none'",
      
      // Media sources (audio, video)
      "media-src 'self'",
      
      // Frame sources
      "frame-src 'none'",
      
      // Form action destinations
      "form-action 'self'"
    ].join('; '));
    
    next();
  };
};

export default cspMiddleware;
