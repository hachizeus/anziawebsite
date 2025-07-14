// Session manager - UNLIMITED SESSIONS
export const isSessionValid = () => {
  // Always return true - no expiration
  return true;
};

export const clearExpiredSession = () => {
  // Do nothing - sessions never expire
  return false;
};

export const getSessionInfo = () => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('userData');
  const loginTime = localStorage.getItem('loginTime');
  
  return {
    hasToken: !!token,
    hasUserData: !!userData,
    loginTime: loginTime,
    isValid: !!(token && userData)
  };
};

