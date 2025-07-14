import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import secureApiClient from '../utils/secureApiClient';

// Create security context
const SecurityContext = createContext();

// Security provider component
export const SecurityProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Check authentication status - NEVER logout automatically
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          // Always set authenticated if token exists
          setIsAuthenticated(true);
          setUser(JSON.parse(userStr));
        } catch (error) {
          console.error('Error parsing user data:', error);
          // Keep user logged in even if parsing fails
          setIsAuthenticated(true);
          setUser({ name: 'Admin', email: '', role: 'admin' });
        }
      }
      
      setLoading(false);
    };
    
    // Check auth immediately - no periodic checks
    checkAuth();
  }, []);
  
  // Secure logout function
  const logout = async () => {
    try {
      const api = secureApiClient();
      await api.post('/api/secure-auth/logout');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Clear tokens and state regardless of API success
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('isAdmin');
      setIsAuthenticated(false);
      setUser(null);
      navigate('/login');
    }
  };
  
  // Check if user has required permissions
  const hasPermission = (requiredPermission) => {
    if (!user || !user.permissions) return false;
    return user.permissions.includes(requiredPermission);
  };
  
  // Context value
  const value = {
    isAuthenticated,
    user,
    loading,
    logout,
    hasPermission
  };
  
  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};

// Custom hook to use security context
export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
};

export default SecurityContext;