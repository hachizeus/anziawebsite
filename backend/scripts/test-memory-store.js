import * as inMemoryStore from '../utils/inMemoryStore.js';
import bcrypt from 'bcryptjs';

async function testMemoryStore() {
  try {
    console.log('Testing in-memory store...');
    
    // Create a test user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('test123', salt);
    
    const testUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      role: 'customer'
    };
    
    // Add user to store
    const createdUser = await inMemoryStore.createUser(testUser);
    console.log('User created:', createdUser);
    
    // Find user by email
    const foundUser = await inMemoryStore.findUserByEmail('test@example.com');
    console.log('User found by email:', foundUser ? 'Yes' : 'No');
    
    // Find user by ID
    const foundById = await inMemoryStore.findUserById(createdUser._id);
    console.log('User found by ID:', foundById ? 'Yes' : 'No');
    
    // Get all users
    const allUsers = await inMemoryStore.getAllUsers();
    console.log('All users:', allUsers);
    
    console.log('In-memory store test completed successfully');
  } catch (error) {
    console.error('Error testing in-memory store:', error);
  } finally {
    process.exit(0);
  }
}

testMemoryStore();