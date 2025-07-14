import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/realestate';

async function testAgentproductAndProfile() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Define models with minimal schema
    const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }), 'users');
    const Agent = mongoose.models.Agent || mongoose.model('Agent', new mongoose.Schema({}, { strict: false }), 'agents');
    const product = mongoose.models.product || mongoose.model('product', new mongoose.Schema({}, { strict: false }), 'properties');
    
    // 1. Find or create an agent
    console.log('\n1. Finding or creating an agent...');
    
    // Find a user with agent role
    let agentUser = await User.findOne({ role: 'agent' });
    
    // If no agent found, create one
    if (!agentUser) {
      console.log('No agent found, creating one...');
      
      // Find a regular user
      const regularUser = await User.findOne({ role: { $ne: 'agent' } });
      
      if (!regularUser) {
        console.log('No users found. Test cannot continue.');
        return;
      }
      
      // Update user role to agent
      regularUser.role = 'agent';
      await regularUser.save();
      
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
      agentUser = regularUser;
      console.log(`Created agent with ID: ${newAgent._id}`);
    }
    
    console.log(`Using agent: ${agentUser._id} (${agentUser.email})`);
    
    // 2. Get agent profile
    console.log('\n2. Getting agent profile...');
    const agentProfile = await Agent.findOne({ userId: agentUser._id });
    
    if (!agentProfile) {
      console.log('Agent profile not found. Test cannot continue.');
      return;
    }
    
    console.log(`Found agent profile: ${agentProfile._id}`);
    
    // 3. Update agent profile
    console.log('\n3. Updating agent profile...');
    const updatedBio = `Updated bio ${new Date().toISOString()}`;
    const updatedPhone = `+254${Math.floor(Math.random() * 10000000)}`;
    
    agentProfile.bio = updatedBio;
    agentProfile.phone = updatedPhone;
    await agentProfile.save();
    
    console.log('Agent profile updated with:');
    console.log(`- Bio: ${updatedBio}`);
    console.log(`- Phone: ${updatedPhone}`);
    
    // 4. Create a product for the agent
    console.log('\n4. Creating a product for the agent...');
    const newproduct = new product({
      title: `Test product ${new Date().toISOString()}`,
      location: 'Test Location',
      price: 1000000,
      beds: 3,
      baths: 2,
      sqft: 1500,
      type: 'apartment',
      availability: 'for-sale',
      description: 'Test product description',
      agentId: agentProfile._id,
      createdBy: 'agent',
      visible: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await newproduct.save();
    console.log(`product created with ID: ${newproduct._id}`);
    
    // 5. Add product to agent's properties array
    console.log('\n5. Adding product to agent\'s properties array...');
    agentProfile.properties = agentProfile.properties || [];
    agentProfile.properties.push(newproduct._id);
    await agentProfile.save();
    console.log('product added to agent\'s properties array');
    
    // 6. Verify product is associated with agent
    console.log('\n6. Verifying product is associated with agent...');
    const agentProperties = await product.find({ agentId: agentProfile._id });
    console.log(`Found ${agentProperties.length} properties for agent`);
    
    const latestproduct = agentProperties[agentProperties.length - 1];
    console.log(`Latest product: ${latestproduct._id} - ${latestproduct.title}`);
    
    // 7. Clean up (optional - comment out to keep test data)
    console.log('\n7. Cleaning up...');
    await product.findByIdAndDelete(newproduct._id);
    console.log('product deleted');
    
    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Error during test:', error);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the test
testAgentproductAndProfile();
