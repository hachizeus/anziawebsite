import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Use MongoDB Atlas connection with fallback to local
const uri = process.env.MONGODB_URI || 'mongodb+srv://anziaelectronics:0a0b0c0d@anziaelectronics.vfsc5md.mongodb.net/?retryWrites=true&w=majority&appName=anziaelectronics';
const dbName = process.env.MONGODB_DB_NAME || 'anziaelectronics';

console.log('MongoDB URI:', uri.replace(/:([^:@]+)@/, ':****@'));
console.log('MongoDB Database:', dbName);

let client;
let db;
let isConnected = false;

export const connectToDatabase = async () => {
  try {
    if (!client) {
      console.log('Attempting to connect to MongoDB...');
      
      const options = {
        serverSelectionTimeoutMS: 5000
      };
      
      client = new MongoClient(uri, options);
      await client.connect();
      console.log('Connected to MongoDB successfully');
      
      db = client.db(dbName);
      console.log(`Using database: ${dbName}`);
      isConnected = true;
    }
    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Using in-memory store as fallback');
    isConnected = false;
    return { client: null, db: null };
  }
};

export const getCollection = async (collectionName) => {
  try {
    if (!isConnected) {
      await connectToDatabase();
    }
    
    if (!db) {
      throw new Error('Database not connected');
    }
    
    return db.collection(collectionName);
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error);
    throw error;
  }
};

export const closeConnection = async () => {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('MongoDB connection closed');
  }
};

export default { connectToDatabase, getCollection, closeConnection };