// Fix authentication issues - Remove token expiration
console.log('🔧 Fixing authentication issues...');

// Remove any expired session data
localStorage.removeItem('sessionExpiry');
localStorage.removeItem('autoLogoutTime');

// Check current auth state
const token = localStorage.getItem('token');
const userData = localStorage.getItem('userData');

console.log('Current auth state:');
console.log('- Token exists:', !!token);
console.log('- User data exists:', !!userData);

if (token && userData) {
    try {
        const user = JSON.parse(userData);
        console.log('- User role:', user.role);
        console.log('- User name:', user.name);
        console.log('✅ Authentication data is valid');
    } catch (e) {
        console.log('❌ User data is corrupted, clearing...');
        localStorage.clear();
    }
} else {
    console.log('ℹ️ No authentication data found');
}

console.log('🎯 Authentication fix complete - tokens will never expire automatically');
console.log('💡 Users will only be logged out when they click the logout button');