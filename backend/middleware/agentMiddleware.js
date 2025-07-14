import mongoose from 'mongoose';

/**
 * Middleware to handle agent profile creation and removal
 */
export const handleAgentRoleChanges = async (req, res, next) => {
  try {
    const { userId, role } = req.body;
    
    // Only proceed if this is a role change request
    if (!userId || !role) {
      return next();
    }
    
    // Get the user
    const User = mongoose.model('User');
    const user = await User.findById(userId);
    
    if (!user) {
      return next();
    }
    
    const oldRole = user.role;
    const newRole = role;
    
    // Store the original role for later use
    req.oldRole = oldRole;
    
    // If changing to agent role, create agent profile
    if (newRole === 'agent' && oldRole !== 'agent') {
      const Agent = mongoose.model('Agent');
      const existingAgent = await Agent.findOne({ userId });
      
      if (!existingAgent) {
        const newAgent = new Agent({
          userId,
          email: user.email,
          subscription: 'basic',
          active: true,
          visible: true,
          subscriptionExpiry: new Date(new Date().setMonth(new Date().getMonth() + 1))
        });
        
        await newAgent.save();
        console.log(`Agent profile created for user ${userId}`);
      }
    }
    
    // If changing from agent role, remove agent profile
    if (oldRole === 'agent' && newRole !== 'agent') {
      const Agent = mongoose.model('Agent');
      await Agent.findOneAndDelete({ userId });
      console.log(`Agent profile removed for user ${userId}`);
    }
    
    next();
  } catch (error) {
    console.error('Error in agent middleware:', error);
    next();
  }
};
