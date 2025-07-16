// Simple API handler for Netlify Functions without Express
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
      if (segments.length === 1 && segments[0] === 'products' && method === 'GET') {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            products: [
              { id: 1, name: 'Laptop', price: 999, category: 'Electronics', image: 'https://ik.imagekit.io/q5jukn457/laptop.jpg' },
              { id: 2, name: 'Smartphone', price: 699, category: 'Electronics', image: 'https://ik.imagekit.io/q5jukn457/smartphone.jpg' },
              { id: 3, name: 'Headphones', price: 199, category: 'Audio', image: 'https://ik.imagekit.io/q5jukn457/headphones.jpg' },
              { id: 4, name: 'Monitor', price: 349, category: 'Electronics', image: 'https://ik.imagekit.io/q5jukn457/monitor.jpg' },
              { id: 5, name: 'Keyboard', price: 89, category: 'Accessories', image: 'https://ik.imagekit.io/q5jukn457/keyboard.jpg' }
            ]
          })
        };
      }

      // Get product by ID
      if (segments.length === 2 && segments[0] === 'products' && method === 'GET') {
        const productId = parseInt(segments[1]);
        const products = [
          { id: 1, name: 'Laptop', price: 999, category: 'Electronics', image: 'https://ik.imagekit.io/q5jukn457/laptop.jpg', description: 'Powerful laptop with high performance' },
          { id: 2, name: 'Smartphone', price: 699, category: 'Electronics', image: 'https://ik.imagekit.io/q5jukn457/smartphone.jpg', description: 'Latest smartphone with advanced features' },
          { id: 3, name: 'Headphones', price: 199, category: 'Audio', image: 'https://ik.imagekit.io/q5jukn457/headphones.jpg', description: 'Noise cancelling headphones for immersive audio' },
          { id: 4, name: 'Monitor', price: 349, category: 'Electronics', image: 'https://ik.imagekit.io/q5jukn457/monitor.jpg', description: '4K monitor for crystal clear display' },
          { id: 5, name: 'Keyboard', price: 89, category: 'Accessories', image: 'https://ik.imagekit.io/q5jukn457/keyboard.jpg', description: 'Mechanical keyboard for better typing experience' }
        ];
        
        const product = products.find(p => p.id === productId);
        
        if (!product) {
          return {
            statusCode: 404,
            headers,
            body: JSON.stringify({ success: false, message: 'Product not found' })
          };
        }
        
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
        const body = JSON.parse(event.body);
        const { email, password } = body;
        
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
        const body = JSON.parse(event.body);
        const { name, email, password } = body;
        
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
            }
          })
        };
      } catch (error) {
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
            signature: 'sample-signature'
          }
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
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: error.message })
    };
  }
};