import mongoose from 'mongoose';

// MongoDB connection string with direct connection option
const MONGO_URI = 'mongodb://victorgathecha:Gathecha2023@cluster0.ixvvnxs.mongodb.net/realestate?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Define User model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String
});
const User = mongoose.model('User', userSchema);

// Define Agent model
const agentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bio: String,
  phone: String,
  whatsapp: String,
  email: String,
  active: Boolean,
  subscription: String,
  subscriptionExpiry: Date,
  properties: [mongoose.Schema.Types.ObjectId],
  visible: Boolean,
  documents: [mongoose.Schema.Types.ObjectId],
  notes: String
}, { timestamps: true });
const Agent = mongoose.model('Agent', agentSchema);

async function updateAgents() {
  try {
    // Find all users with agent role
    const agentUsers = await User.find({ role: 'agent' });
    console.log(`Found ${agentUsers.length} users with agent role`);
    
    if (agentUsers.length === 0) {
      console.log('No users with agent role found');
      return;
    }
    
    // Create agent profiles for users without one
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
  } catch (error) {
    console.error('Error updating agents:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

// Run the function
updateAgents();
