import axios from 'axios';

// This script tests the user role update functionality
// Run with: node test-user-role.js

const API_URL = 'http://localhost:4000'; // Change to your backend URL
const TOKEN = ''; // Add your admin token here

async function testUserRoleUpdate() {
  try {
    // 1. Get all users
    console.log('Fetching all users...');
    const usersResponse = await axios.get(`${API_URL}/api/admin/users`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    
    if (!usersResponse.data.success) {
      console.error('Failed to fetch users:', usersResponse.data);
      return;
    }
    
    const users = usersResponse.data.users;
    console.log(`Found ${users.length} users`);
    
    // 2. Find a regular user to update
    const regularUser = users.find(user => user.role === 'user');
    
    if (!regularUser) {
      console.error('No regular user found to update');
      return;
    }
    
    console.log(`Selected user: ${regularUser.name} (${regularUser.email}) with role: ${regularUser.role}`);
    
    // 3. Update user to tenant
    console.log(`Updating user ${regularUser._id} to tenant role...`);
    const updateResponse = await axios.put(
      `${API_URL}/api/admin/users/role`,
      { userId: regularUser._id, role: 'tenant' },
      { headers: { Authorization: `Bearer ${TOKEN}` } }
    );
    
    if (!updateResponse.data.success) {
      console.error('Failed to update user role:', updateResponse.data);
      return;
    }
    
    console.log('User role updated successfully:', updateResponse.data.message);
    console.log('Updated user:', updateResponse.data.user);
    
    // 4. Change back to user role
    console.log(`Changing user ${regularUser._id} back to user role...`);
    const revertResponse = await axios.put(
      `${API_URL}/api/admin/users/role`,
      { userId: regularUser._id, role: 'user' },
      { headers: { Authorization: `Bearer ${TOKEN}` } }
    );
    
    if (!revertResponse.data.success) {
      console.error('Failed to revert user role:', revertResponse.data);
      return;
    }
    
    console.log('User role reverted successfully:', revertResponse.data.message);
    console.log('Final user state:', revertResponse.data.user);
    
  } catch (error) {
    console.error('Error during test:', error.response?.data || error.message);
  }
}

testUserRoleUpdate();
