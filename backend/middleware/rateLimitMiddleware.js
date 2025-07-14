import rateLimit from 'express-rate-limit';

// Create a store for tracking login attempts by IP only (simpler)
const loginAttempts = new Map();

// Clean up old login attempts periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of loginAttempts.entries()) {
    if (now > data.resetTime) {
      loginAttempts.delete(key);
    }
  }
}, 5 * 60 * 1000); // Run every 5 minutes

// Custom store for tracking login attempts
const loginAttemptsStore = {
  // Increment attempts for a key
  increment: (key) => {
    const now = Date.now();
    const keyData = loginAttempts.get(key) || { 
      attempts: 0, 
      resetTime: now + 2 * 60 * 1000, // 2 minutes lockout
      firstAttemptTime: now
    };
    
    keyData.attempts += 1;
    
    // If we've reached 5 attempts, set the reset time to 5 minutes from now
    if (keyData.attempts >= 5) {
      keyData.resetTime = now + 5 * 60 * 1000; // 5 minutes lockout
    }
    
    loginAttempts.set(key, keyData);
    
    return keyData.attempts;
  },
  
  // Reset attempts for a key
  resetKey: (key) => {
    loginAttempts.delete(key);
  },
  
  // Check if key is blocked
  isBlocked: (key) => {
    const keyData = loginAttempts.get(key);
    if (!keyData) return false;
    
    const now = Date.now();
    
    // If the lockout period has passed, reset the attempts
    if (now >= keyData.resetTime) {
      loginAttempts.delete(key);
      return false;
    }
    
    // If we've reached 5 attempts and we're still within the lockout period
    if (keyData.attempts >= 5) {
      return true;
    }
    
    return false;
  },
  
  // Get remaining lockout time in seconds
  getRemainingLockoutTime: (key) => {
    const keyData = loginAttempts.get(key);
    if (!keyData || keyData.attempts < 3) return 0;
    
    const now = Date.now();
    const remainingMs = Math.max(0, keyData.resetTime - now);
    return Math.ceil(remainingMs / 1000); // Convert to seconds
  }
};

// Login rate limiter middleware - COMPLETELY DISABLED
export const loginRateLimiter = (req, res, next) => {
  next();
};

// Track failed login attempt - COMPLETELY DISABLED
export const trackFailedLogin = (req) => {
  return { attempts: 0, remaining: 999 };
};

// Reset login attempts on successful login
export const resetLoginAttempts = (req) => {
  if (req.loginKey) {
    loginAttemptsStore.resetKey(req.loginKey);
    console.log(`Login attempts reset for ${req.loginKey}`);
  }
};

// General API rate limiter - COMPLETELY DISABLED
export const apiRateLimiter = (req, res, next) => {
  next();
};

// Clear all login attempts (for admin use)
export const clearAllAttempts = () => {
  loginAttempts.clear();
  console.log('All login attempts cleared by admin');
};

// Get current lockout status
export const getLockoutStatus = () => {
  const status = [];
  const now = Date.now();
  
  for (const [key, data] of loginAttempts.entries()) {
    if (data.attempts > 0) {
      status.push({
        ip: key,
        attempts: data.attempts,
        isBlocked: now < data.resetTime && data.attempts >= 5,
        resetTime: new Date(data.resetTime).toISOString()
      });
    }
  }
  
  return status;
};
