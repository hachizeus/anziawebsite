import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate';

async function directAgentTest() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Define User model with minimal schema
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }), 'users');
    
    // Define Agent model with minimal schema
    const Agent = mongoose.models.Agent || mongoose.model('Agent', new mongoose.Schema({}, { strict: false }), 'agents');
    
    // Find a user that's not an agent
    console.log('\nFinding a non-agent user...');
    const regularUser = await User.findOne({ role: { $ne: 'agent' } });
    
    if (!regularUser) {
      console.log('No non-agent users found. Test cannot continue.');
      return;
    }
    
    console.log(`Found user: ${regularUser._id} (${regularUser.email})`);
    
    // Direct agent profile creation
    console.log('\nDirectly creating agent profile...');
    
    // First, ensure no agent profile exists
    await Agent.findOneAndDelete({ userId: regularUser._id });
    
    // Create agent profile
    const newAgent = new Agent({
      userId: regularUser._id,
      email: regularUser.email,
      subscription: 'basic',
      active: true,
      visible: true,
      subscriptionExpiry: new Date(new Date().setMonth(new Date().getMonth() + 1))
    });
    
    await newAgent.save();
    console.log(`Agent profile created with ID: ${newAgent._id}`);
    
    // Update user role
    regularUser.role = 'agent';
    await regularUser.save();
    console.log('User role updated to agent');
    
    // Verify agent profile exists
    const verifyAgent = await Agent.findOne({ userId: regularUser._id });
    console.log(`Agent profile verification: ${verifyAgent ? 'Success' : 'Failed'}`);
    
    // Test fetching agent profile
    console.log('\nFetching agent profile...');
    const fetchedAgent = await Agent.findOne({ userId: regularUser._id });
    
    if (fetchedAgent) {
      console.log('✅ SUCCESS: Agent profile fetched successfully');
      console.log(`Agent profile ID: ${fetchedAgent._id}`);
      console.log(`Agent email: ${fetchedAgent.email}`);
      console.log(`Agent subscription: ${fetchedAgent.subscription}`);
    } else {
      console.log('❌ FAILURE: Could not fetch agent profile');
    }
    
    // Clean up - remove agent profile and reset user role
    console.log('\nCleaning up...');
    await Agent.findOneAndDelete({ userId: regularUser._id });
    regularUser.role = 'user';
    await regularUser.save();
    console.log('Cleanup completed');
    
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
directAgentTest();
