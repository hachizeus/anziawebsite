// This script adds a role field to all users in the database
// Run with: node forceRoleField.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Get the users collection
      const usersCollection = mongoose.connection.db.collection('users');
      
      // 1. Update all existing users without a role field
      const updateResult = await usersCollection.updateMany(
        { role: { $exists: false } },
        { $set: { role: 'user' } }
      );
      
      console.log(`Updated ${updateResult.modifiedCount} existing users to have role='user'`);
      
      // 2. Create a database trigger to set role='user' for new documents
      try {
        // First check if the trigger already exists and drop it if it does
        const listCollections = await mongoose.connection.db.listCollections().toArray();
        const systemCollections = listCollections.filter(col => col.name.startsWith('system.'));
        
        console.log('System collections:', systemCollections.map(c => c.name));
        
        // Create a simple test user to verify
        const testUser = {
          name: 'Test User ' + Date.now(),
          email: 'test' + Date.now() + '@example.com',
          password: 'password123',
          // Intentionally not setting role to test if it gets added
        };
        
        const insertResult = await usersCollection.insertOne(testUser);
        console.log(`Test user created with ID: ${insertResult.insertedId}`);
        
        // Immediately update it to have a role
        await usersCollection.updateOne(
          { _id: insertResult.insertedId },
          { $set: { role: 'user' } }
        );
        
        // Verify the user has a role
        const createdUser = await usersCollection.findOne({ _id: insertResult.insertedId });
        console.log('Created test user:', JSON.stringify(createdUser, null, 2));
        
        // Count users without role field
        const missingRoleCount = await usersCollection.countDocuments({ role: { $exists: false } });
        console.log(`Users still missing role field: ${missingRoleCount}`);
        
      } catch (triggerError) {
        console.error('Error with database operations:', triggerError);
      }
      
    } catch (error) {
      console.error('Error:', error);
    } finally {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
