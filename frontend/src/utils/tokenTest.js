// Simple utility to test token storage and retrieval

export const testToken = () => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('userData');
  
  console.log('Token test results:');
  console.log('Token exists:', !!token);
  if (token) {
    console.log('Token preview:', token.substring(0, 20) + '...');
  }
  
  console.log('User data exists:', !!userData);
  if (userData) {
    try {
      const parsedUserData = JSON.parse(userData);
      console.log('User data:', parsedUserData);
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
  }
  
  return { token, userData };
};

// Add this to any component to test token storage
// import { testToken } from '../utils/tokenTest';
// useEffect(() => {
//   testToken();
// }, []);

