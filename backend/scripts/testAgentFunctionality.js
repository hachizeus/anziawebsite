import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate';

async function testAgentFunctionality() {
  // Import the agent profile creation utility
  const { createAgentProfileForUser } = await import('../utils/createAgentProfile.js');
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Define User model with minimal schema
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }), 'users');
    
    // Define Agent model with minimal schema
    const Agent = mongoose.models.Agent || mongoose.model('Agent', new mongoose.Schema({}, { strict: false }), 'agents');
    
    // 1. Test: Find a user that's not an agent
    console.log('\n1. Finding a non-agent user...');
    const regularUser = await User.findOne({ role: { $ne: 'agent' } });
    
    if (!regularUser) {
      console.log('No non-agent users found. Test cannot continue.');
      return;
    }
    
    console.log(`Found user: ${regularUser._id} (${regularUser.email})`);
    
    // 2. Test: Change user to agent role
    console.log('\n2. Changing user role to agent...');
    regularUser.role = 'agent';
    await regularUser.save();
    console.log('User role updated to agent');
    
    // 3. Test: Check if agent profile was created
    console.log('\n3. Checking if agent profile was created...');
    let agentProfile = await Agent.findOne({ userId: regularUser._id });
    
    if (agentProfile) {
      console.log('✅ SUCCESS: Agent profile was automatically created!');
      console.log(`Agent profile ID: ${agentProfile._id}`);
    } else {
      console.log('❌ FAILURE: Agent profile was NOT created automatically');
      
      // Try to create it manually using the utility
      console.log('Attempting to create agent profile using utility...');
      try {
        agentProfile = await createAgentProfileForUser(regularUser._id, regularUser.email);
        console.log('✅ SUCCESS: Agent profile was created using utility!');
        console.log(`Agent profile ID: ${agentProfile._id}`);
      } catch (error) {
        console.log('❌ FAILURE: Could not create agent profile using utility:', error.message);
      }
    }
    
    // 4. Test: Change user back to regular user
    console.log('\n4. Changing user role back to user...');
    regularUser.role = 'user';
    await regularUser.save();
    console.log('User role updated back to user');
    
    // 5. Test: Check if agent profile was removed
    console.log('\n5. Checking if agent profile was removed...');
    agentProfile = await Agent.findOne({ userId: regularUser._id });
    
    if (!agentProfile) {
      console.log('✅ SUCCESS: Agent profile was automatically removed!');
    } else {
      console.log('❌ FAILURE: Agent profile was NOT removed automatically');
      console.log(`Agent profile still exists with ID: ${agentProfile._id}`);
    }
    
    console.log('\nTest completed!');
  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the test
testAgentFunctionality();
