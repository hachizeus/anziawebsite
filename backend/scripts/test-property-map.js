import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from '../models/propertymodel.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const testproductMap = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get product ID from command line
    const productId = process.argv[2];
    
    if (!productId) {
      console.error('Please provide a product ID as an argument');
      process.exit(1);
    }

    // Find the product
    const property = await Property.findById(productId);
    
    if (!property) {
      console.error(`Property with ID ${productId} not found`);
      process.exit(1);
    }

    // Log property details
    console.log('Property details:');
    console.log(`ID: ${property._id}`);
    console.log(`Title: ${property.title}`);
    console.log(`Location: ${property.location}`);
    console.log(`Map Location exists: ${property.mapLocation !== undefined}`);
    console.log(`Map Location length: ${property.mapLocation ? property.mapLocation.length : 0}`);
    console.log(`Map Location content: ${property.mapLocation ? property.mapLocation.substring(0, 100) + '...' : 'None'}`);
    
    console.log('Done!');
  } catch (error) {
    console.error('Error testing product map:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

// Run the function
testproductMap();
