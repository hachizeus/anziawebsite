import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from '../models/propertymodel.js';

// Load environment variables
dotenv.config();

// Function to check if a string is likely an iframe
const isIframe = (str) => {
  return typeof str === 'string' && 
         str.includes('<iframe') && 
         str.includes('</iframe>');
};

// Connect to MongoDB
const fixMapLocations = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all properties
    const properties = await Property.find({});
    console.log(`Found ${properties.length} properties`);

    let fixedCount = 0;

    // Check each product
    for (const property of properties) {
      // Check if title contains iframe code
      if (isIframe(property.title)) {
        console.log(`Found iframe in title for property: ${property._id}`);
        
        // Save the original title in case we need it
        const originalTitle = property.title;
        
        // Move iframe from title to mapLocation
        property.mapLocation = originalTitle;
        
        // Set a default title
        property.title = `Property at ${property.location}`;
        
        // Save the updated property
        await property.save();
        
        console.log(`Fixed property ${property._id}: moved iframe from title to mapLocation`);
        fixedCount++;
      }
    }

    console.log(`Fixed ${fixedCount} properties`);
    console.log('Done!');
  } catch (error) {
    console.error('Error fixing map locations:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

// Run the function
fixMapLocations();
