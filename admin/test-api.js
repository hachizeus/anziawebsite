const API_URL = 'https://anzia-electronics-api.onrender.com';

async function testUsersAPI() {
    console.log('Testing Users API...');
    try {
        const response = await fetch(`${API_URL}/api/admin/users`);
        console.log('Users API Status:', response.status);
        const data = await response.json();
        console.log('Users API Response:', data);
    } catch (error) {
        console.error('Users API Error:', error.message);
    }
}

async function testStatsAPI() {
    console.log('Testing Stats API...');
    try {
        const response = await fetch(`${API_URL}/api/admin/stats`);
        console.log('Stats API Status:', response.status);
        const data = await response.json();
        console.log('Stats API Response:', data);
    } catch (error) {
        console.error('Stats API Error:', error.message);
    }
}

// Run tests
async function runTests() {
    console.log('Starting API Tests...');
    await testUsersAPI();
    console.log('---');
    await testStatsAPI();
    console.log('Tests completed.');
}

runTests();