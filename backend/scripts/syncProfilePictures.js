import mongoose from 'mongoose';
import Agent from '../models/agentModel.js';
import User from '../models/Usermodel.js';
import dotenv from 'dotenv';

dotenv.config();

const syncProfilePictures = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all agents with profile pictures
    const agents = await Agent.find({ profilePicture: { $exists: true, $ne: '' } })
      .populate('userId');

    console.log(`Found ${agents.length} agents with profile pictures`);

    for (const agent of agents) {
      if (agent.userId && agent.profilePicture) {
        const user = agent.userId;
        
        // Update user's profile picture fields
        user.profilePicture = agent.profilePicture;
        user.profileImage = agent.profilePicture;
        
        await user.save();
        
        console.log(`Updated profile picture for user: ${user.name} (${user.email})`);
        console.log(`Profile picture URL: ${agent.profilePicture}`);
      }
    }

    console.log('Profile picture sync completed');
    process.exit(0);
  } catch (error) {
    console.error('Error syncing profile pictures:', error);
    process.exit(1);
  }
};

syncProfilePictures();
