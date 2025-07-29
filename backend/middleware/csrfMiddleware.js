import crypto from 'crypto';

// Store CSRF tokens (in production, use Redis or database)
const csrfTokens = new Map();

// Generate CSRF token
export const generateCSRFToken = (req, res, next) => {
  const token = crypto.randomBytes(32).toString('hex');
  const sessionId = req.sessionID || req.ip + req.headers['user-agent'];
  
  csrfTokens.set(sessionId, token);
  
  // Set token in cookie
  res.cookie('XSRF-TOKEN', token, {
    httpOnly: false, // Allow JS access for AJAX requests
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });
  
  req.csrfToken = token;
  next();
};

// Verify CSRF token
export const verifyCSRFToken = (req, res, next) => {
  // Skip CSRF for GET requests
  if (req.method === 'GET') {
    return next();
  }
  
  const sessionId = req.sessionID || req.ip + req.headers['user-agent'];
  const tokenFromHeader = req.headers['x-xsrf-token'];
  const tokenFromBody = req.body._csrf;
  const storedToken = csrfTokens.get(sessionId);
  
  const providedToken = tokenFromHeader || tokenFromBody;
  
  if (!providedToken || !storedToken || providedToken !== storedToken) {
    return res.status(403).json({
      success: false,
      message: 'Invalid CSRF token'
    });
  }
  
  next();
};

// Clean expired tokens (run periodically)
setInterval(() => {
  // Simple cleanup - in production, implement proper expiration
  if (csrfTokens.size > 1000) {
    csrfTokens.clear();
  }
}, 60 * 60 * 1000); // Clean every hour

export default { generateCSRFToken, verifyCSRFToken };