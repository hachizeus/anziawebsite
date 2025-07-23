import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Font Awesome icons used directly in JSX
import { toast, Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { cartService } from '../services/cartService';
import { showNotification } from '../utils/notifications';
import axios from 'axios';

const API_URL = 'https://anzia-electronics-api.onrender.com/api';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) {
      navigate('/login');
      return;
    }
    loadCart();
  }, [user, navigate]);

  const loadCart = async () => {
    if (user?._id) {
      console.log('Loading cart for user:', user._id);
      const items = await cartService.getCart(user._id);
      console.log('Cart items loaded:', items);
      console.log('Cart items details:', JSON.stringify(items, null, 2));
      
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
      
      console.log('Items with images:', itemsWithImages);
      setCartItems(itemsWithImages);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1 || !user?._id) return;
    
    try {
      // Remove and re-add with new quantity
      await cartService.removeFromCart(user._id, productId);
      const item = cartItems.find(item => (item.productId._id || item.productId) === productId);
      if (item) {
        await cartService.addToCart(user._id, {
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
    if (!user?._id) return;
    
    try {
      const success = await cartService.removeFromCart(user._id, productId);
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

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-shopping-cart text-6xl text-gray-400 mb-4"></i>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <Link to="/products" className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
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
              
              <div className="flex space-x-4">
                <Link
                  to="/products"
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg text-center hover:bg-gray-50 transition-colors"
                >
                  Continue Shopping
                </Link>
                <button
                  onClick={orderViaWhatsApp}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <i className="fab fa-whatsapp"></i>
                  <span>Order via WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
