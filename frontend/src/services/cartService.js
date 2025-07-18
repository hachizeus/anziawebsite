const API_URL = 'https://anzia-electronics-api.onrender.com/api';

export const cartService = {
  // Get cart for user
  getCart: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/cart/${userId}`);
      const data = await response.json();
      return data.success ? data.cart.items || [] : [];
    } catch (error) {
      console.error('Error getting cart:', error);
      return [];
    }
  },

  // Add item to cart
  addToCart: async (userId, item) => {
    try {
      const response = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          productId: item.id,
          quantity: item.quantity || 1,
          price: item.price,
          name: item.name,
          image: item.image
        })
      });
      const data = await response.json();
      if (data.success) {
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      }
      return data.success;
    } catch (error) {
      console.error('Error adding to cart:', error);
      return false;
    }
  },

  // Remove item from cart
  removeFromCart: async (userId, productId) => {
    try {
      const response = await fetch(`${API_URL}/cart/remove/${userId}/${productId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      }
      return data.success;
    } catch (error) {
      console.error('Error removing from cart:', error);
      return false;
    }
  },

  // Clear cart
  clearCart: async (userId) => {
    try {
      const response = await fetch(`${API_URL}/cart/clear/${userId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      }
      return data.success;
    } catch (error) {
      console.error('Error clearing cart:', error);
      return false;
    }
  },


};