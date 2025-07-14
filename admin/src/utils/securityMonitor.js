import secureApiClient from './secureApiClient';
import { isSuspiciousActivity } from './securityUtils';

// Security monitoring service
class SecurityMonitor {
  constructor() {
    this.api = secureApiClient();
    this.suspiciousActivities = [];
    this.initialized = false;
  }
  
  // Initialize the security monitor
  init() {
    if (this.initialized) return;
    
    // Set up event listeners for security events
    window.addEventListener('error', this.handleError.bind(this));
    
    // Monitor network requests
    this.monitorNetworkRequests();
    
    // Start periodic security checks
    this.startSecurityChecks();
    
    this.initialized = true;
  }
  
  // Log security event
  async logSecurityEvent(eventType, details) {
    try {
      // Check if the event is suspicious
      if (details && isSuspiciousActivity(JSON.stringify(details))) {
        this.suspiciousActivities.push({
          eventType,
          details,
          timestamp: new Date().toISOString()
        });
        
        // Report suspicious activity to the server
        await this.api.post('/api/admin/security/report', {
          eventType,
          details: JSON.stringify(details),
          userAgent: navigator.userAgent,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }
  
  // Handle JavaScript errors
  handleError(event) {
    this.logSecurityEvent('error', {
      message: event.message,
      source: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  }
  
  // Monitor network requests
  monitorNetworkRequests() {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        // Check for security-related responses
        if (response.status === 401 || response.status === 403) {
          this.logSecurityEvent('unauthorized_access', {
            url: args[0],
            status: response.status
          });
        }
        
        return response;
      } catch (error) {
        this.logSecurityEvent('fetch_error', {
          url: args[0],
          error: error.message
        });
        throw error;
      }
    };
  }
  
  // Start periodic security checks
  startSecurityChecks() {
    // Check every 5 minutes
    setInterval(() => {
      this.checkLocalStorageTampering();
      this.checkSessionStorageTampering();
    }, 5 * 60 * 1000);
  }
  
  // Check for local storage tampering
  checkLocalStorageTampering() {
    const isAdmin = localStorage.getItem('isAdmin');
    
    // If isAdmin is set but not to 'true', it might be tampered
    if (isAdmin !== null && isAdmin !== 'true') {
      this.logSecurityEvent('storage_tampering', {
        storage: 'localStorage',
        key: 'isAdmin',
        value: isAdmin
      });
      
      // Reset to correct value
      localStorage.setItem('isAdmin', 'true');
    }
  }
  
  // Check for session storage tampering
  checkSessionStorageTampering() {
    const accessToken = sessionStorage.getItem('accessToken');
    const user = sessionStorage.getItem('user');
    
    // If user exists but not accessToken, it might be tampered
    if (user && !accessToken) {
      this.logSecurityEvent('storage_tampering', {
        storage: 'sessionStorage',
        issue: 'user exists without accessToken'
      });
      
      // Clear potentially tampered data
      sessionStorage.removeItem('user');
    }
  }
}

// Create singleton instance
const securityMonitor = new SecurityMonitor();

export default securityMonitor;