// Utility script to clear all authentication lockouts and reset the system
// Run this in browser console or as a standalone script

function clearAllLockouts() {
  console.log('Clearing all authentication lockouts...');
  
  // Clear frontend lockouts
  localStorage.removeItem('adminLoginLockout');
  localStorage.removeItem('adminFailedAttempts');
  localStorage.removeItem('userLoginLockout');
  localStorage.removeItem('userFailedAttempts');
  
  // Clear expired tokens
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const tokenData = JSON.parse(atob(token.split('.')[1]));
      if (tokenData.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('user');
        console.log('Cleared expired tokens');
      }
    } catch (error) {
      console.log('Invalid token found, clearing...');
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('user');
    }
  }
  
  // Clear session storage
  sessionStorage.clear();
  
  console.log('All lockouts and expired data cleared!');
  console.log('You can now try logging in again.');
  
  // Reload the page to reset the application state
  if (typeof window !== 'undefined') {
    window.location.reload();
  }
}

// Auto-execute if running in browser
if (typeof window !== 'undefined') {
  clearAllLockouts();
} else {
  // Export for Node.js usage
  module.exports = clearAllLockouts;
}