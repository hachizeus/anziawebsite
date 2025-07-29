// Password strength checker
export const checkPasswordStrength = (password) => {
  if (!password) return { score: 0, feedback: [] };
  
  let score = 0;
  const feedback = [];
  
  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Use at least 8 characters');
  }
  
  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add uppercase letters');
  }
  
  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add lowercase letters');
  }
  
  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add numbers');
  }
  
  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add special characters');
  }
  
  // Length bonus
  if (password.length >= 12) {
    score += 1;
  }
  
  return { score, feedback };
};

// Get password strength label
export const getPasswordStrengthLabel = (score) => {
  if (score <= 2) return { label: 'Weak', color: 'red' };
  if (score <= 4) return { label: 'Fair', color: 'orange' };
  if (score <= 5) return { label: 'Good', color: 'yellow' };
  return { label: 'Strong', color: 'green' };
};

export default { checkPasswordStrength, getPasswordStrengthLabel };