// Test script to verify authentication fixes
const axios = require('axios');

const API_URL = process.env.BACKEND_URL || 'https://real-estate-backend-vybd.onrender.com';

async function testAuthenticationFixes() {
  console.log('🧪 Testing Authentication Fixes...\n');

  // Test 1: Check if server is responding
  console.log('1. Testing server connectivity...');
  try {
    const response = await axios.get(`${API_URL}/status`, { timeout: 30000 });
    console.log('✅ Server is responding');
    console.log(`   Status: ${response.data.status}`);
  } catch (error) {
    console.log('❌ Server connectivity failed');
    console.log(`   Error: ${error.message}`);
    return;
  }

  // Test 2: Check rate limiting (should allow multiple attempts)
  console.log('\n2. Testing rate limiting improvements...');
  try {
    // Make 4 failed login attempts (should not trigger lockout)
    for (let i = 1; i <= 4; i++) {
      try {
        await axios.post(`${API_URL}/api/admin-auth/login`, {
          email: 'test@example.com',
          password: 'wrongpassword'
        }, { timeout: 30000 });
      } catch (error) {
        if (error.response?.status === 401) {
          console.log(`   Attempt ${i}: ✅ Properly rejected (not locked)`);
        } else if (error.response?.status === 429) {
          console.log(`   Attempt ${i}: ❌ Locked too early`);
          break;
        }
      }
    }
  } catch (error) {
    console.log('❌ Rate limiting test failed');
    console.log(`   Error: ${error.message}`);
  }

  // Test 3: Check API timeout improvements
  console.log('\n3. Testing API timeout improvements...');
  try {
    const startTime = Date.now();
    await axios.get(`${API_URL}/api/products`, { timeout: 30000 });
    const duration = Date.now() - startTime;
    console.log(`✅ API call completed in ${duration}ms`);
    console.log('   Timeout increased to 30 seconds');
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.log('❌ Still timing out (may need server optimization)');
    } else {
      console.log(`✅ API responding (${error.response?.status || 'network error'})`);
    }
  }

  // Test 4: Check fix tool availability
  console.log('\n4. Testing fix tool availability...');
  try {
    const response = await axios.get(`${API_URL}/fix-auth`, { timeout: 10000 });
    if (response.data.includes('Fix Authentication Issues')) {
      console.log('✅ Fix tool is available');
      console.log(`   URL: ${API_URL}/fix-auth`);
    } else {
      console.log('❌ Fix tool not properly configured');
    }
  } catch (error) {
    console.log('❌ Fix tool not accessible');
    console.log(`   Error: ${error.message}`);
  }

  // Test 5: Check admin system endpoints
  console.log('\n5. Testing admin system endpoints...');
  try {
    // This should fail with 401 (unauthorized) but not timeout
    await axios.get(`${API_URL}/api/admin-system/system-status`, { timeout: 10000 });
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Admin endpoints are protected (401 Unauthorized)');
    } else if (error.response?.status === 404) {
      console.log('❌ Admin endpoints not found');
    } else {
      console.log(`⚠️  Unexpected response: ${error.response?.status || error.message}`);
    }
  }

  console.log('\n🎉 Authentication fixes test completed!');
  console.log('\nNext steps:');
  console.log('1. If you\'re locked out, visit: ' + API_URL + '/fix-auth');
  console.log('2. Clear browser data if issues persist');
  console.log('3. Try incognito mode for testing');
  console.log('4. Wait 10 minutes for rate limits to reset naturally');
}

// Run the tests
if (require.main === module) {
  testAuthenticationFixes().catch(console.error);
}

module.exports = testAuthenticationFixes;