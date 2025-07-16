import dotenv from 'dotenv';
import { connectToDatabase, getCollection, closeConnection } from '../config/mongodb.js';
import imagekit from '../config/imagekit.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to download an image from a URL
async function downloadImage(url, outputPath) {
  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'arraybuffer'
    });
    
    fs.writeFileSync(outputPath, response.data);
    console.log(`Image downloaded to ${outputPath}`);
    return outputPath;
  } catch (error) {
    console.error(`Error downloading image from ${url}:`, error);
    return null;
  }
}

// Function to migrate products
async function migrateProducts() {
  try {
    console.log('Starting product migration to MongoDB and ImageKit...');
    
    // Connect to MongoDB
    await connectToDatabase();
    const productsCollection = await getCollection('products');
    
    // Get existing products from MongoDB
    const existingProducts = await productsCollection.find({}).toArray();
    console.log(`Found ${existingProducts.length} existing products in MongoDB`);
    
    // Create temp directory for images if it doesn't exist
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    
    // Process each product
    let successCount = 0;
    let failCount = 0;
    
    for (const product of existingProducts) {
      try {
        console.log(`Processing product: ${product.name} (ID: ${product._id})`);
        
        // Handle images - upload to ImageKit if they're not already ImageKit URLs
        const newImageUrls = [];
        
        if (product.images && product.images.length > 0) {
          for (let i = 0; i < product.images.length; i++) {
            const imageUrl = product.images[i];
            
            // Skip if already an ImageKit URL
            if (imageUrl.includes('ik.imagekit.io/q5jukn457')) {
              newImageUrls.push(imageUrl);
              console.log(`Image already on ImageKit: ${imageUrl}`);
              continue;
            }
            
            const imageName = `product_${product._id}_image_${i}${path.extname(imageUrl) || '.jpg'}`;
            const tempPath = path.join(tempDir, imageName);
            
            // Download image from current URL
            console.log(`Downloading image: ${imageUrl}`);
            const downloadedPath = await downloadImage(imageUrl, tempPath);
            
            if (downloadedPath) {
              // Upload to ImageKit
              console.log(`Uploading image to ImageKit: ${imageName}`);
              const imageFile = fs.readFileSync(downloadedPath);
              const base64Image = imageFile.toString('base64');
              
              const uploadResult = await imagekit.upload({
                file: base64Image,
                fileName: imageName,
                folder: '/product-images'
              });
              
              newImageUrls.push(uploadResult.url);
              console.log(`Image uploaded to ImageKit: ${uploadResult.url}`);
              
              // Delete temp file
              fs.unlinkSync(downloadedPath);
            } else {
              // If download fails, keep the original URL
              newImageUrls.push(imageUrl);
            }
          }
        }
        
        // Update product with new image URLs if any were changed
        if (newImageUrls.length > 0 && JSON.stringify(newImageUrls) !== JSON.stringify(product.images)) {
          const updateResult = await productsCollection.updateOne(
            { _id: product._id },
            { $set: { images: newImageUrls, updated_at: new Date() } }
          );
          
          console.log(`Product updated with new image URLs: ${updateResult.modifiedCount} document modified`);
        }
        
        successCount++;
      } catch (productError) {
        console.error(`Error processing product ${product._id}:`, productError);
        failCount++;
      }
    }
    
    console.log('\nMigration Summary:');
    console.log(`Total products: ${existingProducts.length}`);
    console.log(`Successfully processed: ${successCount}`);
    console.log(`Failed to process: ${failCount}`);
    
    // Clean up temp directory
    if (fs.existsSync(tempDir)) {
      fs.rmdirSync(tempDir, { recursive: true });
    }
    
    return { success: true, processed: successCount, failed: failCount };
  } catch (error) {
    console.error('Error during product migration:', error);
    return { success: false, error: error.message };
  } finally {
    // Close MongoDB connection
    await closeConnection();
  }
}

// Run the migration
async function runMigration() {
  console.log('=== COMPLETE MIGRATION TO MONGODB AND IMAGEKIT ===\n');
  
  // Migrate products
  const productResult = await migrateProducts();
  
  console.log('\n=== MIGRATION COMPLETE ===');
  console.log('Products Migration:', productResult.success ? '✅ SUCCESS' : '❌ FAILED');
  
  return productResult.success;
}

// Run the migration
runMigration()
  .then(success => {
    console.log('\nMigration process completed.');
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Fatal error during migration:', error);
    process.exit(1);
  });