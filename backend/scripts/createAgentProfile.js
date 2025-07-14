import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate';

async function createAgentProfile() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Define models with minimal schema
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }), 'users');
    const Agent = mongoose.models.Agent || mongoose.model('Agent', new mongoose.Schema({}, { strict: false }), 'agents');
    
    // Get the specific user
    const userId = '684d5da97de2a88a1ea9ddeb';
    const user = await User.findById(userId);
    
    if (user) {
      console.log(`User found: ${user._id} (${user.email})`);
      console.log(`Current role: ${user.role}`);
      
      // Check if agent profile already exists
      const existingAgent = await Agent.findOne({ userId });
      
      if (existingAgent) {
        console.log(`Agent profile already exists: ${existingAgent._id}`);
      } else {
        // Create agent profile
        const newAgent = new Agent({
          userId,
          email: user.email,
          subscription: 'basic',
          active: true,
          visible: true,
          subscriptionExpiry: new Date(new Date().setMonth(new Date().getMonth() + 1))
        });
        
        await newAgent.save();
        console.log(`Created agent profile with ID: ${newAgent._id}`);
      }
    } else {
      console.log(`User ${userId} not found`);
    }
    
    console.log('\nCreation completed!');
  } catch (error) {
    console.error('Error during creation:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the creation
createAgentProfile();
