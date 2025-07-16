import { supabaseAdmin } from './config/supabase.js';

async function checkTables() {
  try {
    console.log('Checking Supabase tables...');
    
    // List all tables
    const { data, error } = await supabaseAdmin.rpc('list_tables');
    
    if (error) {
      console.error('Error listing tables:', error);
      return;
    }
    
    console.log('Tables in database:');
    console.log(data);
    
    // Check products table specifically
    const { data: productsData, error: productsError } = await supabaseAdmin
      .from('products')
      .select('count')
      .limit(1);
    
    if (productsError) {
      console.error('Error checking products table:', productsError);
    } else {
      console.log('Products table exists with data:', productsData);
    }
    
    // Try to get all products
    const { data: allProducts, error: allProductsError } = await supabaseAdmin
      .from('products')
      .select('*');
    
    if (allProductsError) {
      console.error('Error fetching all products:', allProductsError);
    } else {
      console.log(`Found ${allProducts.length} products:`);
      console.log(allProducts);
    }
  } catch (error) {
    console.error('Error checking tables:', error);
  }
}

checkTables();