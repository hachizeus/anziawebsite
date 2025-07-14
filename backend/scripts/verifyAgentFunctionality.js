import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate';

async function verifyAgentFunctionality() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Define models with minimal schema
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }), 'users');
    const Agent = mongoose.models.Agent || mongoose.model('Agent', new mongoose.Schema({}, { strict: false }), 'agents');
    
    // 1. Count users with agent role
    console.log('\n1. Counting users with agent role...');
    const agentUsersCount = await User.countDocuments({ role: 'agent' });
    console.log(`Found ${agentUsersCount} users with agent role`);
    
    // 2. Count agent profiles
    console.log('\n2. Counting agent profiles...');
    const agentProfilesCount = await Agent.countDocuments();
    console.log(`Found ${agentProfilesCount} agent profiles`);
    
    // 3. Check for consistency
    console.log('\n3. Checking for consistency...');
    if (agentUsersCount === agentProfilesCount) {
      console.log('✅ CONSISTENT: Number of agent users matches number of agent profiles');
    } else {
      console.log('❌ INCONSISTENT: Number of agent users does not match number of agent profiles');
      
      // 3.1. Find users with agent role but no agent profile
      const agentUsers = await User.find({ role: 'agent' });
      const agentUserIds = agentUsers.map(user => user._id.toString());
      
      const agentProfiles = await Agent.find();
      const profileUserIds = agentProfiles.map(profile => profile.userId.toString());
      
      const usersWithoutProfiles = agentUsers.filter(user => 
        !profileUserIds.includes(user._id.toString())
      );
      
      if (usersWithoutProfiles.length > 0) {
        console.log(`Found ${usersWithoutProfiles.length} users with agent role but no agent profile:`);
        usersWithoutProfiles.forEach(user => {
          console.log(`- ${user._id} (${user.email})`);
        });
      }
      
      // 3.2. Find agent profiles with no corresponding user with agent role
      const profilesWithoutAgentUsers = agentProfiles.filter(profile => 
        !agentUserIds.includes(profile.userId.toString())
      );
      
      if (profilesWithoutAgentUsers.length > 0) {
        console.log(`Found ${profilesWithoutAgentUsers.length} agent profiles with no corresponding user with agent role:`);
        profilesWithoutAgentUsers.forEach(profile => {
          console.log(`- ${profile._id} (userId: ${profile.userId})`);
        });
      }
    }
    
    console.log('\nVerification completed!');
  } catch (error) {
    console.error('Error during verification:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the verification
verifyAgentFunctionality();
