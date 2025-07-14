import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

// Admin stats endpoint
router.get('/stats', async (req, res) => {
  try {
    // Get product count
    const { count: productCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });
    
    // Get user count
    const { count: userCount } = await supabase
      .from('user_profiles')
      .select('*', { count: 'exact', head: true });
    
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

export default router;
