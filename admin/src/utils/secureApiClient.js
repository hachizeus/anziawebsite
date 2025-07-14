import axios from 'axios';

const API_URL = "http://localhost:4000";

// Create a secure API client with interceptors for token handling
const secureApiClient = () => {
  // Create axios instance with default config
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    withCredentials: true // Important for cookies
  });
  
  // Request interceptor to add authorization header
  instance.interceptors.request.use(
    (config) => {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      // Add authorization header if token exists
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // Response interceptor - NEVER logout automatically
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Log errors but NEVER logout automatically
      console.error('API Error:', error.response?.status, error.message);
      return Promise.reject(error);
    }
  );
  
  return instance;
};

export default secureApiClient;