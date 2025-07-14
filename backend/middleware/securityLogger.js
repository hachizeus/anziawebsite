/**
 * Security logger middleware
 */

// Simple security logger
export const securityLogger = (req, res, next) => {
  // Skip logging for non-security-related endpoints
  const securityEndpoints = [
    '/api/auth',
    '/api/secure-auth',
    '/api/admin',
    '/api/users'
  ];
  
  const isSecurityEndpoint = securityEndpoints.some(endpoint => 
    req.path.startsWith(endpoint)
  );
  
  if (isSecurityEndpoint) {
    // Log security-related requests
    console.log(`[SECURITY] ${new Date().toISOString()} - ${req.method} ${req.path} - IP: ${req.ip || req.connection.remoteAddress}`);
  }
  
  next();
};

export default securityLogger;
