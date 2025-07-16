// Product Management API for Netlify Functions
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const { verifyToken } = require('../utils/jwt');
const { uploadImage, deleteImage } = require('../utils/imagekit');

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

// Middleware to protect routes
const protect = async (event) => {
  try {
    // Get token from header
    const authHeader = event.headers.authorization || event.headers.Authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        isAuthenticated: false,
        error: {
          statusCode: 401,
          message: 'Not authorized, no token'
        }
      };
    }
    
    // Verify token
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return {
        isAuthenticated: false,
        error: {
          statusCode: 401,
          message: 'Not authorized, token failed'
        }
      };
    }
    
    // Get user from token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return {
        isAuthenticated: false,
        error: {
          statusCode: 401,
          message: 'User not found'
        }
      };
    }
    
    return {
      isAuthenticated: true,
      user
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      error: {
        statusCode: 401,
        message: 'Not authorized, token failed'
      }
    };
  }
};

// Check if user is admin
const isAdmin = (user) => {
  return user.role === 'admin';
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

  try {
    // Connect to the database
    await connectToDatabase();
    
    // Get the path from the event
    const path = event.path.replace('/.netlify/functions/product-management', '');
    const segments = path.split('/').filter(Boolean);
    const method = event.httpMethod;
    
    // Protect routes
    const auth = await protect(event);
    
    if (!auth.isAuthenticated) {
      return {
        statusCode: auth.error.statusCode,
        headers,
        body: JSON.stringify({ success: false, message: auth.error.message })
      };
    }
    
    // Check if user is admin
    if (!isAdmin(auth.user)) {
      return {
        statusCode: 403,
        headers,
        body: JSON.stringify({ success: false, message: 'Not authorized as an admin' })
      };
    }
    
    // Create a new product
    if (path === '' && method === 'POST') {
      const productData = JSON.parse(event.body);
      
      // Validate required fields
      if (!productData.name || !productData.price || !productData.category) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, message: 'Please provide name, price, and category' })
        };
      }
      
      // Create product
      const product = await Product.create(productData);
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          success: true,
          product
        })
      };
    }
    
    // Update a product
    if (segments.length === 1 && method === 'PUT') {
      const productId = segments[0];
      const productData = JSON.parse(event.body);
      
      // Find product
      let product = await Product.findById(productId);
      
      if (!product) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ success: false, message: 'Product not found' })
        };
      }
      
      // Update product
      product = await Product.findByIdAndUpdate(productId, productData, {
        new: true,
        runValidators: true
      });
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          product
        })
      };
    }
    
    // Delete a product
    if (segments.length === 1 && method === 'DELETE') {
      const productId = segments[0];
      
      // Find product
      const product = await Product.findById(productId);
      
      if (!product) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ success: false, message: 'Product not found' })
        };
      }
      
      // Delete images from ImageKit
      if (product.images && product.images.length > 0) {
        for (const image of product.images) {
          if (image.fileId) {
            try {
              await deleteImage(image.fileId);
            } catch (error) {
              console.error('Error deleting image:', error);
            }
          }
        }
      }
      
      // Delete product
      await product.remove();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Product deleted'
        })
      };
    }
    
    // Upload product image
    if (segments.length === 2 && segments[0] === 'upload' && method === 'POST') {
      const productId = segments[1];
      const { image, fileName } = JSON.parse(event.body);
      
      // Find product
      const product = await Product.findById(productId);
      
      if (!product) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ success: false, message: 'Product not found' })
        };
      }
      
      // Upload image to ImageKit
      const uploadResult = await uploadImage(image, fileName);
      
      // Add image to product
      product.images.push({
        url: uploadResult.url,
        fileId: uploadResult.fileId,
        alt: product.name
      });
      
      await product.save();
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          image: {
            url: uploadResult.url,
            fileId: uploadResult.fileId,
            alt: product.name
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
    console.error('Product management API error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: error.message })
    };
  }
};