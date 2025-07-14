import securityMonitor from './securityMonitor';

/**
 * Initialize security features for the admin application
 */
const initSecurity = () => {
  console.log('Initializing security features...');
  
  // Initialize security monitoring
  securityMonitor.init();
  
  // Prevent debugging
  preventDebugging();
  
  // Prevent data exfiltration
  preventDataExfiltration();
  
  // Prevent clickjacking
  preventClickjacking();
  
  console.log('Security features initialized');
};

/**
 * Prevent debugging tools
 */
const preventDebugging = () => {
  // Detect and prevent DevTools
  const devToolsDetector = () => {
    const widthThreshold = window.outerWidth - window.innerWidth > 160;
    const heightThreshold = window.outerHeight - window.innerHeight > 160;
    
    if (widthThreshold || heightThreshold) {
      securityMonitor.logSecurityEvent('devtools_opened', {
        width: window.outerWidth,
        height: window.outerHeight
      });
    }
  };
  
  // Check periodically
  setInterval(devToolsDetector, 1000);
  
  // Disable right-click in production
  if (process.env.NODE_ENV === 'production') {
    document.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });
  }
};

/**
 * Prevent data exfiltration
 */
const preventDataExfiltration = () => {
  // Prevent copy of sensitive data
  document.addEventListener('copy', (e) => {
    const selection = document.getSelection().toString();
    
    // Check if selection contains sensitive data patterns
    const sensitivePatterns = [
      /^\d{16}$/, // Credit card
      /^\d{3}-\d{2}-\d{4}$/, // SSN
      /^[A-Z]{2}\d{6}[A-Z]?$/ // Passport
    ];
    
    if (sensitivePatterns.some(pattern => pattern.test(selection))) {
      e.preventDefault();
      securityMonitor.logSecurityEvent('sensitive_data_copy', {
        selection: selection.substring(0, 4) + '****'
      });
    }
  });
};

/**
 * Prevent clickjacking
 */
const preventClickjacking = () => {
  // Ensure we're not in an iframe
  if (window.self !== window.top) {
    document.body.innerHTML = 'This application cannot be displayed in a frame.';
    securityMonitor.logSecurityEvent('clickjacking_attempt', {
      referrer: document.referrer
    });
  }
};

export default initSecurity;