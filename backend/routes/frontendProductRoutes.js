import express from 'express';
import { getCollection } from '../config/mongodb.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Get all products for frontend
router.get('/', async (req, res) => {
  try {
    console.log('Fetching products from MongoDB...');
    
    const productsCollection = await getCollection('products');
    const products = await productsCollection
      .find({})
      .sort({ created_at: -1 })
      .toArray();
    
    console.log(`Found ${products?.length || 0} products`);
    
    res.json({
      success: true,
      products: products || []
    });
  } catch (error) {
    console.error('Error fetching products for frontend:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// Get product by ID for frontend
router.get('/:id', async (req, res) => {
  try {
    const productsCollection = await getCollection('products');
    
    let productId;
    try {
      productId = new ObjectId(req.params.id);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }
    
    const product = await productsCollection.findOne({ _id: productId });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error fetching product for frontend:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

export default router;