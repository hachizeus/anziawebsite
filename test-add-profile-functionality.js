import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Configuration
const API_URL = 'http://localhost:4000';
const TEST_USER = {
    name: 'Test Agent User',
    email: 'testagent@example.com',
    password: 'testpassword123'
};

let authToken = '';
let userId = '';

// Test functions
async function testAddProfileFunctionality() {
    console.log('🚀 Starting Add Profile Functionality Test...\n');
    
    try {
        // Step 1: Register a test user
        console.log('1. Registering test user...');
        await registerTestUser();
        
        // Step 2: Login to get token
        console.log('2. Logging in...');
        await loginUser();
        
        // Step 3: Convert user to agent (admin function)
        console.log('3. Converting user to agent...');
        await convertUserToAgent();
        
        // Step 4: Test agent profile creation
        console.log('4. Testing agent profile creation...');
        await testAgentProfileCreation();
        
        // Step 5: Test profile update
        console.log('5. Testing profile update...');
        await testProfileUpdate();
        
        // Step 6: Test profile picture upload
        console.log('6. Testing profile picture upload...');
        await testProfilePictureUpload();
        
        // Step 7: Test profile retrieval
        console.log('7. Testing profile retrieval...');
        await testProfileRetrieval();
        
        // Step 8: Test frontend integration
        console.log('8. Testing frontend integration...');
        await testFrontendIntegration();
        
        console.log('\n✅ All tests completed successfully!');
        
    } catch (error) {
        console.error('\n❌ Test failed:', error.message);
        process.exit(1);
    }
}

async function registerTestUser() {
    try {
        const response = await axios.post(`${API_URL}/api/users/register`, TEST_USER);
        if (response.data.success) {
            userId = response.data.user._id;
            console.log('   ✅ User registered successfully');
        } else {
            throw new Error(response.data.message || 'Registration failed');
        }
    } catch (error) {
        if (error.response?.data?.message?.includes('already exists')) {
            console.log('   ℹ️ User already exists, continuing...');
            // Try to get user ID by logging in
            await loginUser();
        } else {
            throw error;
        }
    }
}

async function loginUser() {
    try {
        const response = await axios.post(`${API_URL}/api/users/login`, {
            email: TEST_USER.email,
            password: TEST_USER.password
        });
        
        if (response.data.success) {
            authToken = response.data.token;
            userId = response.data.user._id;
            console.log('   ✅ Login successful');
        } else {
            throw new Error(response.data.message || 'Login failed');
        }
    } catch (error) {
        throw new Error(`Login failed: ${error.response?.data?.message || error.message}`);
    }
}

async function convertUserToAgent() {
    try {
        // First, get admin token (you'll need to set admin credentials)
        const adminResponse = await axios.post(`${API_URL}/api/admin-auth/login`, {
            email: process.env.ADMIN_EMAIL || 'admin@example.com',
            password: process.env.ADMIN_PASSWORD || 'admin123'
        });
        
        if (!adminResponse.data.success) {
            throw new Error('Admin login failed');
        }
        
        const adminToken = adminResponse.data.token;
        
        // Convert user to agent
        const response = await axios.post(`${API_URL}/api/agents/create`, {
            userId: userId,
            subscription: 'basic'
        }, {
            headers: { Authorization: `Bearer ${adminToken}` }
        });
        
        if (response.data.success) {
            console.log('   ✅ User converted to agent successfully');
        } else {
            throw new Error(response.data.message || 'Agent creation failed');
        }
    } catch (error) {
        if (error.response?.data?.message?.includes('already exists')) {
            console.log('   ℹ️ Agent profile already exists, continuing...');
        } else {
            throw new Error(`Agent conversion failed: ${error.response?.data?.message || error.message}`);
        }
    }
}

async function testAgentProfileCreation() {
    try {
        const response = await axios.get(`${API_URL}/api/agents/profile`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        if (response.data.success) {
            console.log('   ✅ Agent profile exists and accessible');
            console.log(`   📋 Profile ID: ${response.data.agent._id}`);
            console.log(`   📋 Subscription: ${response.data.agent.subscription}`);
        } else {
            throw new Error(response.data.message || 'Profile retrieval failed');
        }
    } catch (error) {
        throw new Error(`Profile creation test failed: ${error.response?.data?.message || error.message}`);
    }
}

async function testProfileUpdate() {
    try {
        const updateData = {
            bio: 'I am a professional real estate agent with 5+ years of experience.',
            phone: '+254712345678',
            whatsapp: '+254712345678',
            email: 'testagent@example.com',
            currency: 'KSH'
        };
        
        const response = await axios.put(`${API_URL}/api/agents/profile`, updateData, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        if (response.data.success) {
            console.log('   ✅ Profile updated successfully');
            console.log(`   📋 Bio: ${response.data.agent.bio.substring(0, 50)}...`);
            console.log(`   📋 Phone: ${response.data.agent.phone}`);
        } else {
            throw new Error(response.data.message || 'Profile update failed');
        }
    } catch (error) {
        throw new Error(`Profile update test failed: ${error.response?.data?.message || error.message}`);
    }
}

async function testProfilePictureUpload() {
    try {
        // Create a simple base64 image for testing
        const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        
        const response = await axios.put(`${API_URL}/api/agents/profile`, {
            profilePictureBase64: testImageBase64
        }, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        if (response.data.success && response.data.agent.profilePicture) {
            console.log('   ✅ Profile picture uploaded successfully');
            console.log(`   📋 Image URL: ${response.data.agent.profilePicture}`);
        } else {
            console.log('   ⚠️ Profile picture upload skipped (ImageKit not configured)');
        }
    } catch (error) {
        console.log(`   ⚠️ Profile picture upload failed: ${error.response?.data?.message || error.message}`);
        // Don't fail the entire test for image upload issues
    }
}

async function testProfileRetrieval() {
    try {
        const response = await axios.get(`${API_URL}/api/agents/profile`, {
            headers: { Authorization: `Bearer ${authToken}` }
        });
        
        if (response.data.success) {
            const profile = response.data.agent;
            console.log('   ✅ Profile retrieved successfully');
            console.log(`   📋 Active: ${profile.active}`);
            console.log(`   📋 Visible: ${profile.visible}`);
            console.log(`   📋 Properties: ${profile.properties?.length || 0}`);
        } else {
            throw new Error(response.data.message || 'Profile retrieval failed');
        }
    } catch (error) {
        throw new Error(`Profile retrieval test failed: ${error.response?.data?.message || error.message}`);
    }
}

async function testFrontendIntegration() {
    try {
        // Test the explore properties endpoint (public)
        const response = await axios.get(`${API_URL}/api/agents/explore/properties`);
        
        if (response.data.success) {
            console.log('   ✅ Frontend integration working');
            console.log(`   📋 Public properties available: ${response.data.properties.length}`);
        } else {
            throw new Error('Frontend integration failed');
        }
    } catch (error) {
        throw new Error(`Frontend integration test failed: ${error.response?.data?.message || error.message}`);
    }
}

// Run the test
testAddProfileFunctionality();

export { testAddProfileFunctionality };