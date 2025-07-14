// Token validation utility - ALWAYS VALID
export const validateToken = () => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('userData');
  
  // ALWAYS return valid - never expire
  return {
    hasToken: !!token,
    hasUserData: !!userData,
    token: token,
    isValid: true // ALWAYS VALID
  };
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userData');
  localStorage.removeItem('loginTime');
  console.log('Auth data cleared');
};

