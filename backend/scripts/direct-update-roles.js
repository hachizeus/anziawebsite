import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Connect to MongoDB
console.log('Connecting to MongoDB...');
console.log('MongoDB URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    updateUsersDirectly();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

async function updateUsersDirectly() {
  try {
    // Use the native MongoDB driver for a direct update
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');
    
    // Find users without role field
    const usersWithoutRole = await usersCollection.find({ role: { $exists: false } }).toArray();
    console.log(`Found ${usersWithoutRole.length} users without a role field`);
    
    if (usersWithoutRole.length > 0) {
      // Update all users without role to have 'user' role
      const result = await usersCollection.updateMany(
        { role: { $exists: false } },
        { $set: { role: 'user' } }
      );
      
      console.log(`Updated ${result.modifiedCount} users with 'user' role`);
    }
    
    // Verify all users now have a role
    const remainingUsersWithoutRole = await usersCollection.countDocuments({ role: { $exists: false } });
    console.log(`Remaining users without role: ${remainingUsersWithoutRole}`);
    
    console.log('Update complete');
  } catch (error) {
    console.error('Error updating users:', error);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}
