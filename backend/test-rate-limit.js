// Simple test script to verify rate limiting works
import axios from 'axios';

const API_URL = 'http://localhost:5000';

async function testRateLimit() {
  console.log('Testing rate limiting...');
  
  const testCredentials = {
    email: 'test@invalid.com',
    password: 'wrongpassword'
  };
  
  try {
    // Make 6 failed login attempts
    for (let i = 1; i <= 6; i++) {
      console.log(`\nAttempt ${i}:`);
      
      try {
        const response = await axios.post(`${API_URL}/api/users/login`, testCredentials);
        console.log('Unexpected success:', response.data);
      } catch (error) {
        if (error.response) {
          console.log(`Status: ${error.response.status}`);
          console.log(`Message: ${error.response.data.message}`);
          
          if (error.response.status === 429) {
            console.log(`Lockout seconds: ${error.response.data.lockoutSeconds}`);
            break;
          }
        } else {
          console.log('Network error:', error.message);
        }
      }
      
      // Small delay between attempts
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\nWaiting 5 seconds then trying again...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    try {
      const response = await axios.post(`${API_URL}/api/users/login`, testCredentials);
      console.log('Unexpected success after wait:', response.data);
    } catch (error) {
      if (error.response) {
        console.log(`After wait - Status: ${error.response.status}`);
        console.log(`After wait - Message: ${error.response.data.message}`);
      }
    }
    
  } catch (error) {
    console.error('Test error:', error.message);
  }
}

// Run test if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testRateLimit();
}

export default testRateLimit;
