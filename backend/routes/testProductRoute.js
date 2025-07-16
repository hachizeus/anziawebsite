import express from 'express';
import { getCollection } from '../config/mongodb.js';

const router = express.Router();

// Test endpoint to add a product directly
router.post('/add-test-product', async (req, res) => {
  try {
    // Test product data
    const testProduct = {
      name: "API Test Product",
      brand: "TestAPI",
      model: "API-1000",
      category: "Power Tools & Workshop Gear",
      subcategory: "Drills & Drivers",
      price: 9999,
      description: "A test product added via API",
      specifications: "Test specs",
      availability: "in-stock",
      condition: "new",
      warranty: "1 year",
      features: ["API Test", "Direct Insert"],
      stock_quantity: 5,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const productsCollection = await getCollection('products');
    const result = await productsCollection.insertOne(testProduct);
    
    if (!result.acknowledged) {
      throw new Error('Failed to insert product');
    }
    
    // Get the inserted product
    const product = await productsCollection.findOne({ _id: result.insertedId });
    
    res.json({
      success: true,
      message: 'Test product added successfully',
      product
    });
  } catch (error) {
    console.error('Error in test endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding test product',
      error: error.message
    });
  }
});

// Test endpoint to get all products
router.get('/products', async (req, res) => {
  try {
    const productsCollection = await getCollection('products');
    const products = await productsCollection.find({}).toArray();
    
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

export default router;