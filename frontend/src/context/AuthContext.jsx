import { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");
    
    if (token && userData) {
      try {
        const parsedUserData = JSON.parse(userData);
        console.log("Using cached user data:", parsedUserData);
        setUser(parsedUserData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
        setIsLoggedIn(false);
        setUser(null);
      }
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
    
    setLoading(false);
  };
  
  const handleLogout = async () => {
    try {
      // Call logout endpoint to invalidate refresh token
      await api.post('/api/users/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local storage and state
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("loginTime");
      setIsLoggedIn(false);
      setUser(null);
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

