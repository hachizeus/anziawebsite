import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Property from '../models/propertymodel.js';

// Load environment variables
dotenv.config();

// Default map iframe
const defaultMapIframe = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d255282.35853743227!2d36.68258865!3d-1.3028617!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2sus!4v1686565423446!5m2!1sen!2sus" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';

// Connect to MongoDB
const fixMissingMapFields = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all properties without mapLocation field
    const properties = await Property.find({ mapLocation: { $exists: false } });
    console.log(`Found ${properties.length} properties without mapLocation field`);

    let fixedCount = 0;

    // Add mapLocation field to each product
    for (const property of properties) {
      // Use updateOne to add the field without triggering validation
      await Property.updateOne(
        { _id: property._id },
        { $set: { mapLocation: defaultMapIframe } }
      );
      console.log(`Added mapLocation to property ${property._id}`);
      fixedCount++;
    }

    console.log(`Fixed ${fixedCount} properties`);
    console.log('Done!');
  } catch (error) {
    console.error('Error fixing missing map fields:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

// Run the function
fixMissingMapFields();
