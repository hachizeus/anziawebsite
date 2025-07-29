import fs from 'fs';
import path from 'path';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Security event types
export const SECURITY_EVENTS = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILED: 'LOGIN_FAILED',
  ACCOUNT_LOCKED: 'ACCOUNT_LOCKED',
  UNAUTHORIZED_ACCESS: 'UNAUTHORIZED_ACCESS',
  CSRF_VIOLATION: 'CSRF_VIOLATION',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  SUSPICIOUS_ACTIVITY: 'SUSPICIOUS_ACTIVITY',
  DATA_BREACH_ATTEMPT: 'DATA_BREACH_ATTEMPT'
};

// Log security event
export const logSecurityEvent = (eventType, details = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    eventType,
    ...details
  };
  
  // Write to security log file
  const logFile = path.join(logsDir, `security-${new Date().toISOString().split('T')[0]}.log`);
  const logLine = JSON.stringify(logEntry) + '\n';
  
  fs.appendFileSync(logFile, logLine);
  
  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🔒 Security Event:', logEntry);
  }
  
  // Alert on critical events
  if (isCriticalEvent(eventType)) {
    alertCriticalEvent(logEntry);
  }
};

// Check if event is critical
const isCriticalEvent = (eventType) => {
  const criticalEvents = [
    SECURITY_EVENTS.ACCOUNT_LOCKED,
    SECURITY_EVENTS.DATA_BREACH_ATTEMPT,
    SECURITY_EVENTS.SUSPICIOUS_ACTIVITY
  ];
  return criticalEvents.includes(eventType);
};

// Alert critical events (implement email/SMS notifications in production)
const alertCriticalEvent = (logEntry) => {
  console.error('🚨 CRITICAL SECURITY EVENT:', logEntry);
  // TODO: Implement email/SMS alerts
};

// Middleware to log requests
export const logSecurityMiddleware = (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function(data) {
    // Log failed authentication attempts
    if (res.statusCode === 401) {
      logSecurityEvent(SECURITY_EVENTS.UNAUTHORIZED_ACCESS, {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        path: req.path,
        method: req.method
      });
    }
    
    // Log rate limit violations
    if (res.statusCode === 429) {
      logSecurityEvent(SECURITY_EVENTS.RATE_LIMIT_EXCEEDED, {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        path: req.path,
        method: req.method
      });
    }
    
    // Log CSRF violations
    if (res.statusCode === 403 && data && data.includes('CSRF')) {
      logSecurityEvent(SECURITY_EVENTS.CSRF_VIOLATION, {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        path: req.path,
        method: req.method
      });
    }
    
    return originalSend.call(this, data);
  };
  
  next();
};

// Get security logs for admin dashboard
export const getSecurityLogs = (days = 7) => {
  const logs = [];
  const now = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(now - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split('T')[0];
    const logFile = path.join(logsDir, `security-${dateStr}.log`);
    
    if (fs.existsSync(logFile)) {
      const content = fs.readFileSync(logFile, 'utf8');
      const dayLogs = content.split('\n')
        .filter(line => line.trim())
        .map(line => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        })
        .filter(Boolean);
      
      logs.push(...dayLogs);
    }
  }
  
  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export default { logSecurityEvent, logSecurityMiddleware, getSecurityLogs, SECURITY_EVENTS };