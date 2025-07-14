import mongoose from 'mongoose';

/**
 * Creates an agent profile for a user
 * @param {string} userId - The user ID
 * @param {string} email - The user's email
 * @returns {Promise<Object>} - The created agent object
 */
export async function createAgentProfileForUser(userId, email) {
  try {
    console.log(`Creating agent profile for user: ${userId}`);
    
    // Get Agent model
    const Agent = mongoose.model('Agent');
    
    // Check if agent profile already exists
    const existingAgent = await Agent.findOne({ userId });
    
    if (existingAgent) {
      console.log(`Agent profile already exists for user: ${userId}`);
      return existingAgent;
    }
    
    // Create agent profile
    const newAgent = new Agent({
      userId,
      email,
      subscription: 'basic',
      active: true,
      visible: true,
      subscriptionExpiry: new Date(new Date().setMonth(new Date().getMonth() + 1))
    });
    
    await newAgent.save();
    console.log(`Created agent profile with ID: ${newAgent._id}`);
    
    return newAgent;
  } catch (error) {
    console.error(`Error creating agent profile for user ${userId}:`, error);
    throw error;
  }
}
