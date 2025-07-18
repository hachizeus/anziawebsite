import { createContext, useState, useContext, useEffect } from "react";
import { loginUser, logoutUser } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");
    const loginTime = localStorage.getItem("loginTime");
    
    // Check if token is expired (24 hours)
    const isTokenExpired = loginTime && (Date.now() - parseInt(loginTime)) > 24 * 60 * 60 * 1000;
    
    if (token && userData && !isTokenExpired) {
      try {
        const parsedUserData = JSON.parse(userData);
        console.log("Using cached user data:", parsedUserData);
        setUser(parsedUserData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setIsLoggedIn(false);
        setUser(null);
        // Clear invalid data
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        localStorage.removeItem("loginTime");
      }
    } else {
      // Clear expired token
      if (isTokenExpired) {
        console.log("Token expired, logging out");
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        localStorage.removeItem("loginTime");
      }
      setIsLoggedIn(false);
      setUser(null);
    }
    
    setLoading(false);
  };
  
  const handleLogout = async () => {
    try {
      // Clear all localStorage data first
      localStorage.clear();
      
      // Reset all state
      setIsLoggedIn(false);
      setUser(null);
      
      // Dispatch cart update to clear cart count
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      
      // Force page reload to clear all cached data
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Force reload anyway
      window.location.href = '/login';
    }
  };

  useEffect(() => {
    // Check auth status (which now uses localStorage first)
    checkAuthStatus();
    
    // Add event listener for storage changes to sync profile picture across tabs
    const handleStorageChange = (e) => {
      if (e.key === 'userData') {
        try {
          const newUserData = JSON.parse(e.newValue);
          setUser(prevUser => ({
            ...prevUser,
            ...newUserData
          }));
        } catch (error) {
          console.error('Error parsing updated user data:', error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = async (token, userData) => {
    // Store data in localStorage with login time
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("loginTime", Date.now().toString());
    }
    
    if (userData) {
      localStorage.setItem("userData", JSON.stringify(userData));
    }
    
    // Store user data in state
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = () => {
    handleLogout();
  };
  
  const updateUser = (updatedData) => {
    console.log('Updating user with data:', updatedData);
    
    // Update user state
    setUser(prevUser => {
      const newUser = {
        ...prevUser,
        ...updatedData
      };
      console.log('Updated user state:', newUser);
      return newUser;
    });
    
    // Update localStorage
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (userData) {
        const updatedUserData = {
          ...userData,
          ...updatedData
        };
        console.log('Updating localStorage with:', updatedUserData);
        localStorage.setItem('userData', JSON.stringify(updatedUserData));
        
        // Trigger storage event for cross-tab sync
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'userData',
          newValue: JSON.stringify(updatedUserData),
          oldValue: JSON.stringify(userData)
        }));
      }
    } catch (e) {
      console.error('Error updating user data in localStorage:', e);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isLoggedIn, 
      user, 
      login, 
      logout, 
      loading,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Helper function to check if user has a specific role
export const hasRole = (user, role) => {
  if (!user) return false;
  return user.role === role;
};

