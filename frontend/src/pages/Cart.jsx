import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash, ArrowLeft, CreditCard, Truck, Shield, Check } from '../utils/icons.jsx';
import { motion } from 'framer-motion';
import { trackRemoveFromCart, trackAction, createOrder } from '../services/trackingService.js';

// Add CSS for notifications
const notificationStyles = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateX(20px); }
    10% { opacity: 1; transform: translateX(0); }
    90% { opacity: 1; transform: translateX(0); }
    100% { opacity: 0; transform: translateX(20px); }
  }
  
  .animate-fade-in-out {
    animation: fadeInOut 3s ease-in-out;
  }
  
  .fade-out {
    opacity: 0;
    transition: opacity 0.5s ease-out;
  }
`;

// Add styles to document head
if (!document.getElementById('notification-styles')) {
  const styleEl = document.createElement('style');
  styleEl.id = 'notification-styles';
  styleEl.textContent = notificationStyles;
  document.head.appendChild(styleEl);
}

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [checkoutStep, setCheckoutStep] = useState(0); // 0: cart, 1: delivery, 2: payment, 3: confirmation
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Nairobi',
    notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
        console.log('Loaded cart items:', parsedCart);
      } catch (e) {
        console.error('Error parsing cart:', e);
        setCartItems([]);
      }
    }
    
    // Load recently viewed from localStorage
    try {
      const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      setRecentlyViewed(viewed);
    } catch (e) {
      console.error('Error loading recently viewed:', e);
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      removeItem(id);
      return;
    }
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
    
    // Track action in analytics
    try {
      const sessionId = localStorage.getItem('sessionId') || Math.random().toString(36).substring(2, 15);
      localStorage.setItem('sessionId', sessionId);
      
      // Send to backend if available
      fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_cart_quantity',
          sessionId,
          productId: id,
          quantity: newQuantity
        })
      }).catch(err => console.log('Analytics tracking error:', err));
    } catch (e) {
      console.log('Analytics error:', e);
    }
    
    // Dispatch custom event to update cart count in navbar
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    // Show toast notification
    showNotification('Cart updated', 'Item quantity updated', 'info');
  };

  const removeItem = (id) => {
    // Find the item before removing it
    const itemToRemove = cartItems.find(item => item.id === id);
    
    // Remove the item
    setCartItems(cartItems.filter(item => item.id !== id));
    
    // Track action in analytics
    if (itemToRemove) {
      trackRemoveFromCart(id).catch(err => console.log('Analytics tracking error:', err));
    }
    
    // Dispatch custom event to update cart count in navbar
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    // Show toast notification
    showNotification('Item removed', 'Item removed from cart', 'warning');
  };
  
  // Toast notification function
  const showNotification = (title, message, type = 'success') => {
    // Create notification element
    const notification = document.createElement('div');
    
    // Set styles based on type
    let bgColor, borderColor, textColor, icon;
    switch (type) {
      case 'success':
        bgColor = 'bg-green-100';
        borderColor = 'border-green-500';
        textColor = 'text-green-700';
        icon = '<svg class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>';
        break;
      case 'warning':
        bgColor = 'bg-yellow-100';
        borderColor = 'border-yellow-500';
        textColor = 'text-yellow-700';
        icon = '<svg class="h-6 w-6 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>';
        break;
      case 'info':
        bgColor = 'bg-blue-100';
        borderColor = 'border-blue-500';
        textColor = 'text-blue-700';
        icon = '<svg class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
        break;
      default:
        bgColor = 'bg-gray-100';
        borderColor = 'border-gray-500';
        textColor = 'text-gray-700';
        icon = '<svg class="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>';
    }
    
    notification.className = `fixed top-20 right-4 ${bgColor} border-l-4 ${borderColor} ${textColor} p-4 rounded shadow-md z-50 animate-fade-in-out`;
    notification.innerHTML = `
      <div class="flex items-center">
        <div class="mr-3">
          ${icon}
        </div>
        <div>
          <p class="font-bold">${title}</p>
          <p class="text-sm">${message}</p>
        </div>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 500);
    }, 3000);
  };
  
  const handleDeliveryInfoChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckout = () => {
    setCheckoutStep(1); // Move to delivery step
  };
  
  const handleDeliverySubmit = (e) => {
    e.preventDefault();
    setCheckoutStep(2); // Move to payment step
  };
  
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Process payment and create order
    try {
      // Prepare order data
      const orderData = {
        paymentMethod,
        shippingAddress: {
          name: deliveryInfo.name,
          address: deliveryInfo.address,
          city: deliveryInfo.city
        },
        contactInfo: {
          name: deliveryInfo.name,
          phone: deliveryInfo.phone,
          email: deliveryInfo.email
        },
        shippingFee: shippingCost
      };
      
      // Create order in backend
      const orderId = await createOrder(orderData);
      
      if (orderId) {
        // Track checkout action
        await trackAction('checkout_complete', {
          orderId,
          total,
          items: cartItems.length
        });
        
        // Show success
        setCheckoutStep(3); // Move to confirmation step
        setOrderComplete(true);
        
        // Clear cart after successful order
        localStorage.removeItem('cart');
        setCartItems([]);
        
        // Dispatch event to update cart count
        window.dispatchEvent(new CustomEvent('cartUpdated'));
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      showNotification('Payment Failed', 'Payment processing failed. Please try again.', 'warning');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = subtotal > 5000 ? 0 : 400;
  const total = subtotal + shippingCost;

  // Check if cart is truly empty
  if ((cartItems === null || cartItems.length === 0) && !orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <ShoppingCart className="w-24 h-24 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started</p>
            <Link
              to="/products"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
          
          {/* Recently Viewed Products */}
          {recentlyViewed.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Viewed</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentlyViewed.map((item) => (
                  <Link to={`/products/${item.id}`} key={item.id}>
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-w-1 aspect-h-1 w-full">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-48 object-contain"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                            <ShoppingCart className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                        <p className="mt-1 text-lg font-bold text-primary-600">KSh {item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Order complete screen
  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-6">Thank you for your purchase. Your order has been received.</p>
            <p className="text-gray-600 mb-6">An M-Pesa payment request has been sent to your phone. Please complete the payment to confirm your order.</p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
              <Link
                to="/products"
                className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Continue Shopping
              </Link>
              <Link
                to="/dashboard"
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
              >
                View Orders
              </Link>
            </div>
          </div>
          
          {/* Recently Viewed Products */}
          {recentlyViewed.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Viewed</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recentlyViewed.map((item) => (
                  <Link to={`/products/${item.id}`} key={item.id}>
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                      <div className="aspect-w-1 aspect-h-1 w-full">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-48 object-contain"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                            <ShoppingCart className="w-12 h-12 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                        <p className="mt-1 text-lg font-bold text-primary-600">KSh {item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Checkout steps
  const renderCheckoutSteps = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        {['Cart', 'Delivery', 'Payment', 'Confirmation'].map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${checkoutStep >= index ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {index + 1}
            </div>
            <div className={`ml-2 ${checkoutStep >= index ? 'text-primary-600 font-medium' : 'text-gray-500'}`}>
              {step}
            </div>
            {index < 3 && (
              <div className={`w-12 h-1 mx-2 ${checkoutStep > index ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  // Delivery form
  const renderDeliveryForm = () => {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Delivery Information</h2>
        <form onSubmit={handleDeliverySubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                value={deliveryInfo.name}
                onChange={handleDeliveryInfoChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" 
                placeholder="Your full name"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone"
                value={deliveryInfo.phone}
                onChange={handleDeliveryInfoChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" 
                placeholder="e.g. 0712345678"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              value={deliveryInfo.email}
              onChange={handleDeliveryInfoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" 
              placeholder="Your email address"
              required
            />
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
            <input 
              type="text" 
              id="address" 
              name="address"
              value={deliveryInfo.address}
              onChange={handleDeliveryInfoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" 
              placeholder="Street address, apartment, etc."
              required
            />
          </div>
          
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
            <select 
              id="city" 
              name="city"
              value={deliveryInfo.city}
              onChange={handleDeliveryInfoChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="Nairobi">Nairobi</option>
              <option value="Mombasa">Mombasa</option>
              <option value="Kisumu">Kisumu</option>
              <option value="Nakuru">Nakuru</option>
              <option value="Eldoret">Eldoret</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Delivery Notes (Optional)</label>
            <textarea 
              id="notes" 
              name="notes"
              value={deliveryInfo.notes}
              onChange={handleDeliveryInfoChange}
              rows="3" 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" 
              placeholder="Any special instructions for delivery"
            ></textarea>
          </div>
          
          <div className="flex justify-between pt-4">
            <button 
              type="button" 
              onClick={() => setCheckoutStep(0)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back to Cart
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Continue to Payment
            </button>
          </div>
        </form>
      </div>
    );
  };
  
  // Payment form
  const renderPaymentForm = () => {
    return (
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>
        <form onSubmit={handlePaymentSubmit} className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center">
              <input 
                type="radio" 
                id="mpesa" 
                name="paymentMethod" 
                value="mpesa" 
                checked={paymentMethod === 'mpesa'}
                onChange={() => setPaymentMethod('mpesa')}
                className="w-4 h-4 text-primary-600 focus:ring-primary-500" 
              />
              <label htmlFor="mpesa" className="ml-2 block text-sm font-medium text-gray-700">
                M-Pesa
              </label>
            </div>
            
            {paymentMethod === 'mpesa' && (
              <div className="mt-4 pl-6">
                <label htmlFor="mpesaNumber" className="block text-sm font-medium text-gray-700 mb-1">M-Pesa Phone Number</label>
                <input 
                  type="tel" 
                  id="mpesaNumber" 
                  value={mpesaNumber}
                  onChange={(e) => setMpesaNumber(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500" 
                  placeholder="e.g. 0712345678"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">You will receive an STK push to complete payment</p>
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-2">Order Summary</h3>
            <div className="space-y-2 text-sm">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name} x {item.quantity}</span>
                  <span>KSh {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>KSh {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `KSh ${shippingCost.toLocaleString()}`}</span>
                </div>
                <div className="flex justify-between font-bold mt-2">
                  <span>Total</span>
                  <span>KSh {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            <button 
              type="button" 
              onClick={() => setCheckoutStep(1)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isProcessing}
            >
              Back to Delivery
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Complete Order'
              )}
            </button>
          </div>
        </form>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Checkout Steps */}
        {renderCheckoutSteps()}
        
        {checkoutStep === 0 && (
          <>
            <div className="flex items-center mb-8">
              <Link to="/products" className="flex items-center text-primary-600 hover:text-primary-700 mr-4">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Continue Shopping
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center p-6 border-b border-gray-200 last:border-b-0">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mr-4 overflow-hidden">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <ShoppingCart className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <Link to={`/products/${item.id}`} className="font-semibold text-gray-900 hover:text-primary-600">
                          {item.name}
                        </Link>
                        <p className="text-primary-600 font-bold">KSh {item.price.toLocaleString()}</p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-full hover:bg-gray-100"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full ml-4"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>KSh {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{shippingCost === 0 ? 'Free' : `KSh ${shippingCost.toLocaleString()}`}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>KSh {total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition-colors font-semibold"
                  >
                    Proceed to Checkout
                  </button>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center">
                      <Truck className="w-5 h-5 text-gray-600 mr-3" />
                      <span className="text-sm text-gray-600">Free delivery on orders above KSh 5,000</span>
                    </div>
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 text-gray-600 mr-3" />
                      <span className="text-sm text-gray-600">Secure payment with M-Pesa</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Recently Viewed Products */}
            {recentlyViewed.length > 0 && (
              <div className="mt-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Viewed</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {recentlyViewed.map((item) => (
                    <Link to={`/products/${item.id}`} key={item.id}>
                      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div className="aspect-w-1 aspect-h-1 w-full">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-48 object-contain"
                            />
                          ) : (
                            <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                              <ShoppingCart className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                          <p className="mt-1 text-lg font-bold text-primary-600">KSh {item.price.toLocaleString()}</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Delivery Information Form */}
        {checkoutStep === 1 && renderDeliveryForm()}
        
        {/* Payment Form */}
        {checkoutStep === 2 && renderPaymentForm()}
      </div>
    </div>
  );
};

export default Cart;