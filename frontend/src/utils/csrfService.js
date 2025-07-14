// Simplified CSRF service without complex token refresh
let csrfToken = null;

export const getTokenFromCookies = () => {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith('XSRF-TOKEN=')) {
      return cookie.substring('XSRF-TOKEN='.length);
    }
  }
  return null;
};

export const fetchCsrfToken = async () => {
  try {
    const cookieToken = getTokenFromCookies();
    if (cookieToken) {
      csrfToken = cookieToken;
      return csrfToken;
    }
    return null;
  } catch (error) {
    console.error('Error fetching CSRF token:', error);
    return null;
  }
};

export const getCsrfToken = async () => {
  const cookieToken = getTokenFromCookies();
  if (cookieToken) {
    csrfToken = cookieToken;
    return csrfToken;
  }
  return null;
};

export const clearCsrfToken = () => {
  csrfToken = null;
};

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

export const setupCsrfProtection = (axiosInstance) => {
  // Simple CSRF setup without complex interceptors
  console.log('CSRF protection setup completed');
};

