import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('Testing MongoDB connection...');
console.log(`MongoDB URI: ${process.env.MONGODB_URI?.substring(0, 20)}...`);

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connection successful!');
    console.log(`Connected to: ${mongoose.connection.host}`);
    await mongoose.disconnect();
    console.log('Connection closed.');
  } catch (error) {
    console.error('MongoDB connection failed:');
    console.error(error);
  }
}

testConnection();
