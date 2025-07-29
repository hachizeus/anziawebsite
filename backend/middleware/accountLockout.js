// Simple in-memory store for failed attempts (use Redis in production)
const failedAttempts = new Map();
const lockedAccounts = new Map();

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes

// Track failed login attempts
export const trackFailedAttempt = (identifier) => {
  const now = Date.now();
  const attempts = failedAttempts.get(identifier) || [];
  
  // Remove old attempts outside the window
  const recentAttempts = attempts.filter(time => now - time < ATTEMPT_WINDOW);
  recentAttempts.push(now);
  
  failedAttempts.set(identifier, recentAttempts);
  
  // Lock account if too many attempts
  if (recentAttempts.length >= MAX_ATTEMPTS) {
    lockedAccounts.set(identifier, now + LOCKOUT_DURATION);
    failedAttempts.delete(identifier); // Clear attempts after locking
  }
};

// Check if account is locked
export const isAccountLocked = (identifier) => {
  const lockUntil = lockedAccounts.get(identifier);
  if (!lockUntil) return false;
  
  if (Date.now() > lockUntil) {
    lockedAccounts.delete(identifier);
    return false;
  }
  
  return true;
};

// Clear failed attempts on successful login
export const clearFailedAttempts = (identifier) => {
  failedAttempts.delete(identifier);
  lockedAccounts.delete(identifier);
};

// Get remaining lockout time
export const getRemainingLockoutTime = (identifier) => {
  const lockUntil = lockedAccounts.get(identifier);
  if (!lockUntil) return 0;
  
  const remaining = lockUntil - Date.now();
  return remaining > 0 ? Math.ceil(remaining / 1000 / 60) : 0; // minutes
};

// Middleware to check account lockout
export const checkAccountLockout = (req, res, next) => {
  const identifier = req.body.email || req.ip;
  
  if (isAccountLocked(identifier)) {
    const remainingMinutes = getRemainingLockoutTime(identifier);
    return res.status(423).json({
      success: false,
      message: `Account temporarily locked due to too many failed attempts. Try again in ${remainingMinutes} minutes.`,
      lockoutRemaining: remainingMinutes
    });
  }
  
  next();
};

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  
  // Clean expired lockouts
  for (const [identifier, lockUntil] of lockedAccounts.entries()) {
    if (now > lockUntil) {
      lockedAccounts.delete(identifier);
    }
  }
  
  // Clean old failed attempts
  for (const [identifier, attempts] of failedAttempts.entries()) {
    const recentAttempts = attempts.filter(time => now - time < ATTEMPT_WINDOW);
    if (recentAttempts.length === 0) {
      failedAttempts.delete(identifier);
    } else {
      failedAttempts.set(identifier, recentAttempts);
    }
  }
}, 5 * 60 * 1000); // Clean every 5 minutes

export default { trackFailedAttempt, isAccountLocked, clearFailedAttempts, checkAccountLockout };