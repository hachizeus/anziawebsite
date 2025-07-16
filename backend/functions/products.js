// Products API for Netlify Functions
exports.handler = async function(event, context) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'Preflight call successful' })
    };
  }

  try {
    // Sample products data
    const products = [
      { id: 1, name: 'Laptop', price: 999, category: 'Electronics' },
      { id: 2, name: 'Smartphone', price: 699, category: 'Electronics' },
      { id: 3, name: 'Headphones', price: 199, category: 'Audio' },
      { id: 4, name: 'Monitor', price: 349, category: 'Electronics' },
      { id: 5, name: 'Keyboard', price: 89, category: 'Accessories' }
    ];

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        products
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        message: error.message
      })
    };
  }
};