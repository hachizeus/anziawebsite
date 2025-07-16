import { supabaseAdmin } from './config/supabase.js';

async function checkProductImages() {
  try {
    console.log('Checking product images in database...');
    
    // Get all products
    const { data: products, error } = await supabaseAdmin
      .from('products')
      .select('*');
    
    if (error) {
      console.error('Error fetching products:', error);
      return;
    }
    
    console.log(`Found ${products.length} products`);
    
    // Check each product's image fields
    products.forEach((product, index) => {
      console.log(`\nProduct ${index + 1}: ${product.name}`);
      console.log('- ID:', product.id);
      console.log('- images field type:', typeof product.images);
      
      if (product.images) {
        if (Array.isArray(product.images)) {
          console.log('- images is an array with', product.images.length, 'items');
          if (product.images.length > 0) {
            console.log('- First image URL:', product.images[0]);
          }
        } else if (typeof product.images === 'string') {
          console.log('- images is a string:', product.images.substring(0, 100) + '...');
          try {
            const parsed = JSON.parse(product.images);
            console.log('- Parsed JSON successfully, type:', typeof parsed);
            if (Array.isArray(parsed)) {
              console.log('- Parsed JSON is an array with', parsed.length, 'items');
            }
          } catch (e) {
            console.log('- Not valid JSON');
          }
        } else {
          console.log('- images is another type:', product.images);
        }
      } else {
        console.log('- No images field');
      }
      
      // Check individual image fields
      ['image1', 'image2', 'image3', 'image4'].forEach(field => {
        if (product[field]) {
          console.log(`- ${field}:`, product[field].substring(0, 100) + '...');
        }
      });
    });
    
  } catch (error) {
    console.error('Error checking product images:', error);
  }
}

checkProductImages();