/**
 * API Configuration Utility
 * Provides configuration for switching between local and Netlify backends
 */

// Get environment variables
const LOCAL_API_URL = import.meta.env.VITE_API_BASE_URL;
const LOCAL_BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const NETLIFY_API_URL = import.meta.env.VITE_NETLIFY_API_URL;
const NETLIFY_BACKEND_URL = import.meta.env.VITE_NETLIFY_BACKEND_URL;

// Default to Netlify environment
let currentEnvironment = 'netlify';

// API configuration object
const apiConfig = {
  // Get the current API URL based on environment
  getApiUrl: () => {
    return currentEnvironment === 'local' ? LOCAL_API_URL : NETLIFY_API_URL;
  },
  
  // Get the current backend URL based on environment
  getBackendUrl: () => {
    return currentEnvironment === 'local' ? LOCAL_BACKEND_URL : NETLIFY_BACKEND_URL;
  },
  
  // Switch to local environment
  useLocalBackend: () => {
    currentEnvironment = 'local';
    localStorage.setItem('apiEnvironment', 'local');
    console.log('Switched to local backend:', LOCAL_API_URL);
    return LOCAL_API_URL;
  },
  
  // Switch to Netlify environment
  useNetlifyBackend: () => {
    currentEnvironment = 'netlify';
    localStorage.setItem('apiEnvironment', 'netlify');
    console.log('Switched to Netlify backend:', NETLIFY_API_URL);
    return NETLIFY_API_URL;
  },
  
  // Initialize environment from localStorage or default
  initEnvironment: () => {
    const savedEnvironment = localStorage.getItem('apiEnvironment');
    if (savedEnvironment === 'netlify') {
      currentEnvironment = 'netlify';
    } else if (savedEnvironment === 'local') {
      currentEnvironment = 'local';
    }
    // Otherwise keep default 'local'
    
    return currentEnvironment;
  },
  
  // Get current environment
  getCurrentEnvironment: () => {
    return currentEnvironment;
  }
};

// Initialize on import
apiConfig.initEnvironment();

export default apiConfig;