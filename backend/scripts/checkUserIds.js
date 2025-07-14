import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate';

async function checkUserIds() {
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
      console.log(`User ID type: ${typeof user._id}`);
      console.log(`User ID string: ${user._id.toString()}`);
      console.log(`User ID equals original: ${user._id.toString() === userId}`);
    } else {
      console.log(`User ${userId} not found`);
    }
    
    // Get the specific agent profile
    const agentId = '6855d5fbbc5a7f70efdc01f6';
    const agent = await Agent.findById(agentId);
    
    if (agent) {
      console.log(`\nAgent found: ${agent._id}`);
      console.log(`Agent userId: ${agent.userId}`);
      console.log(`Agent userId type: ${typeof agent.userId}`);
      console.log(`Agent userId string: ${agent.userId.toString()}`);
      console.log(`Agent userId equals user ID: ${agent.userId.toString() === userId}`);
      
      // Try to find user by agent.userId
      const userByAgentId = await User.findById(agent.userId);
      console.log(`User found by agent.userId: ${userByAgentId ? 'Yes' : 'No'}`);
      if (userByAgentId) {
        console.log(`User email: ${userByAgentId.email}`);
        console.log(`User role: ${userByAgentId.role}`);
      }
    } else {
      console.log(`Agent ${agentId} not found`);
    }
    
    // List all users with agent role
    console.log('\nUsers with agent role:');
    const agentUsers = await User.find({ role: 'agent' });
    agentUsers.forEach(user => {
      console.log(`- ${user._id} (${user.email})`);
    });
    
    // List all agent profiles
    console.log('\nAgent profiles:');
    const agentProfiles = await Agent.find();
    agentProfiles.forEach(agent => {
      console.log(`- ${agent._id} (userId: ${agent.userId})`);
    });
    
    console.log('\nCheck completed!');
  } catch (error) {
    console.error('Error during check:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the check
checkUserIds();
