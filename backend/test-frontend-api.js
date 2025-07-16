import fetch from 'node-fetch';

// Test the frontend products API
async function testFrontendProductsAPI() {
  try {
    console.log('Testing frontend products API...');
    const response = await fetch('http://localhost:4000/api/frontend/products');
    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Response data:', data);
    
    if (data.success) {
      console.log(`Found ${data.products.length} products`);
      if (data.products.length > 0) {
        console.log('First product:', data.products[0]);
      }
    } else {
      console.error('API returned success: false');
    }
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

// Run the test
testFrontendProductsAPI();