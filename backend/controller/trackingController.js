import { getCollection } from '../config/mongodb.js';
import { ObjectId } from 'mongodb';

/**
 * Track user actions
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const trackAction = async (req, res) => {
  try {
    const { action, sessionId, productId, quantity, price, metadata } = req.body;
    
    // Get user ID if authenticated
    const userId = req.user ? req.user.id : null;
    
    // Get IP address
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // Track action in MongoDB
    const actionsCollection = await getCollection('user_actions');
    
    const actionData = {
      user_id: userId,
      session_id: sessionId,
      action_type: action,
      product_id: productId || null,
      category_id: null,
      quantity: quantity || null,
      metadata: metadata || null,
      ip_address: ip,
      created_at: new Date()
    };
    
    const result = await actionsCollection.insertOne(actionData);
    
    if (!result.acknowledged) {
      console.error('Error tracking action: Insert not acknowledged');
      return res.status(500).json({ success: false, message: 'Failed to track action' });
    }
    
    // Handle specific actions
    if (action === 'add_to_cart' && productId && price) {
      // Add to cart in MongoDB
      const cartsCollection = await getCollection('carts');
      const cartItemsCollection = await getCollection('cart_items');
      
      // Find or create cart
      let cart = await cartsCollection.findOne({
        $or: [
          { user_id: userId },
          { session_id: sessionId }
        ],
        status: 'active'
      });
      
      if (!cart) {
        const cartResult = await cartsCollection.insertOne({
          user_id: userId,
          session_id: sessionId,
          status: 'active',
          created_at: new Date(),
          updated_at: new Date()
        });
        
        if (!cartResult.acknowledged) {
          console.error('Error creating cart');
          return;
        }
        
        cart = { _id: cartResult.insertedId };
      }
      
      // Add item to cart
      const cartItemResult = await cartItemsCollection.updateOne(
        { 
          cart_id: cart._id.toString(),
          product_id: productId 
        },
        { 
          $set: {
            quantity: quantity || 1,
            price: price,
            updated_at: new Date()
          },
          $setOnInsert: {
            cart_id: cart._id.toString(),
            product_id: productId,
            created_at: new Date()
          }
        },
        { upsert: true }
      );
      
      if (!cartItemResult.acknowledged) {
        console.error('Error adding to cart');
      }
    }
    
    if (action === 'product_view' && productId) {
      // Track product view in MongoDB
      const viewsCollection = await getCollection('product_views');
      
      const viewResult = await viewsCollection.updateOne(
        {
          $or: [
            { user_id: userId },
            { session_id: sessionId }
          ],
          product_id: productId
        },
        {
          $set: {
            viewed_at: new Date()
          },
          $setOnInsert: {
            user_id: userId,
            session_id: sessionId,
            product_id: productId,
            created_at: new Date()
          }
        },
        { upsert: true }
      );
      
      if (!viewResult.acknowledged) {
        console.error('Error tracking product view');
      }
    }
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Tracking error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get recently viewed products
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const getRecentlyViewed = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { sessionId } = req.query;
    
    if (!userId && !sessionId) {
      return res.status(400).json({ success: false, message: 'User ID or session ID required' });
    }
    
    const viewsCollection = await getCollection('product_views');
    
    // Build query
    const query = {};
    if (userId) {
      query.user_id = userId;
    } else {
      query.session_id = sessionId;
    }
    
    const views = await viewsCollection
      .find(query)
      .sort({ viewed_at: -1 })
      .limit(10)
      .toArray();
    
    // Get product details
    const productIds = views.map(item => item.product_id);
    
    // Return product IDs (frontend will fetch details)
    return res.status(200).json({ success: true, productIds });
  } catch (error) {
    console.error('Error fetching recently viewed:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Get cart items
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const getCartItems = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { sessionId } = req.query;
    
    if (!userId && !sessionId) {
      return res.status(400).json({ success: false, message: 'User ID or session ID required' });
    }
    
    // Get cart from MongoDB
    const cartsCollection = await getCollection('carts');
    
    // Build query
    const query = { status: 'active' };
    if (userId) {
      query.user_id = userId;
    } else {
      query.session_id = sessionId;
    }
    
    const cart = await cartsCollection
      .findOne(query, { sort: { created_at: -1 } });
    
    if (!cart) {
      return res.status(200).json({ success: true, items: [] });
    }
    
    // Get cart items from MongoDB
    const cartItemsCollection = await getCollection('cart_items');
    const items = await cartItemsCollection
      .find({ cart_id: cart._id.toString() })
      .toArray();
    
    return res.status(200).json({ success: true, items });
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

/**
 * Create order from cart
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
export const createOrder = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { sessionId, paymentMethod, shippingAddress, contactInfo, shippingFee } = req.body;
    
    if (!sessionId) {
      return res.status(400).json({ success: false, message: 'Session ID required' });
    }
    
    // Get collections
    const cartsCollection = await getCollection('carts');
    const cartItemsCollection = await getCollection('cart_items');
    const ordersCollection = await getCollection('orders');
    const orderItemsCollection = await getCollection('order_items');
    
    // Find active cart
    const query = { status: 'active' };
    if (userId) {
      query.user_id = userId;
    } else {
      query.session_id = sessionId;
    }
    
    const cart = await cartsCollection.findOne(query);
    
    if (!cart) {
      return res.status(404).json({ success: false, message: 'No active cart found' });
    }
    
    // Get cart items
    const cartItems = await cartItemsCollection
      .find({ cart_id: cart._id.toString() })
      .toArray();
    
    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }
    
    // Calculate total
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + (shippingFee || 0);
    
    // Create order
    const orderResult = await ordersCollection.insertOne({
      user_id: userId,
      session_id: sessionId,
      payment_method: paymentMethod,
      shipping_address: shippingAddress,
      contact_info: contactInfo,
      subtotal: subtotal,
      shipping_fee: shippingFee || 0,
      total: total,
      status: 'pending',
      created_at: new Date(),
      updated_at: new Date()
    });
    
    if (!orderResult.acknowledged) {
      return res.status(500).json({ success: false, message: 'Failed to create order' });
    }
    
    // Create order items
    const orderItems = cartItems.map(item => ({
      order_id: orderResult.insertedId.toString(),
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      created_at: new Date()
    }));
    
    await orderItemsCollection.insertMany(orderItems);
    
    // Update cart status to completed
    await cartsCollection.updateOne(
      { _id: cart._id },
      { $set: { status: 'completed', updated_at: new Date() } }
    );
    
    return res.status(200).json({ success: true, orderId: orderResult.insertedId.toString() });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};