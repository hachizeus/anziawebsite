import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Define User schema for this script
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String
});

const User = mongoose.model('User', UserSchema);

async function updateUsers() {
  try {
    // Find all users without a role field
    const usersToUpdate = await User.find({ role: { $exists: false } });
    console.log(`Found ${usersToUpdate.length} users without a role field`);

    // Update each user to have the default 'user' role
    for (const user of usersToUpdate) {
      user.role = 'user';
      await user.save();
      console.log(`Updated user: ${user.email}`);
    }

    console.log('All users updated successfully');
  } catch (error) {
    console.error('Error updating users:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the update function
updateUsers();
