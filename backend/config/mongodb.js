import mongoose from 'mongoose';

// Add a schema plugin that ensures role field is always set
mongoose.plugin(schema => {
  // Only apply to User model schema
  if (schema.options.collection === 'users' || !schema.options.collection) {
    schema.pre('save', function(next) {
      // Force role to be 'user' if it's not set
      if (this.isNew && !this.get('role')) {
        this.set('role', 'user');
      }
      next();
    });
  }
});

// Function to ensure MongoDB URI is properly formatted
const getMongoURI = () => {
  try {
    // Get the MongoDB URI from environment variables
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    
    // Check if the URI is already properly formatted
    if (uri.startsWith('mongodb://') || uri.startsWith('mongodb+srv://')) {
      console.log('Using MongoDB URI from environment variables');
      return uri;
    } else {
      throw new Error('Invalid MongoDB URI format');
    }
  } catch (error) {
    console.error(`MongoDB URI Error: ${error.message}`);
    // Fallback to a hardcoded URI as a last resort
    return 'mongodb+srv://Makini:kkxA8io@makini.xwm8fkh.mongodb.net/?retryWrites=true&w=majority&appName=Makini';
  }
};

const connectdb = async () => {
  try {
    // Get the properly formatted MongoDB URI
    const uri = getMongoURI();
    console.log(`Connecting to MongoDB: ${uri.substring(0, 20)}...`);
    
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectdb;
