import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Font Awesome icons used directly in JSX
import { toast, Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { cartService } from '../services/cartService';
import { showNotification } from '../utils/notifications';
import YouMightAlsoLike from '../components/common/YouMightAlsoLike';
import axios from 'axios';

const API_URL = 'https://anzia-electronics-api.onrender.com/api';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [activeTab, setActiveTab] = useState('cart');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) {
      navigate('/login');
      return;
    }
    loadCart();
    loadWishlist();
  }, [user, navigate]);

  const loadCart = async () => {
    // Use same user ID resolution as other components
    const storageUser = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = user?._id || storageUser._id;
    
    if (userId) {
      const items = await cartService.getCart(userId);
      
      // Fetch full product details for each cart item
      const itemsWithImages = await Promise.all(
        items.map(async (item) => {
          try {
            if (!item.productId) return item;
            const productId = item.productId._id || item.productId;
            const response = await axios.get(`${API_URL}/products/${productId}`);
            if (response.data.success) {
              return {
                ...item,
                productId: response.data.product
              };
            }
          } catch (error) {
            console.error('Error fetching product details:', error);
          }
          return item;
        })
      );
      
      setCartItems(itemsWithImages);
    }
  };

  const loadWishlist = async () => {
    const storageUser = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = storageUser._id;
    
    if (userId) {
      try {
        const response = await axios.get(`${API_URL}/wishlist/${userId}`);
        if (response.data.success) {
          setWishlistItems(response.data.wishlist || []);
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
      }
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    const storageUser = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = user?._id || storageUser._id;
    
    if (newQuantity < 1 || !userId) return;
    
    try {
      // Remove and re-add with new quantity
      await cartService.removeFromCart(userId, productId);
      const item = cartItems.find(item => (item.productId._id || item.productId) === productId);
      if (item) {
        await cartService.addToCart(userId, {
          id: productId,
          quantity: newQuantity,
          price: item.price,
          name: item.name,
          image: item.image
        });
      }
      await loadCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
      showNotification('Failed to update quantity', 'error');
    }
  };

  const removeItem = async (productId) => {
    const storageUser = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = user?._id || storageUser._id;
    
    if (!userId) return;
    
    try {
      const success = await cartService.removeFromCart(userId, productId);
      if (success) {
        showNotification('Item removed from cart', 'success');
        await loadCart();
      } else {
        showNotification('Failed to remove item', 'error');
      }
    } catch (error) {
      console.error('Error removing item:', error);
      showNotification('Failed to remove item', 'error');
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = item.price || item.productId?.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const clearCart = async () => {
    const storageUser = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = user?._id || storageUser._id;
    
    if (!userId) return;
    
    try {
      const success = await cartService.clearCart(userId);
      if (success) {
        showNotification('Cart cleared successfully', 'success');
        setCartItems([]);
      } else {
        showNotification('Failed to clear cart', 'error');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      showNotification('Failed to clear cart', 'error');
    }
  };

  const removeFromWishlist = async (productId) => {
    const storageUser = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = storageUser._id;
    
    if (!userId) return;
    
    try {
      await axios.delete(`${API_URL}/wishlist/remove`, {
        data: { userId, productId }
      });
      showNotification('Removed from wishlist', 'success');
      loadWishlist();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      showNotification('Failed to remove from wishlist', 'error');
    }
  };

  const addWishlistToCart = async (item) => {
    const storageUser = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = storageUser._id;
    
    if (!userId) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_URL}/cart/add`, {
        userId,
        productId: item.productId._id,
        quantity: 1,
        price: item.productId.price,
        name: item.productId.name,
        image: item.productId.images?.[0]?.url || item.productId.images?.[0]
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.data.success) {
        window.dispatchEvent(new CustomEvent('cartUpdated'));
        showNotification('Added to cart!', 'success');
        loadCart();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification('Failed to add to cart', 'error');
    }
  };

  const orderViaWhatsApp = () => {
    if (cartItems.length === 0) {
      showNotification('Your cart is empty', 'warning');
      return;
    }
    
    // Create order message
    let message = "Hello! I would like to place an order:\n\n";
    
    cartItems.forEach((item, index) => {
      const itemName = item.name || item.productId?.name || 'Product';
      const itemPrice = item.price || item.productId?.price || 0;
      message += `${index + 1}. ${itemName}\n`;
      message += `   Quantity: ${item.quantity}\n`;
      message += `   Price: KSh ${itemPrice.toLocaleString()}\n`;
      message += `   Subtotal: KSh ${(itemPrice * item.quantity).toLocaleString()}\n\n`;
    });
    
    message += `Total Amount: KSh ${getTotalPrice().toLocaleString()}\n\n`;
    message += "Please confirm availability and delivery details. Thank you!";
    
    // WhatsApp phone number
    const phoneNumber = "+254769162665";
    
    // Open WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const renderEmptyState = (type) => (
    <div className="text-center py-12">
      <i className={`fas ${type === 'cart' ? 'fa-shopping-cart' : 'fa-heart'} text-6xl text-gray-400 mb-4`}></i>
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Your {type} is empty
      </h3>
      <Link to="/products" className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
        Continue Shopping
      </Link>
    </div>
  );

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Cart & Wishlist</h1>
          
          {/* Tabs */}
          <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('cart')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'cart'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="fas fa-shopping-cart mr-2"></i>
              Cart ({cartItems.length})
            </button>
            <button
              onClick={() => setActiveTab('wishlist')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'wishlist'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <i className="fas fa-heart mr-2"></i>
              Wishlist ({wishlistItems.length})
            </button>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            {activeTab === 'cart' && cartItems.length === 0 && renderEmptyState('cart')}
            {activeTab === 'wishlist' && wishlistItems.length === 0 && renderEmptyState('wishlist')}
            
            {/* Cart Content */}
            {activeTab === 'cart' && cartItems.length > 0 && (
            <>
            <div className="space-y-6">
              {cartItems.filter((item, index, self) => 
                item.productId && 
                self.findIndex(i => 
                  i.productId && 
                  (i.productId._id || i.productId) === (item.productId._id || item.productId)
                ) === index
              ).map((item, index) => (
                <div key={`${item.productId._id || item.productId}-${index}`} className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 border-b pb-6">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    {item.productId?.images?.[0]?.url || item.productId?.images?.[0] ? (
                      <img 
                        src={item.productId.images[0].url || item.productId.images[0]} 
                        alt={item.name || item.productId?.name} 
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center" style={{display: item.productId?.images?.[0] ? 'none' : 'flex'}}>
                      <i className="fas fa-shopping-cart text-2xl text-primary-400"></i>
                    </div>
                  </div>
                  
                  <div className="flex-1 sm:order-2">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">{item.name || item.productId?.name}</h3>
                    <p className="text-base sm:text-lg font-semibold text-primary-600">
                      KSh {(item.price || item.productId?.price || 0).toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between sm:justify-start sm:space-x-4 sm:order-3">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.productId._id || item.productId, item.quantity - 1)}
                        className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        <i className="fas fa-minus text-sm"></i>
                      </button>
                      <span className="px-3 py-1 border border-gray-300 rounded min-w-[3rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId._id || item.productId, item.quantity + 1)}
                        className="p-2 border border-gray-300 rounded hover:bg-gray-50"
                      >
                        <i className="fas fa-plus text-sm"></i>
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">
                        KSh {(item.price * item.quantity).toLocaleString()}
                      </p>
                      <button
                        onClick={() => removeItem(item.productId._id || item.productId)}
                        className="text-red-600 hover:text-red-700 mt-1"
                      >
                        <i className="fas fa-trash text-sm"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 border-t pt-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-xl font-semibold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-primary-600">
                  KSh {getTotalPrice().toLocaleString()}
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/products"
                  className="flex-1 border border-gray-300 text-gray-700 py-2 sm:py-3 px-4 sm:px-6 rounded-lg text-center hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Continue Shopping
                </Link>
                <button
                  onClick={clearCart}
                  className="border border-red-300 text-red-600 py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-red-50 transition-colors text-sm sm:text-base"
                >
                  Clear Cart
                </button>
                <button
                  onClick={orderViaWhatsApp}
                  className="flex-1 bg-green-600 text-white py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
                >
                  <i className="fab fa-whatsapp"></i>
                  <span>Order via WhatsApp</span>
                </button>
              </div>
            </div>
            </>
            )}
            
            {/* Wishlist Content */}
            {activeTab === 'wishlist' && wishlistItems.length > 0 && (
            <div className="space-y-6">
              {wishlistItems.map((item) => (
                <div key={item._id} className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 border-b pb-6">
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                    {item.productId?.images?.[0]?.url || item.productId?.images?.[0] ? (
                      <img 
                        src={item.productId.images[0].url || item.productId.images[0]} 
                        alt={item.productId?.name} 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <i className="fas fa-heart text-2xl text-primary-400"></i>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">{item.productId?.name}</h3>
                    <p className="text-base sm:text-lg font-semibold text-primary-600">
                      KSh {(item.productId?.price || 0).toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => addWishlistToCart(item)}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm"
                    >
                      <i className="fas fa-shopping-cart mr-1"></i>
                      Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.productId._id)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
          
          {/* You Might Also Like Section */}
          <YouMightAlsoLike 
            title="You Might Also Like"
            limit={4}
            className="mt-8"
          />
        </div>
      </div>
    </>
  );
};

export default Cart;
