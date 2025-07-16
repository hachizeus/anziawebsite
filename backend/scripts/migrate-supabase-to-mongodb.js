import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
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

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://kasdvsdakhvfgynmjcxi.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthc2R2c2Rha2h2Zmd5bm1qY3hpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjQ3NzE5MCwiZXhwIjoyMDY4MDUzMTkwfQ.n-A1TPeVE8zEYy6Vhfzg16tqptWuDKesV3xiz0xIb8U';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

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
    console.log('Starting product migration from Supabase to MongoDB...');
    
    // Get products from Supabase
    const { data: products, error } = await supabase
      .from('products')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    console.log(`Found ${products.length} products in Supabase`);
    
    // Connect to MongoDB
    await connectToDatabase();
    const productsCollection = await getCollection('products');
    
    // Create temp directory for images if it doesn't exist
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    
    // Process each product
    let successCount = 0;
    let failCount = 0;
    
    for (const product of products) {
      try {
        console.log(`Processing product: ${product.name} (ID: ${product.id})`);
        
        // Handle images - download from Supabase and upload to ImageKit
        const newImageUrls = [];
        
        if (product.images && product.images.length > 0) {
          for (let i = 0; i < product.images.length; i++) {
            const imageUrl = product.images[i];
            const imageName = `product_${product.id}_image_${i}${path.extname(imageUrl) || '.jpg'}`;
            const tempPath = path.join(tempDir, imageName);
            
            // Download image from Supabase
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
            }
          }
        }
        
        // Prepare product data for MongoDB
        const mongoProduct = {
          ...product,
          images: newImageUrls.length > 0 ? newImageUrls : product.images,
          created_at: new Date(product.created_at || Date.now()),
          updated_at: new Date(product.updated_at || Date.now())
        };
        
        // Remove Supabase ID and use it as _id in MongoDB
        delete mongoProduct.id;
        
        // Insert into MongoDB
        const result = await productsCollection.insertOne(mongoProduct);
        console.log(`Product inserted into MongoDB with ID: ${result.insertedId}`);
        
        successCount++;
      } catch (productError) {
        console.error(`Error migrating product ${product.id}:`, productError);
        failCount++;
      }
    }
    
    console.log('\nMigration Summary:');
    console.log(`Total products: ${products.length}`);
    console.log(`Successfully migrated: ${successCount}`);
    console.log(`Failed to migrate: ${failCount}`);
    
    // Clean up temp directory
    if (fs.existsSync(tempDir)) {
      fs.rmdirSync(tempDir, { recursive: true });
    }
    
    return { success: true, migrated: successCount, failed: failCount };
  } catch (error) {
    console.error('Error during product migration:', error);
    return { success: false, error: error.message };
  } finally {
    // Close MongoDB connection
    await closeConnection();
  }
}

// Function to migrate users
async function migrateUsers() {
  try {
    console.log('\nStarting user migration from Supabase to MongoDB...');
    
    // Get users from Supabase Auth
    const { data: users, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      throw error;
    }
    
    console.log(`Found ${users.users.length} users in Supabase Auth`);
    
    // Connect to MongoDB
    await connectToDatabase();
    const usersCollection = await getCollection('users');
    
    // Process each user
    let successCount = 0;
    let failCount = 0;
    
    for (const user of users.users) {
      try {
        console.log(`Processing user: ${user.email} (ID: ${user.id})`);
        
        // Prepare user data for MongoDB
        const mongoUser = {
          email: user.email,
          name: user.user_metadata?.name || '',
          role: user.user_metadata?.role || 'user',
          created_at: new Date(user.created_at),
          updated_at: new Date(user.updated_at || user.created_at),
          last_sign_in_at: user.last_sign_in_at ? new Date(user.last_sign_in_at) : null,
          supabase_id: user.id // Keep reference to Supabase ID
        };
        
        // Insert into MongoDB
        const result = await usersCollection.insertOne(mongoUser);
        console.log(`User inserted into MongoDB with ID: ${result.insertedId}`);
        
        successCount++;
      } catch (userError) {
        console.error(`Error migrating user ${user.id}:`, userError);
        failCount++;
      }
    }
    
    console.log('\nUser Migration Summary:');
    console.log(`Total users: ${users.users.length}`);
    console.log(`Successfully migrated: ${successCount}`);
    console.log(`Failed to migrate: ${failCount}`);
    
    return { success: true, migrated: successCount, failed: failCount };
  } catch (error) {
    console.error('Error during user migration:', error);
    return { success: false, error: error.message };
  } finally {
    // Close MongoDB connection
    await closeConnection();
  }
}

// Run the migration
async function runMigration() {
  console.log('=== SUPABASE TO MONGODB MIGRATION ===\n');
  
  // Migrate products
  const productResult = await migrateProducts();
  
  // Migrate users
  const userResult = await migrateUsers();
  
  console.log('\n=== MIGRATION COMPLETE ===');
  console.log('Products Migration:', productResult.success ? '✅ SUCCESS' : '❌ FAILED');
  console.log('Users Migration:', userResult.success ? '✅ SUCCESS' : '❌ FAILED');
  
  return productResult.success && userResult.success;
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