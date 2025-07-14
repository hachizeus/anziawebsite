import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MaintenanceRequest from './models/maintenanceRequestModel.js';
import User from './models/Usermodel.js';
import Property from './models/propertymodel.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Test maintenance request functionality
const testMaintenanceRequests = async () => {
  try {
    // Check if MaintenanceRequest model exists
    console.log('Testing MaintenanceRequest model...');
    
    // Count existing maintenance requests
    const count = await MaintenanceRequest.countDocuments();
    console.log(`Found ${count} maintenance requests in the database`);
    
    // Get a sample tenant user
    const tenant = await User.findOne({ role: 'tenant' });
    if (!tenant) {
      console.log('No tenant users found in the database');
      return;
    }
    console.log(`Found tenant user: ${tenant.name} (${tenant._id})`);
    
    // Get a sample property
    const property = await Property.findOne();
    if (!property) {
      console.log('No properties found in the database');
      return;
    }
    console.log(`Found property: ${property.title} (${property._id})`);
    
    // Create a test maintenance request
    const testRequest = new MaintenanceRequest({
      tenant: tenant._id,
      product: property._id,
      title: 'Test Maintenance Request',
      description: 'This is a test maintenance request created by the test script',
      priority: 'medium',
      category: 'other',
      location: 'Test Location',
      availableTimes: 'Anytime',
      images: []
    });
    
    // Save the test request
    await testRequest.save();
    console.log(`Created test maintenance request: ${testRequest._id}`);
    
    // Fetch the test request
    const fetchedRequest = await MaintenanceRequest.findById(testRequest._id)
      .populate('tenant', 'name email')
      .populate('product', 'title location');
    
    console.log('Fetched maintenance request:');
    console.log({
      id: fetchedRequest._id,
      title: fetchedRequest.title,
      tenant: fetchedRequest.tenant.name,
      product: fetchedRequest.product.title,
      status: fetchedRequest.status,
      createdAt: fetchedRequest.createdAt
    });
    
    // Delete the test request
    await MaintenanceRequest.findByIdAndDelete(testRequest._id);
    console.log('Test maintenance request deleted');
    
    console.log('MaintenanceRequest model test completed successfully');
  } catch (error) {
    console.error('Error testing maintenance requests:', error);
  }
};

// Run the test
(async () => {
  await connectDB();
  await testMaintenanceRequests();
  mongoose.connection.close();
})();
