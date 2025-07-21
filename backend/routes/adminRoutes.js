import express from 'express';
import { getCollection } from '../config/mongodb.js';

const router = express.Router();

// Admin stats endpoint
router.get('/stats', async (req, res) => {
  try {
    // Get product count
    const productsCollection = await getCollection('products');
    const productCount = await productsCollection.countDocuments();
    
    // Get user count
    const usersCollection = await getCollection('users');
    const userCount = await usersCollection.countDocuments();
    
    res.json({
      success: true,
      stats: {
        totalProducts: productCount || 0,
        inStockProducts: productCount || 0,
        totalCustomers: userCount || 0,
        totalViews: 0,
        pendingOrders: 0
      }
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stats'
    });
  }
});

// Get all users endpoint
router.get('/users', async (req, res) => {
  try {
    const usersCollection = await getCollection('users');
    const users = await usersCollection.find({}).toArray();
    
    res.json({
      success: true,
      users: users || []
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

export default router;
