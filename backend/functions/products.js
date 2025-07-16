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
    // Generate dynamic products
    const products = [];
    
    // Product templates with different images
    const templates = [
      { name: 'Laptop', price: 999, category: 'Electronics', image: ['https://ik.imagekit.io/q5jukn457/laptop.jpg'] },
      { name: 'Smartphone', price: 699, category: 'Electronics', image: ['https://ik.imagekit.io/q5jukn457/smartphone.jpg'] },
      { name: 'Headphones', price: 199, category: 'Audio', image: ['https://ik.imagekit.io/q5jukn457/headphones.jpg'] },
      { name: 'Monitor', price: 349, category: 'Electronics', image: ['https://ik.imagekit.io/q5jukn457/monitor.jpg'] },
      { name: 'Keyboard', price: 89, category: 'Accessories', image: ['https://ik.imagekit.io/q5jukn457/keyboard.jpg'] }
    ];
    
    // Generate 15 products
    for (let i = 1; i <= 15; i++) {
      const template = templates[(i - 1) % templates.length];
      products.push({
        id: i,
        name: `${template.name} ${i}`,
        price: template.price,
        original_price: Math.round(template.price * 1.2),
        category: template.category,
        image: template.image,
        description: 'High-quality product with premium features',
        brand: 'Premium Brand',
        model: `Model-${i}`,
        warranty: '2 Years',
        stock_quantity: 10 + i,
        availability: 'in-stock',
        features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4']
      });
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        count: products.length,
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