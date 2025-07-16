import { apiClient } from '../utils/apiClient';

// Get or create session ID
const getSessionId = () => {
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
};

/**
 * Track user action
 * @param {string} action - Action type
 * @param {Object} data - Action data
 */
export const trackAction = async (action, data = {}) => {
  try {
    const sessionId = getSessionId();
    
    // Use a timeout to prevent blocking the UI
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), 3000);
    });
    
    // Race between the actual request and the timeout
    await Promise.race([
      apiClient.post('/tracking/track', {
        action,
        sessionId,
        ...data
      }),
      timeoutPromise
    ]);
    
    return true;
  } catch (error) {
    // Don't log timeout errors as they're expected in some cases
    if (error.message !== 'Request timeout') {
      console.error('Error tracking action:', error);
    }
    return false;
  }
};

/**
 * Track product view
 * @param {string} productId - Product ID
 */
export const trackProductView = async (productId) => {
  return trackAction('product_view', { productId });
};

/**
 * Track add to cart
 * @param {string} productId - Product ID
 * @param {number} quantity - Quantity
 * @param {number} price - Price
 */
export const trackAddToCart = async (productId, quantity, price) => {
  return trackAction('add_to_cart', { productId, quantity, price });
};

/**
 * Track remove from cart
 * @param {string} productId - Product ID
 */
export const trackRemoveFromCart = async (productId) => {
  return trackAction('remove_from_cart', { productId });
};

/**
 * Track checkout
 * @param {Object} orderData - Order data
 */
export const trackCheckout = async (orderData) => {
  return trackAction('checkout', { metadata: orderData });
};

/**
 * Get recently viewed products
 * @returns {Promise<Array>} - Array of product IDs
 */
export const getRecentlyViewed = async () => {
  try {
    const sessionId = getSessionId();
    const response = await apiClient.get(`/tracking/recently-viewed?sessionId=${sessionId}`);
    
    if (response.data && response.data.success) {
      return response.data.productIds || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error getting recently viewed products:', error);
    return [];
  }
};

/**
 * Get cart items from server
 * @returns {Promise<Array>} - Array of cart items
 */
export const getCartItems = async () => {
  try {
    const sessionId = getSessionId();
    const response = await apiClient.get(`/tracking/cart?sessionId=${sessionId}`);
    
    if (response.data && response.data.success) {
      return response.data.items || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error getting cart items:', error);
    return [];
  }
};

/**
 * Create order from cart
 * @param {Object} orderData - Order data
 * @returns {Promise<string|null>} - Order ID or null
 */
export const createOrder = async (orderData) => {
  try {
    const sessionId = getSessionId();
    const response = await apiClient.post('/tracking/order', {
      sessionId,
      ...orderData
    });
    
    if (response.data && response.data.success) {
      return response.data.orderId;
    }
    
    return null;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
};