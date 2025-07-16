/**
 * Security utilities for the frontend application
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} html - The HTML string to sanitize
 * @returns {string} - Sanitized HTML string
 */
export const sanitizeHTML = (html) => {
  if (!html) return '';
  
  // Create a new div element
  const tempDiv = document.createElement('div');
  
  // Set its content to the HTML we want to sanitize
  tempDiv.textContent = html;
  
  // Return the sanitized content
  return tempDiv.innerHTML;
};

/**
 * Validate input to prevent injection attacks
 * @param {string} input - The input to validate
 * @param {string} type - The type of validation to perform (email, name, etc.)
 * @returns {boolean} - Whether the input is valid
 */
export const validateInput = (input, type) => {
  if (!input) return false;
  
  switch (type) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    case 'name':
      return /^[a-zA-Z\s'-]{2,50}$/.test(input);
    case 'phone':
      return /^[0-9+\s()-]{10,15}$/.test(input);
    case 'password':
      // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(input);
    default:
      return true;
  }
};

/**
 * Add security headers to fetch requests
 * @param {Object} headers - The headers object to enhance
 * @returns {Object} - Enhanced headers object
 */
export const addSecurityHeaders = (headers = {}) => {
  return {
    ...headers,
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };
};

/**
 * Create a secure fetch wrapper with CSRF protection
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise} - Fetch promise
 */
export const secureFetch = async (url, options = {}) => {
  // Get CSRF token from cookie or localStorage
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1] || localStorage.getItem('csrfToken');
  
  // Add security headers
  const secureHeaders = addSecurityHeaders({
    ...options.headers,
    'X-XSRF-TOKEN': csrfToken
  });
  
  // Make the fetch request with enhanced security
  return fetch(url, {
    ...options,
    credentials: 'include', // Always send cookies for CSRF protection
    headers: secureHeaders
  });
};

export default {
  sanitizeHTML,
  validateInput,
  addSecurityHeaders,
  secureFetch
};