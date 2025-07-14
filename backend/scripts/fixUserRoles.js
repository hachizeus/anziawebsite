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
  .then(async () => {
    console.log('Connected to MongoDB');
    
    try {
      // Update users missing the role field
      const result = await mongoose.connection.db.collection('users').updateMany(
        { role: { $exists: false } },
        { $set: { role: 'user' } }
      );
      
      console.log(`Updated ${result.modifiedCount} users without a role field`);
    } catch (error) {
      console.error('Error updating users:', error);
    } finally {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
