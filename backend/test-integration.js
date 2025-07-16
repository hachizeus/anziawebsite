import dotenv from 'dotenv';
import { connectToDatabase, getCollection, closeConnection } from './config/mongodb.js';
import imagekit from './config/imagekit.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Test MongoDB connection
async function testMongoDBConnection() {
  try {
    console.log('Testing MongoDB connection...');
    const { client, db } = await connectToDatabase();
    console.log('MongoDB connected successfully!');
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    return true;
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    return false;
  }
}

// Test ImageKit configuration
async function testImageKitConfig() {
  try {
    console.log('\nTesting ImageKit configuration...');
    
    // Check if ImageKit credentials are set
    if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
      console.error('ImageKit credentials are not properly set in .env file');
      return false;
    }
    
    // Get ImageKit connection details
    const connection = {
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY ? 'Set' : 'Missing',
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY ? 'Set' : 'Missing',
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    };
    
    console.log('ImageKit configuration:', connection);
    
    // Get authentication parameters
    const authParams = imagekit.getAuthenticationParameters();
    console.log('Authentication parameters generated successfully:', authParams ? 'Yes' : 'No');
    
    return true;
  } catch (error) {
    console.error('ImageKit configuration test failed:', error);
    return false;
  }
}

// Test ImageKit upload
async function testImageKitUpload() {
  try {
    console.log('\nTesting ImageKit upload...');
    
    // Create a test image if it doesn't exist
    const testImagePath = path.join(__dirname, 'test-image.jpg');
    if (!fs.existsSync(testImagePath)) {
      // Create a simple 1x1 pixel image
      const imageData = Buffer.from([
        0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
        0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43,
        0x00, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
        0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
        0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
        0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
        0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff,
        0xff, 0xff, 0xff, 0xff, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01, 0x00,
        0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x14, 0x00, 0x01, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0xff, 0xc4, 0x00, 0x14, 0x10, 0x01, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
        0x00, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f, 0x00, 0x37,
        0xff, 0xd9
      ]);
      
      fs.writeFileSync(testImagePath, imageData);
      console.log('Created test image at:', testImagePath);
    }
    
    // Read the test image
    const imageFile = fs.readFileSync(testImagePath);
    const base64Image = imageFile.toString('base64');
    
    // Upload to ImageKit
    console.log('Uploading test image to ImageKit...');
    const uploadResult = await imagekit.upload({
      file: base64Image,
      fileName: `test-image-${Date.now()}.jpg`,
      folder: '/test'
    });
    
    console.log('Upload successful:', {
      url: uploadResult.url,
      fileId: uploadResult.fileId,
      name: uploadResult.name
    });
    
    // Delete the uploaded image
    console.log('\nDeleting test image from ImageKit...');
    const deleteResult = await imagekit.deleteFile(uploadResult.fileId);
    console.log('Delete result:', deleteResult);
    
    return true;
  } catch (error) {
    console.error('ImageKit upload test failed:', error);
    return false;
  }
}

// Run all tests
async function runTests() {
  try {
    console.log('=== MONGODB AND IMAGEKIT INTEGRATION TEST ===\n');
    
    // Test MongoDB connection
    const mongoConnectionSuccess = await testMongoDBConnection();
    
    // Test ImageKit configuration
    const imageKitConfigSuccess = await testImageKitConfig();
    
    // Test ImageKit upload
    const imageKitUploadSuccess = await testImageKitUpload();
    
    // Print test results
    console.log('\n=== TEST RESULTS ===');
    console.log('MongoDB Connection:', mongoConnectionSuccess ? '✅ PASSED' : '❌ FAILED');
    console.log('ImageKit Configuration:', imageKitConfigSuccess ? '✅ PASSED' : '❌ FAILED');
    console.log('ImageKit Upload:', imageKitUploadSuccess ? '✅ PASSED' : '❌ FAILED');
    
    // Overall result
    const allTestsPassed = mongoConnectionSuccess && imageKitConfigSuccess && imageKitUploadSuccess;
    console.log('\nOverall Result:', allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
    
    // Close MongoDB connection
    await closeConnection();
    
    return allTestsPassed;
  } catch (error) {
    console.error('Error running tests:', error);
    return false;
  }
}

// Run the tests
runTests()
  .then(success => {
    console.log('\nTests completed.');
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error running tests:', error);
    process.exit(1);
  });