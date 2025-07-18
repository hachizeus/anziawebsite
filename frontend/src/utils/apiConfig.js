/**
 * API Configuration for Production
 */

// Production API URL
const API_URL = 'https://anzia-electronics-api.onrender.com/api';

const apiConfig = {
  getApiUrl: () => API_URL,
  getBackendUrl: () => API_URL
};

export default apiConfig;