// Simple API proxy for Netlify Functions
const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const axios = require('axios');

const app = express();
const router = express.Router();

// Enable CORS
app.use(cors());
app.use(express.json());

// Health check endpoint
router.get('/', (req, res) => {
  res.json({
    message: 'API is working',
    status: 'ok'
  });
});

// Products endpoint
router.get('/products/list', async (req, res) => {
  try {
    // Return some sample products
    res.json({
      success: true,
      products: [
        { id: 1, name: 'Laptop', price: 999, category: 'Electronics' },
        { id: 2, name: 'Smartphone', price: 699, category: 'Electronics' },
        { id: 3, name: 'Headphones', price: 199, category: 'Audio' }
      ]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Use the router
app.use('/.netlify/functions/api', router);
app.use('/api', router);

// Export the serverless function
module.exports.handler = serverless(app);