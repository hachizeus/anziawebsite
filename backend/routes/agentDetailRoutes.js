import express from 'express';
import mongoose from 'mongoose';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get agent details by ID
router.get('/agents/:id', protect, admin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const Agent = mongoose.model('Agent');
    const agent = await Agent.findById(id)
      .populate('userId', 'name email')
      .populate('properties');
    
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }
    
    res.json({
      success: true,
      agent
    });
  } catch (error) {
    console.error('Error fetching agent details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching agent details',
      error: error.message
    });
  }
});

// Get agent properties
router.get('/agents/:id/properties', protect, admin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const Agent = mongoose.model('Agent');
    const product = mongoose.model('product');
    
    const agent = await Agent.findById(id);
    
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }
    
    const properties = await product.find({ agentId: id });
    
    res.json({
      success: true,
      properties
    });
  } catch (error) {
    console.error('Error fetching agent properties:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching agent properties',
      error: error.message
    });
  }
});

// Update agent details
router.put('/agents/:id/update', protect, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const { subscription, currency, subscriptionExpiry } = req.body;
    
    const Agent = mongoose.model('Agent');
    const agent = await Agent.findById(id);
    
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }
    
    // Update fields
    if (subscription) agent.subscription = subscription;
    if (currency) agent.currency = currency;
    
    // Update expiry date if provided
    if (subscriptionExpiry) {
      agent.subscriptionExpiry = new Date(subscriptionExpiry);
    }
    // If subscription changed but no expiry date provided, update expiry date
    else if (subscription && subscription !== agent.subscription) {
      agent.subscriptionExpiry = new Date(new Date().setMonth(new Date().getMonth() + 1));
    }
    
    await agent.save();
    
    res.json({
      success: true,
      message: 'Agent updated successfully',
      agent
    });
  } catch (error) {
    console.error('Error updating agent:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating agent',
      error: error.message
    });
  }
});

// Record payment for agent
router.post('/agents/:id/payment', protect, admin, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, method, notes } = req.body;
    
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid payment amount is required'
      });
    }
    
    const Agent = mongoose.model('Agent');
    const agent = await Agent.findById(id);
    
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }
    
    // Create payment record
    const payment = {
      amount,
      method: method || 'bank transfer',
      notes,
      date: new Date(),
      status: 'completed'
    };
    
    // Add payment to history
    agent.paymentHistory = agent.paymentHistory || [];
    agent.paymentHistory.push(payment);
    
    // Extend subscription based on payment
    // Logic can be customized based on your business rules
    const monthsToAdd = 1; // Default 1 month per payment
    
    if (!agent.subscriptionExpiry || agent.subscriptionExpiry < new Date()) {
      // If expired, start from today
      agent.subscriptionExpiry = new Date(new Date().setMonth(new Date().getMonth() + monthsToAdd));
    } else {
      // If not expired, add to current expiry date
      agent.subscriptionExpiry = new Date(new Date(agent.subscriptionExpiry).setMonth(
        new Date(agent.subscriptionExpiry).getMonth() + monthsToAdd
      ));
    }
    
    // Ensure agent is active
    agent.active = true;
    
    await agent.save();
    
    res.json({
      success: true,
      message: 'Payment recorded successfully',
      payment,
      subscriptionExpiry: agent.subscriptionExpiry
    });
  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording payment',
      error: error.message
    });
  }
});

export default router;
