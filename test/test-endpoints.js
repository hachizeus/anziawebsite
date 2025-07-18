const axios = require('axios');

const API_URL = 'https://anzia-electronics-api.onrender.com/api';

async function testEndpoints() {
  console.log('🔍 Testing API Endpoints...\n');

  const endpoints = [
    { method: 'GET', url: '/health', name: 'Health Check' },
    { method: 'GET', url: '/products/list', name: 'Products List' },
    { method: 'POST', url: '/users/register', name: 'User Registration', data: { name: 'Test', email: 'test@test.com', password: '123' } }
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint.name}...`);
      
      let response;
      if (endpoint.method === 'GET') {
        response = await axios.get(`${API_URL}${endpoint.url}`);
      } else if (endpoint.method === 'POST') {
        response = await axios.post(`${API_URL}${endpoint.url}`, endpoint.data);
      }
      
      console.log(`✅ ${endpoint.name}: ${response.status} - ${response.data.message || 'OK'}`);
      
      if (endpoint.url === '/users/register' && response.data.success) {
        const userId = response.data.user._id;
        console.log(`   User ID: ${userId}`);
        
        // Test profile update with the created user
        try {
          console.log('Testing Profile Update...');
          const profileResponse = await axios.put(`${API_URL}/users/profile/${userId}`, {
            phone: '+254700000000',
            address: { city: 'Nairobi', country: 'Kenya' }
          });
          console.log(`✅ Profile Update: ${profileResponse.status} - Success`);
        } catch (profileError) {
          console.log(`❌ Profile Update: ${profileError.response?.status || 'Error'} - ${profileError.response?.data || profileError.message}`);
        }
      }
      
    } catch (error) {
      console.log(`❌ ${endpoint.name}: ${error.response?.status || 'Error'} - ${error.response?.data || error.message}`);
    }
    
    console.log('');
  }
}

testEndpoints();