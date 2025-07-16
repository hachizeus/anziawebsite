import { connectToDatabase, getCollection } from '../config/mongodb.js';

async function checkMongoDB() {
  try {
    console.log('Testing MongoDB connection...');
    const { db } = await connectToDatabase();
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('MongoDB collections:', collections.map(c => c.name));
    
    // Check if users collection exists, create it if not
    const hasUsersCollection = collections.some(c => c.name === 'users');
    if (!hasUsersCollection) {
      console.log('Creating users collection...');
      await db.createCollection('users');
      console.log('Users collection created successfully');
    }
    
    // Count users
    const usersCollection = await getCollection('users');
    const userCount = await usersCollection.countDocuments();
    console.log('User count in database:', userCount);
    
    // Create a test user if no users exist
    if (userCount === 0) {
      console.log('No users found, creating a test user...');
      const bcrypt = await import('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const testUser = {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      };
      
      const result = await usersCollection.insertOne(testUser);
      console.log('Test admin user created:', result.acknowledged);
    }
    
    // Get all users (without passwords)
    const users = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
    console.log('Users in database:', users);
    
    console.log('MongoDB check completed successfully');
  } catch (error) {
    console.error('MongoDB check failed:', error);
  } finally {
    process.exit(0);
  }
}

checkMongoDB();