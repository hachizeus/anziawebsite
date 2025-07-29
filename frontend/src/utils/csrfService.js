// CSRF token management
class CSRFService {
  constructor() {
    this.token = null;
  }
  
  // Get CSRF token from cookie
  getTokenFromCookie() {
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'XSRF-TOKEN') {
        return decodeURIComponent(value);
      }
    }
    return null;
  }
  
  // Get current CSRF token
  getToken() {
    if (!this.token) {
      this.token = this.getTokenFromCookie();
    }
    return this.token;
  }
  
  // Refresh token from server
  async refreshToken() {
    try {
      const response = await fetch('/api/csrf-token', {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.ok) {
        this.token = this.getTokenFromCookie();
        return this.token;
      }
    } catch (error) {
      console.error('Failed to refresh CSRF token:', error);
    }
    return null;
  }
  
  // Add CSRF token to request headers
  addTokenToHeaders(headers = {}) {
    const token = this.getToken();
    if (token) {
      headers['X-XSRF-TOKEN'] = token;
    }
    return headers;
  }
  
  // Secure fetch wrapper with CSRF protection
  async secureFetch(url, options = {}) {
    // Add CSRF token to headers
    const headers = this.addTokenToHeaders(options.headers || {});
    
    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include'
    });
    
    // If CSRF token is invalid, try to refresh and retry once
    if (response.status === 403 && response.statusText.includes('CSRF')) {
      await this.refreshToken();
      const newHeaders = this.addTokenToHeaders(options.headers || {});
      
      return fetch(url, {
        ...options,
        headers: newHeaders,
        credentials: 'include'
      });
    }
    
    return response;
  }
}

// Create singleton instance
const csrfService = new CSRFService();

// Initialize CSRF token on page load
document.addEventListener('DOMContentLoaded', () => {
  csrfService.refreshToken();
});

export default csrfService;