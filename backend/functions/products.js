// Netlify serverless function for products API
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

// MongoDB connection
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'anziaelectronics';
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  cachedDb = db;
  return db;
}

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
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
    const db = await connectToDatabase();
    const collection = db.collection('products');
    const path = event.path.split('/').filter(Boolean);
    
    // Get all products
    if (event.httpMethod === 'GET' && !path.includes('products')) {
      const products = await collection.find({}).toArray();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, products })
      };
    }
    
    // Get product by ID
    if (event.httpMethod === 'GET' && path.length > 0) {
      const id = path[path.length - 1];
      try {
        const product = await collection.findOne({ _id: new ObjectId(id) });
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
      } catch (error) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ success: false, message: 'Invalid product ID format' })
        };
      }
    }
    
    // Create product (POST)
    if (event.httpMethod === 'POST') {
      const productData = JSON.parse(event.body);
      const result = await collection.insertOne({
        ...productData,
        created_at: new Date()
      });
      
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ 
          success: true, 
          message: 'Product created successfully',
          productId: result.insertedId
        })
      };
    }

    // Default response for unsupported methods
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, message: 'Method not allowed' })
    };
    
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, message: 'Server error', error: error.message })
    };
  }
};