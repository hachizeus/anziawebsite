import api from './api';

// In-memory storage for CSRF token
let csrfToken = null;

/**
 * Fetch a new CSRF token from the server
 * @returns {Promise<string>} The CSRF token
 */
export const fetchCsrfToken = async () => {
  try {
    // Only fetch a new token if we don't have one
    if (!csrfToken) {
      const response = await api.get('/api/auth/csrf-token');
      if (response.data && response.data.csrfToken) {
        csrfToken = response.data.csrfToken;
      }
    }
    return csrfToken;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    throw error;
  }
};

/**
 * Get the current CSRF token, fetching a new one if necessary
 * @returns {Promise<string>} The CSRF token
 */
export const getCsrfToken = async () => {
  if (!csrfToken) {
    return await fetchCsrfToken();
  }
  return csrfToken;
};

/**
 * Clear the stored CSRF token (e.g., after logout)
 */
export const clearCsrfToken = () => {
  csrfToken = null;
};

/**
 * Add CSRF token to request headers
 * @param {Object} config - Axios request config
 * @returns {Promise<Object>} Updated config with CSRF token
 */
export const addCsrfHeader = async (config) => {
  const token = await getCsrfToken();
  if (token) {
    config.headers = {
      ...config.headers,
      'X-CSRF-Token': token
    };
  }
  return config;
};

