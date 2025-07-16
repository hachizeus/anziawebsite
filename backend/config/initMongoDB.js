import { connectToDatabase, getCollection } from './mongodb.js';
import bcrypt from 'bcryptjs';

export const initializeMongoDB = async () => {
  try {
    console.log('Initializing MongoDB...');
    const { db } = await connectToDatabase();
    
    // List all collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    console.log('Available collections:', collectionNames.join(', ') || 'none');
    
    // Create required collections if they don't exist
    const requiredCollections = ['users', 'products', 'orders', 'categories'];
    
    for (const collName of requiredCollections) {
      if (!collectionNames.includes(collName)) {
        console.log(`Creating ${collName} collection...`);
        await db.createCollection(collName);
        console.log(`${collName} collection created successfully`);
      }
    }
    
    // Check if users collection has any users
    const usersCollection = await getCollection('users');
    const userCount = await usersCollection.countDocuments();
    console.log(`User count: ${userCount}`);
    
    // Create default admin user if no users exist
    if (userCount === 0) {
      console.log('No users found, creating default admin user...');
      
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);
      
      const adminUser = {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        created_at: new Date(),
        updated_at: new Date()
      };
      
      const result = await usersCollection.insertOne(adminUser);
      console.log('Default admin user created:', result.acknowledged);
      
      // Create a test customer user
      const customerSalt = await bcrypt.genSalt(10);
      const customerHashedPassword = await bcrypt.hash('customer123', salt);
      
      const customerUser = {
        name: 'Test Customer',
        email: 'customer@example.com',
        password: customerHashedPassword,
        role: 'customer',
        created_at: new Date(),
        updated_at: new Date()
      };
      
      const customerResult = await usersCollection.insertOne(customerUser);
      console.log('Test customer user created:', customerResult.acknowledged);
    }
    
    console.log('MongoDB initialization completed successfully');
    return true;
  } catch (error) {
    console.error('MongoDB initialization failed:', error);
    return false;
  }
};

export default initializeMongoDB;