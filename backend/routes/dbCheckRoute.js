import express from 'express';
import { getCollection } from '../config/mongodb.js';
import * as inMemoryStore from '../utils/inMemoryStore.js';

const router = express.Router();

// Check database connection and users
router.get('/check', async (req, res) => {
  try {
    let dbUsers = [];
    let dbConnected = false;
    
    // Try MongoDB first
    try {
      const usersCollection = await getCollection('users');
      dbUsers = await usersCollection.find({}, { projection: { password: 0 } }).toArray();
      dbConnected = true;
      console.log('MongoDB connected, found', dbUsers.length, 'users');
    } catch (error) {
      console.error('MongoDB error:', error.message);
      dbConnected = false;
    }
    
    // Try in-memory store as fallback
    let memoryUsers = [];
    try {
      memoryUsers = await inMemoryStore.getAllUsers();
      console.log('In-memory store has', memoryUsers.length, 'users');
    } catch (error) {
      console.error('In-memory store error:', error.message);
    }
    
    res.json({
      success: true,
      dbConnected,
      dbUsers: dbUsers.map(u => ({ id: u._id, email: u.email, name: u.name, role: u.role })),
      memoryUsers: memoryUsers.map(u => ({ id: u._id, email: u.email, name: u.name, role: u.role }))
    });
  } catch (error) {
    console.error('DB check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking database',
      error: error.message
    });
  }
});

export default router;