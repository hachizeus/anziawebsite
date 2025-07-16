import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testMongoDBConnection() {
  console.log('Testing MongoDB connection...');
  
  const uri = process.env.MONGODB_URI || 'mongodb+srv://anziaelectronics:0a0b0c0d@anziaelectronics.vfsc5md.mongodb.net/?retryWrites=true&w=majority&appName=anziaelectronics';
  const dbName = process.env.MONGODB_DB_NAME || 'anziaelectronics';
  
  console.log('MongoDB URI:', uri.replace(/:([^:@]+)@/, ':****@'));
  console.log('MongoDB Database:', dbName);
  
  let client;
  
  try {
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected to MongoDB successfully');
    
    const db = client.db(dbName);
    console.log('Connected to database:', dbName);
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    // Test inserting a user
    const usersCollection = db.collection('users');
    const testUser = {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'hashedpassword',
      role: 'customer',
      created_at: new Date(),
      updated_at: new Date()
    };
    
    console.log('Inserting test user:', testUser.email);
    const result = await usersCollection.insertOne(testUser);
    console.log('Insert result:', result);
    
    if (result.acknowledged) {
      console.log('User inserted successfully with ID:', result.insertedId);
      
      // Verify user was inserted
      const insertedUser = await usersCollection.findOne({ _id: result.insertedId });
      console.log('User found after insert:', insertedUser ? 'Yes' : 'No');
      
      // Delete the test user
      await usersCollection.deleteOne({ _id: result.insertedId });
      console.log('Test user deleted');
    } else {
      console.error('Insert not acknowledged');
    }
    
    console.log('MongoDB connection test completed successfully');
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('MongoDB connection closed');
    }
    process.exit(0);
  }
}

testMongoDBConnection();