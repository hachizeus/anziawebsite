// Products API for Netlify Functions
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');

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

  try {
    // Connect to the database
    await connectToDatabase();
    
    // Parse query parameters
    const queryParams = event.queryStringParameters || {};
    
    // Build filter object
    const filter = {};
    
    // Category filter
    if (queryParams.category && queryParams.category !== 'all') {
      filter.category = queryParams.category;
    }
    
    // Search filter
    if (queryParams.search) {
      filter.$or = [
        { name: { $regex: queryParams.search, $options: 'i' } },
        { brand: { $regex: queryParams.search, $options: 'i' } },
        { description: { $regex: queryParams.search, $options: 'i' } }
      ];
    }
    
    // Price range filter
    if (queryParams.minPrice || queryParams.maxPrice) {
      filter.price = {};
      if (queryParams.minPrice) {
        filter.price.$gte = Number(queryParams.minPrice);
      }
      if (queryParams.maxPrice) {
        filter.price.$lte = Number(queryParams.maxPrice);
      }
    }
    
    // Build sort object
    let sort = { createdAt: -1 }; // Default sort by newest
    
    if (queryParams.sortBy) {
      switch (queryParams.sortBy) {
        case 'price-low':
          sort = { price: 1 };
          break;
        case 'price-high':
          sort = { price: -1 };
          break;
        case 'name':
          sort = { name: 1 };
          break;
        case 'rating':
          sort = { rating: -1 };
          break;
      }
    }
    
    // Pagination
    const page = parseInt(queryParams.page) || 1;
    const limit = parseInt(queryParams.limit) || 12;
    const skip = (page - 1) * limit;
    
    // Execute query
    const products = await Product.find(filter)
      .select('-__v')
      .sort(sort)
      .skip(skip)
      .limit(limit);
    
    // Get total count for pagination
    const total = await Product.countDocuments(filter);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        count: products.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        products
      })
    };
  } catch (error) {
    console.error('Products API error:', error);
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