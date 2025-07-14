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
      // Wait for connection to be fully established
      await mongoose.connection.asPromise();
      
      // Get the database name from the connection string
      const dbName = mongoose.connection.db.databaseName;
      console.log(`Using database: ${dbName}`);
      
      // Update the collection directly
      const result = await mongoose.connection.db.collection('users').updateMany(
        { role: { $exists: false } },
        { $set: { role: 'user' } }
      );
      
      console.log(`Updated ${result.modifiedCount} users without a role field`);
      
      // Verify the fix
      const missingRoleCount = await mongoose.connection.db.collection('users').countDocuments({ role: { $exists: false } });
      console.log(`Users still missing role field: ${missingRoleCount}`);
      
      if (missingRoleCount === 0) {
        console.log('All users now have a role field!');
      }
    } catch (error) {
      console.error('Error fixing user schema:', error);
    } finally {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
