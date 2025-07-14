import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate';

async function directUpdate() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the database
    const db = mongoose.connection.db;
    
    // Direct update using the MongoDB driver
    const userId = '684d5da97de2a88a1ea9ddeb';
    console.log(`Updating user ${userId} role to agent...`);
    
    const result = await db.collection('users').updateOne(
      { _id: new mongoose.Types.ObjectId(userId) },
      { $set: { role: 'agent' } }
    );
    
    console.log(`Update result: ${JSON.stringify(result)}`);
    
    // Verify the update
    const user = await db.collection('users').findOne({ _id: new mongoose.Types.ObjectId(userId) });
    console.log(`User role after update: ${user.role}`);
    
    // Delete the agent profile if it exists
    const agentId = '6855d5fbbc5a7f70efdc01f6';
    console.log(`Deleting agent profile ${agentId}...`);
    
    const deleteResult = await db.collection('agents').deleteOne({ _id: new mongoose.Types.ObjectId(agentId) });
    console.log(`Delete result: ${JSON.stringify(deleteResult)}`);
    
    console.log('\nUpdate completed!');
  } catch (error) {
    console.error('Error during update:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the update
directUpdate();
