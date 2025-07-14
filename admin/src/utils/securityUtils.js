/**
 * Security utilities for the admin panel
 */

// Sanitize user input to prevent XSS attacks
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const isStrongPassword = (password) => {
  // At least 12 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{12,}$/;
  return strongPasswordRegex.test(password);
};

// Get password strength feedback
export const getPasswordStrength = (password) => {
  if (!password) return { score: 0, feedback: 'Password is required' };
  
  let score = 0;
  let feedback = [];
  
  // Length check
  if (password.length < 8) {
    feedback.push('Password should be at least 8 characters');
  } else if (password.length >= 12) {
    score += 2;
  } else {
    score += 1;
  }
  
  // Complexity checks
  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Add uppercase letters');
  
  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Add lowercase letters');
  
  if (/\d/.test(password)) score += 1;
  else feedback.push('Add numbers');
  
  if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) score += 1;
  else feedback.push('Add special characters');
  
  // Prevent common passwords
  const commonPasswords = ['password', 'admin', '123456', 'qwerty', 'welcome'];
  if (commonPasswords.includes(password.toLowerCase())) {
    score = 0;
    feedback.push('This is a commonly used password');
  }
  
  // Calculate final score (0-5)
  score = Math.min(5, score);
  
  // Generate feedback message
  let message = '';
  if (score === 0) message = 'Very weak';
  else if (score === 1) message = 'Weak';
  else if (score === 2) message = 'Fair';
  else if (score === 3) message = 'Good';
  else if (score === 4) message = 'Strong';
  else message = 'Very strong';
  
  return {
    score,
    message,
    feedback: feedback.join(', ')
  };
};

// Detect suspicious activity
export const isSuspiciousActivity = (activity) => {
  const suspiciousPatterns = [
    // SQL injection patterns
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
    /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
    /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    /exec(\s|\+)+(s|x)p\w+/i,
    
    // XSS patterns
    /((\%3C)|<)((\%2F)|\/)*[a-z0-9\%]+((\%3E)|>)/i,
    /((\%3C)|<)((\%69)|i|(\%49))((\%6D)|m|(\%4D))((\%67)|g|(\%47))[^\n]+((\%3E)|>)/i,
    
    // Path traversal
    /\.\.\//i
  ];
  
  return suspiciousPatterns.some(pattern => pattern.test(activity));
};

// Generate a secure random ID
export const generateSecureId = (length = 16) => {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export default {
  sanitizeInput,
  isValidEmail,
  isStrongPassword,
  getPasswordStrength,
  isSuspiciousActivity,
  generateSecureId
};