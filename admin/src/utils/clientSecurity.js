/**
 * Client-side security script to prevent insecure reloads and protect against common vulnerabilities
 */

// Prevent insecure requests
const preventInsecureRequests = () => {
  // Force HTTPS in production
  if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
    window.location.href = window.location.href.replace('http:', 'https:');
  }
};

// Prevent excessive reloads
const preventExcessiveReloads = () => {
  // Track reload count in session storage
  const reloadCount = parseInt(sessionStorage.getItem('reloadCount') || '0');
  const reloadTime = parseInt(sessionStorage.getItem('reloadTime') || '0');
  const now = Date.now();
  
  // If last reload was within 5 seconds, increment count
  if (now - reloadTime < 5000) {
    sessionStorage.setItem('reloadCount', (reloadCount + 1).toString());
    sessionStorage.setItem('reloadTime', now.toString());
    
    // If too many reloads, show warning and delay next reload
    if (reloadCount > 5) {
      alert('Too many page reloads detected. Please wait a moment before trying again.');
      // Prevent reload for 5 seconds
      window.stop();
      setTimeout(() => {
        // Reset reload count after delay
        sessionStorage.setItem('reloadCount', '0');
      }, 5000);
    }
  } else {
    // Reset count if last reload was more than 5 seconds ago
    sessionStorage.setItem('reloadCount', '1');
    sessionStorage.setItem('reloadTime', now.toString());
  }
};

// Prevent clickjacking
const preventClickjacking = () => {
  // Ensure we're not in an iframe
  if (window.self !== window.top) {
    window.top.location = window.self.location;
  }
};

// Prevent XSS in localStorage and sessionStorage
const sanitizeStorage = () => {
  // List of keys to check
  const keysToCheck = ['user', 'accessToken', 'isAdmin'];
  
  // Check localStorage
  for (const key of keysToCheck) {
    const value = localStorage.getItem(key);
    if (value && (value.includes('<script>') || value.includes('javascript:'))) {
      // Remove suspicious item
      localStorage.removeItem(key);
      console.error(`Removed suspicious localStorage item: ${key}`);
    }
  }
  
  // Check sessionStorage
  for (const key of keysToCheck) {
    const value = sessionStorage.getItem(key);
    if (value && (value.includes('<script>') || value.includes('javascript:'))) {
      // Remove suspicious item
      sessionStorage.removeItem(key);
      console.error(`Removed suspicious sessionStorage item: ${key}`);
    }
  }
};

// Prevent debug tools
const preventDebugTools = () => {
  // Disable console in production
  if (process.env.NODE_ENV === 'production') {
    console.log = () => {};
    console.error = () => {};
    console.warn = () => {};
    console.debug = () => {};
  }
};

// Initialize security measures
const initClientSecurity = () => {
  preventInsecureRequests();
  preventExcessiveReloads();
  preventClickjacking();
  sanitizeStorage();
  
  // Only in production
  if (process.env.NODE_ENV === 'production') {
    preventDebugTools();
  }
  
  // Run sanitizeStorage periodically
  setInterval(sanitizeStorage, 30000); // Every 30 seconds
};

export default initClientSecurity;