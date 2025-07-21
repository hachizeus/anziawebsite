const API_URL = 'https://anzia-electronics-api.onrender.com';

async function debugTest() {
    console.log('Testing specific endpoints...');
    
    // Test root
    try {
        const response = await fetch(`${API_URL}/`);
        console.log('Root Status:', response.status);
    } catch (error) {
        console.error('Root Error:', error.message);
    }
    
    // Test admin base
    try {
        const response = await fetch(`${API_URL}/api/admin`);
        console.log('Admin Base Status:', response.status);
        const text = await response.text();
        console.log('Admin Base Response:', text.substring(0, 100));
    } catch (error) {
        console.error('Admin Base Error:', error.message);
    }
    
    // Test users with full headers
    try {
        const response = await fetch(`${API_URL}/api/admin/users`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        console.log('Users Status:', response.status);
        const text = await response.text();
        console.log('Users Response:', text.substring(0, 200));
    } catch (error) {
        console.error('Users Error:', error.message);
    }
}

debugTest();