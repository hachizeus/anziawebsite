import axios from 'axios';

// Create a more robust API client
const createApiClient = () => {
  const client = axios.create({
    baseURL: import.meta.env.VITE_NETLIFY_BACKEND_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json'
    },
    // Add CORS settings
    withCredentials: false
  });

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor with better error handling
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      // Handle network errors
      if (!error.response) {
        console.error('Network error:', error.message);
        throw new Error('Network connection failed. Please check your internet connection.');
      }

      const { status, data } = error.response;

      // Handle specific status codes
      switch (status) {
        case 401:
          // Unauthorized - just throw error without automatic logout
          throw new Error('Authentication required. Please check your credentials.');

        case 403:
          throw new Error(data?.message || 'Access forbidden');

        case 404:
          throw new Error('Resource not found');

        case 429:
          // Rate limited
          const lockoutTime = data?.lockoutSeconds || 300;
          const minutes = Math.ceil(lockoutTime / 60);
          throw new Error(`Too many requests. Please try again in ${minutes} minutes.`);

        case 500:
          throw new Error('Server error. Please try again later.');

        default:
          throw new Error(data?.message || `Request failed with status ${status}`);
      }
    }
  );

  return client;
};

// Create the client instance
const apiClient = createApiClient();

// Helper functions for common operations
export const api = {
  // GET request
  get: async (url, config = {}) => {
    try {
      const response = await apiClient.get(url, config);
      return response.data;
    } catch (error) {
      console.error(`GET ${url} failed:`, error.message);
      throw error;
    }
  },

  // POST request
  post: async (url, data = {}, config = {}) => {
    try {
      const response = await apiClient.post(url, data, config);
      return response.data;
    } catch (error) {
      console.error(`POST ${url} failed:`, error.message);
      throw error;
    }
  },

  // PUT request
  put: async (url, data = {}, config = {}) => {
    try {
      const response = await apiClient.put(url, data, config);
      return response.data;
    } catch (error) {
      console.error(`PUT ${url} failed:`, error.message);
      throw error;
    }
  },

  // DELETE request
  delete: async (url, config = {}) => {
    try {
      const response = await apiClient.delete(url, config);
      return response.data;
    } catch (error) {
      console.error(`DELETE ${url} failed:`, error.message);
      throw error;
    }
  }
};

export default apiClient;

