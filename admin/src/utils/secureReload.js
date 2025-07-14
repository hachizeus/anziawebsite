/**
 * Secure reload prevention
 * This script prevents insecure reloads and detects potential security issues
 */

// Track page reloads
let reloadCount = 0;
let lastReloadTime = 0;
const RELOAD_THRESHOLD = 5; // Max reloads in time window
const RELOAD_TIME_WINDOW = 10000; // 10 seconds

// Initialize reload tracking
const initReloadTracking = () => {
  // Get stored values from sessionStorage
  reloadCount = parseInt(sessionStorage.getItem('secureReloadCount') || '0');
  lastReloadTime = parseInt(sessionStorage.getItem('secureReloadTime') || '0');
  
  const now = Date.now();
  
  // If last reload was within time window, increment count
  if (now - lastReloadTime < RELOAD_TIME_WINDOW) {
    reloadCount++;
  } else {
    // Reset count if outside time window
    reloadCount = 1;
  }
  
  // Store updated values
  sessionStorage.setItem('secureReloadCount', reloadCount.toString());
  sessionStorage.setItem('secureReloadTime', now.toString());
  
  // Check for excessive reloads
  if (reloadCount > RELOAD_THRESHOLD) {
    handleExcessiveReloads();
  }
};

// Handle excessive reloads
const handleExcessiveReloads = () => {
  console.warn('Security warning: Excessive page reloads detected');
  
  // Log security event
  logSecurityEvent('excessive_reloads', {
    count: reloadCount,
    timeWindow: RELOAD_TIME_WINDOW,
    userAgent: navigator.userAgent,
    url: window.location.href
  });
  
  // Implement progressive delay to prevent DoS
  const delay = Math.min(reloadCount * 1000, 10000); // Max 10 second delay
  
  // Show warning to user
  const warningElement = document.createElement('div');
  warningElement.style.position = 'fixed';
  warningElement.style.top = '0';
  warningElement.style.left = '0';
  warningElement.style.width = '100%';
  warningElement.style.padding = '10px';
  warningElement.style.backgroundColor = '#f44336';
  warningElement.style.color = 'white';
  warningElement.style.textAlign = 'center';
  warningElement.style.zIndex = '9999';
  warningElement.textContent = `Too many page reloads detected. Please wait ${delay/1000} seconds before continuing.`;
  
  document.body.appendChild(warningElement);
  
  // Prevent further reloads temporarily
  window.onbeforeunload = (e) => {
    e.preventDefault();
    e.returnValue = '';
    return '';
  };
  
  // Remove prevention after delay
  setTimeout(() => {
    window.onbeforeunload = null;
    if (document.body.contains(warningElement)) {
      document.body.removeChild(warningElement);
    }
  }, delay);
};

// Log security events
const logSecurityEvent = (eventType, details) => {
  // Only log in production
  if (process.env.NODE_ENV !== 'production') {
    return;
  }
  
  try {
    // Send security event to server
    fetch('/api/admin/security/log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.cookie.split('; ')
          .find(row => row.startsWith('csrfToken='))
          ?.split('=')[1] || ''
      },
      body: JSON.stringify({
        eventType,
        details,
        timestamp: new Date().toISOString()
      }),
      credentials: 'include'
    }).catch(err => console.error('Failed to log security event:', err));
  } catch (error) {
    console.error('Error logging security event:', error);
  }
};

// Check for insecure requests
const checkInsecureRequests = () => {
  // Force HTTPS in production
  if (window.location.protocol === 'http:' && 
      window.location.hostname !== 'localhost' && 
      window.location.hostname !== '127.0.0.1') {
    window.location.href = window.location.href.replace('http:', 'https:');
  }
};

// Initialize secure reload prevention
const initSecureReload = () => {
  // Check for insecure requests
  checkInsecureRequests();
  
  // Initialize reload tracking
  initReloadTracking();
  
  // Listen for page visibility changes (potential tab switching attacks)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // Check for storage tampering when tab becomes visible
      checkStorageTampering();
    }
  });
};

// Check for storage tampering
const checkStorageTampering = () => {
  // Check if admin flag has been tampered with
  const isAdmin = localStorage.getItem('isAdmin');
  if (isAdmin !== null && isAdmin !== 'true') {
    logSecurityEvent('storage_tampering', {
      storage: 'localStorage',
      key: 'isAdmin',
      value: isAdmin
    });
    
    // Reset to correct value or clear
    localStorage.removeItem('isAdmin');
    window.location.href = '/login';
  }
};

export default initSecureReload;