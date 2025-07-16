import { connectToDatabase, getCollection } from '../config/mongodb.js';
import bcrypt from 'bcryptjs';

async function fixUsers() {
  try {
    console.log('Connecting to MongoDB...');
    const { db } = await connectToDatabase();
    
    // Get users collection
    const usersCollection = await getCollection('users');
    
    // Check if users exist in localStorage but not in MongoDB
    // Since we can't access localStorage directly, we'll create some common test users
    
    const testUsers = [
      { email: 'test@example.com', password: 'password123', name: 'Test User', role: 'customer' },
      { email: 'customer@example.com', password: 'customer123', name: 'Customer User', role: 'customer' },
      { email: 'admin@example.com', password: 'admin123', name: 'Admin User', role: 'admin' }
    ];
    
    console.log('Checking for missing users...');
    
    for (const user of testUsers) {
      // Check if user exists
      const existingUser = await usersCollection.findOne({ email: user.email });
      
      if (!existingUser) {
        console.log(`User ${user.email} not found in database, creating...`);
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        
        // Create user
        const newUser = {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role,
          created_at: new Date(),
          updated_at: new Date()
        };
        
        const result = await usersCollection.insertOne(newUser);
        console.log(`User ${user.email} created:`, result.acknowledged);
      } else {
        console.log(`User ${user.email} already exists in database`);
      }
    }
    
    // List all users
    const allUsers = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
    console.log('All users in database:', allUsers);
    
    console.log('User fix completed successfully');
  } catch (error) {
    console.error('Error fixing users:', error);
  } finally {
    process.exit(0);
  }
}

fixUsers();