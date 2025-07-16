import axios from 'axios';

// Use only the Netlify API URL
const API_URL = import.meta.env.VITE_NETLIFY_API_URL;

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add CORS settings
  withCredentials: false,
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors or JWT expired
    if (error.response && error.response.status === 401 || 
        (error.response && error.response.data && 
         (error.response.data.message === 'jwt expired' || 
          error.response.data.error === 'jwt expired'))) {
      
      // Clear token since it's expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // If not on login page, redirect to login
      if (!window.location.pathname.includes('/login')) {
        console.log('Session expired. Redirecting to login...');
        // Show notification to user
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded shadow-md z-50';
        notification.innerHTML = `
          <div class="flex items-center">
            <div class="mr-3">
              <svg class="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p class="font-bold">Session Expired</p>
              <p class="text-sm">Please log in again to continue.</p>
            </div>
          </div>
        `;
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds and redirect
        setTimeout(() => {
          if (document.body.contains(notification)) {
            document.body.removeChild(notification);
          }
          window.location.href = '/login';
        }, 3000);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;