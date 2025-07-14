// Script to be run from within the application
import mongoose from 'mongoose';
import User from '../models/Usermodel.js';
import Agent from '../models/agentModel.js';

export async function fixAgents() {
  try {
    console.log('Starting agent fix script...');
    
    // Find all users with agent role
    const agentUsers = await User.find({ role: 'agent' });
    console.log(`Found ${agentUsers.length} users with agent role`);
    
    let createdCount = 0;
    let existingCount = 0;
    
    for (const user of agentUsers) {
      // Check if agent profile already exists
      const existingAgent = await Agent.findOne({ userId: user._id });
      
      if (!existingAgent) {
        // Create agent profile
        const newAgent = new Agent({
          userId: user._id,
          email: user.email,
          subscription: 'basic',
          active: true,
          visible: true,
          subscriptionExpiry: new Date(new Date().setMonth(new Date().getMonth() + 1))
        });
        
        await newAgent.save();
        createdCount++;
        console.log(`Created agent profile for user ${user._id} (${user.email})`);
      } else {
        existingCount++;
        console.log(`Agent profile already exists for user ${user._id} (${user.email})`);
      }
    }
    
    console.log(`Summary: Created ${createdCount} new agent profiles, ${existingCount} already existed`);
    return { createdCount, existingCount };
  } catch (error) {
    console.error('Error fixing agents:', error);
    throw error;
  }
}

// Add a route to your server.js file to call this function:
// app.get('/api/admin/fix-agents', protect, admin, async (req, res) => {
//   try {
//     const result = await fixAgents();
//     res.json({ success: true, ...result });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// });
