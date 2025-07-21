const API_URL = 'https://anzia-electronics-api.onrender.com';

async function testUsersAPI() {
    console.log('Testing Users API...');
    try {
        const response = await fetch(`${API_URL}/api/admin/users`);
        console.log('Users API Status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Users API Response:', data);
            console.log('Number of users:', data.users?.length || 0);
            
            if (data.users && data.users.length > 0) {
                console.log('Sample user:', data.users[0]);
                console.log('User roles found:', [...new Set(data.users.map(u => u.role))]);
            }
        } else {
            const text = await response.text();
            console.log('Error response:', text.substring(0, 200));
        }
    } catch (error) {
        console.error('Users API Error:', error.message);
    }
}

testUsersAPI();