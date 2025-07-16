// API handler for Netlify Functions
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Product = require('../models/Product');
const { generateToken, verifyToken } = require('../utils/jwt');
const { getAuthParams } = require('../utils/imagekit');

// Set up CORS headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Content-Type': 'application/json'
};

// Connect to MongoDB
let cachedDb = null;

const connectToDatabase = async () => {
  if (cachedDb) {
    return cachedDb;
  }
  
  cachedDb = await connectDB();
  return cachedDb;
};

exports.handler = async function(event, context) {
  // Make the database connection available for reuse
  context.callbackWaitsForEmptyEventLoop = false;
  
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
    // Connect to the database
    await connectToDatabase();
    
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
        const products = await Product.find().select('-__v').sort({ createdAt: -1 });
        
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
        const product = await Product.findById(segments[1]).select('-__v');
        
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
        const { email, password } = JSON.parse(event.body);
        
        // Simple validation
        if (!email || !password) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ success: false, message: 'Email and password are required' })
          };
        }
        
        // Find user by email
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ success: false, message: 'Invalid credentials' })
          };
        }
        
        // Check if password matches
        const isMatch = await user.matchPassword(password);
        
        if (!isMatch) {
          return {
            statusCode: 401,
            headers,
            body: JSON.stringify({ success: false, message: 'Invalid credentials' })
          };
        }
        
        // Generate token
        const token = generateToken(user._id);
        
        // Remove password from response
        user.password = undefined;
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            success: true,
            token,
            user
          })
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
        
        // Check if user already exists
        const userExists = await User.findOne({ email });
        
        if (userExists) {
          return {
            statusCode: 400,
            headers,
            body: JSON.stringify({ success: false, message: 'User already exists' })
          };
        }
        
        // Create user
        const user = await User.create({
          name,
          email,
          password
        });
        
        // Generate token
        const token = generateToken(user._id);
        
        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({
            success: true,
            token,
            user: {
              _id: user._id,
              name: user.name,
              email: user.email,
              role: user.role
            }
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
      const authParams = getAuthParams();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          authParams
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