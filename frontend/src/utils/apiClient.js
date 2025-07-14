import axios from 'axios';

// Simple API client without complex interceptors
const apiClient = axios.create({
  baseURL: 'https://real-estate-backend-vybd.onrender.com',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: false
});

// Simple request interceptor to add auth token
apiClient.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Simple response interceptor
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// Helper function for API calls
export const callApi = async (method, url, data = null, options = {}) => {
  try {
    const response = await apiClient({
      method,
      url,
      data,
      ...options
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      const message = error.response.data?.message || 'Server error';
      throw new Error(message);
    } else if (error.request) {
      throw new Error('No response from server. Please check your connection.');
    } else {
      throw error;
    }
  }
};

export default apiClient;

