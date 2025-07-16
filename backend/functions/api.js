// Simple API handler for Netlify Functions
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

  // Get the path from the event
  const path = event.path.replace('/.netlify/functions/api', '');
  const segments = path.split('/').filter(Boolean);
  const method = event.httpMethod;

  try {
    // Root endpoint
    if (path === '' || path === '/') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: 'API is working',
          status: 'ok'
        })
      };
    }

    // Products endpoints
    if (segments[0] === 'products') {
      // List all products
      if (segments.length === 1 && method === 'GET') {
        const products = [
          { id: 1, name: 'Laptop', price: 999, category: 'Electronics', image: ['https://ik.imagekit.io/q5jukn457/laptop.jpg'], description: 'Powerful laptop with high performance', brand: 'Dell', model: 'XPS 15', warranty: '1 Year', stock_quantity: 10, availability: 'in-stock', features: ['Intel Core i7', '16GB RAM', '512GB SSD', 'NVIDIA GeForce RTX'] },
          { id: 2, name: 'Smartphone', price: 699, category: 'Electronics', image: ['https://ik.imagekit.io/q5jukn457/smartphone.jpg'], description: 'Latest smartphone with advanced features', brand: 'Samsung', model: 'Galaxy S21', warranty: '2 Years', stock_quantity: 15, availability: 'in-stock', features: ['6.2-inch AMOLED', '128GB Storage', '8GB RAM', '5G Capable'] },
          { id: 3, name: 'Headphones', price: 199, category: 'Audio', image: ['https://ik.imagekit.io/q5jukn457/headphones.jpg'], description: 'Noise cancelling headphones for immersive audio', brand: 'Sony', model: 'WH-1000XM4', warranty: '1 Year', stock_quantity: 8, availability: 'in-stock', features: ['Noise Cancellation', 'Bluetooth 5.0', '30 Hour Battery', 'Touch Controls'] },
          { id: 4, name: 'Monitor', price: 349, category: 'Electronics', image: ['https://ik.imagekit.io/q5jukn457/monitor.jpg'], description: '4K monitor for crystal clear display', brand: 'LG', model: '27UK850', warranty: '3 Years', stock_quantity: 5, availability: 'in-stock', features: ['27-inch 4K UHD', 'IPS Panel', 'USB-C', 'HDR 10'] },
          { id: 5, name: 'Keyboard', price: 89, category: 'Accessories', image: ['https://ik.imagekit.io/q5jukn457/keyboard.jpg'], description: 'Mechanical keyboard for better typing experience', brand: 'Logitech', model: 'G Pro X', warranty: '2 Years', stock_quantity: 20, availability: 'in-stock', features: ['Mechanical Switches', 'RGB Lighting', 'Programmable Keys', 'Detachable Cable'] }
        ];
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            count: products.length,
            products
          })
        };
      }

      // Get product by ID
      if (segments.length === 2 && method === 'GET') {
        const productId = segments[1];
        // Convert to number if it's numeric
        const numericId = !isNaN(parseInt(productId)) ? parseInt(productId) : null;
        
        // Create a dynamic product based on the ID
        const product = {
          id: numericId || productId,
          name: `Product ${productId}`,
          price: 999,
          original_price: 1299,
          category: 'Electronics',
          image: ['https://ik.imagekit.io/q5jukn457/laptop.jpg'],
          description: 'This high-quality product features the latest technology and premium materials. Perfect for both home and professional use, it offers exceptional performance and reliability.',
          brand: 'Premium Brand',
          model: `Model-${productId}`,
          warranty: '2 Years',
          stock_quantity: 15,
          availability: 'in-stock',
          features: [
            'High-quality construction',
            'Energy efficient design',
            'Smart connectivity features',
            'Premium materials'
          ],
          specifications: [
            { label: 'Brand', value: 'Premium Brand' },
            { label: 'Model', value: `Model-${productId}` },
            { label: 'Condition', value: 'New' },
            { label: 'Warranty', value: '2 Years' }
          ]
        };
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, product })
        };
      }
    }

    // User login endpoint
    if (segments[0] === 'users' && segments[1] === 'login' && method === 'POST') {
      try {
        const { email, password } = JSON.parse(event.body);
        
        // Simple validation
        if (!email || !password) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ success: false, message: 'Email and password are required' })
          };
        }
        
        // Mock authentication - in a real app, you would validate against a database
        if (email === 'user@example.com' && password === 'password') {
          return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
              success: true,
              user: {
                id: 1,
                name: 'Test User',
                email: 'user@example.com',
                role: 'user'
              },
              token: 'mock-jwt-token-for-testing'
            })
          };
        }
        
        // If credentials don't match
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ success: false, message: 'Invalid credentials' })
        };
      } catch (error) {
        console.error('Login error:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ success: false, message: error.message })
        };
      }
    }

    // User registration endpoint
    if (segments[0] === 'users' && segments[1] === 'register' && method === 'POST') {
      try {
        const { name, email, password } = JSON.parse(event.body);
        
        // Simple validation
        if (!name || !email || !password) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ success: false, message: 'Name, email and password are required' })
          };
        }
        
        // In a real app, you would save to a database
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            user: {
              id: Math.floor(Math.random() * 1000),
              name,
              email,
              role: 'user'
            },
            token: 'mock-jwt-token-for-testing'
          })
        };
      } catch (error) {
        console.error('Registration error:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ success: false, message: error.message })
        };
      }
    }

    // Logout endpoint
    if (segments[0] === 'auth' && segments[1] === 'logout' && method === 'POST') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Logged out successfully' })
      };
    }

    // ImageKit auth endpoint
    if (segments[0] === 'imagekit' && segments[1] === 'auth' && method === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          authParams: {
            token: 'sample-token',
            expire: Math.floor(Date.now() / 1000) + 3600,
            signature: 'sample-signature',
            publicKey: 'public_ahoxvdF2fShMnKvheyP8TQrAKhE='
          }
        })
      };
    }

    // Frontend products endpoint
    if (segments[0] === 'frontend' && segments[1] === 'products' && method === 'GET') {
      const products = [
        { id: 1, name: 'Laptop', price: 999, category: 'Electronics', image: ['https://ik.imagekit.io/q5jukn457/laptop.jpg'], description: 'Powerful laptop with high performance', brand: 'Dell', model: 'XPS 15', warranty: '1 Year', stock_quantity: 10, availability: 'in-stock', features: ['Intel Core i7', '16GB RAM', '512GB SSD', 'NVIDIA GeForce RTX'] },
        { id: 2, name: 'Smartphone', price: 699, category: 'Electronics', image: ['https://ik.imagekit.io/q5jukn457/smartphone.jpg'], description: 'Latest smartphone with advanced features', brand: 'Samsung', model: 'Galaxy S21', warranty: '2 Years', stock_quantity: 15, availability: 'in-stock', features: ['6.2-inch AMOLED', '128GB Storage', '8GB RAM', '5G Capable'] },
        { id: 3, name: 'Headphones', price: 199, category: 'Audio', image: ['https://ik.imagekit.io/q5jukn457/headphones.jpg'], description: 'Noise cancelling headphones for immersive audio', brand: 'Sony', model: 'WH-1000XM4', warranty: '1 Year', stock_quantity: 8, availability: 'in-stock', features: ['Noise Cancellation', 'Bluetooth 5.0', '30 Hour Battery', 'Touch Controls'] },
        { id: 4, name: 'Monitor', price: 349, category: 'Electronics', image: ['https://ik.imagekit.io/q5jukn457/monitor.jpg'], description: '4K monitor for crystal clear display', brand: 'LG', model: '27UK850', warranty: '3 Years', stock_quantity: 5, availability: 'in-stock', features: ['27-inch 4K UHD', 'IPS Panel', 'USB-C', 'HDR 10'] },
        { id: 5, name: 'Keyboard', price: 89, category: 'Accessories', image: ['https://ik.imagekit.io/q5jukn457/keyboard.jpg'], description: 'Mechanical keyboard for better typing experience', brand: 'Logitech', model: 'G Pro X', warranty: '2 Years', stock_quantity: 20, availability: 'in-stock', features: ['Mechanical Switches', 'RGB Lighting', 'Programmable Keys', 'Detachable Cable'] }
      ];
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: "Products retrieved successfully",
          products
        })
      };
    }

    // If no route matches
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ success: false, message: 'Route not found' })
    };
  } catch (error) {
    console.error('API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: error.message })
    };
  }
};