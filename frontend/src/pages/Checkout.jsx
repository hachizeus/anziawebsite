import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// Font Awesome icons used directly in JSX
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { cartService } from '../services/cartService';

const API_URL = 'https://anzia-electronics-api.onrender.com/api';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [merchantRequestID, setMerchantRequestID] = useState('');
  const [status, setStatus] = useState('');
  const [orderData, setOrderData] = useState({
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Kenya'
    },
    paymentMethod: 'mpesa',
    phoneNumber: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) {
      navigate('/login');
      return;
    }
    loadCart();
    loadUserProfile();
  }, [user, navigate]);
  
  const loadCart = async () => {
    if (user?._id) {
      const items = await cartService.getCart(user._id);
      if (items.length === 0) {
        navigate('/cart');
        return;
      }
      setCartItems(items);
    }
  };

  const loadUserProfile = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user._id) {
        const response = await axios.get(`${API_URL}/users/profile/${user._id}`);
        if (response.data.success && response.data.user.address) {
          setOrderData(prev => ({
            ...prev,
            shippingAddress: response.data.user.address
          }));
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user._id) {
        toast.error('Please login to place order');
        navigate('/login');
        return;
      }
      
      if (!orderData.phoneNumber || orderData.phoneNumber.length < 10) {
        toast.error('Please enter a valid phone number');
        setLoading(false);
        return;
      }

      const orderPayload = {
        userId: user._id,
        items: cartItems.map(item => ({
          productId: item.productId?._id || item.productId,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: getTotalPrice(),
        shippingAddress: orderData.shippingAddress,
        paymentMethod: 'mpesa',
        phoneNumber: orderData.phoneNumber
      };

      const response = await axios.post(`${API_URL}/orders/create`, orderPayload);
      
      if (response.data.success) {
        // Initiate M-Pesa payment
        const paymentResponse = await axios.post(`${API_URL}/stk-push`, {
          phone: orderData.phoneNumber,
          amount: getTotalPrice(),
          orderId: response.data.orderId
        });
        
        console.log('M-Pesa Response:', paymentResponse.data);
        if (paymentResponse.data.MerchantRequestID) {
          setMerchantRequestID(paymentResponse.data.MerchantRequestID);
          toast.info('Request sent. Please enter M-Pesa PIN.');
          checkTransactionStatus(paymentResponse.data.MerchantRequestID);
          
          // Clear cart from backend
          await cartService.clearCart(user._id);
        } else {
          console.error('M-Pesa Error:', paymentResponse.data);
          toast.error(`M-Pesa Error: ${paymentResponse.data.errorMessage || 'Failed to initiate payment'}`);
        }
      }
    } catch (error) {
      console.error('Error placing order:', error);
      if (error.response?.data?.message) {
        toast.error(`Order Error: ${error.response.data.message}`);
      } else {
        toast.error('Failed to place order');
      }
    } finally {
      setLoading(false);
    }
  };

  const checkTransactionStatus = async (merchantRequestID) => {
    let attempts = 0;
    const maxAttempts = 10;
    let delay = 4000;

    const poll = async () => {
      try {
        const res = await axios.get(`${API_URL}/transaction-status/${merchantRequestID}`);
        setStatus(res.data.status);

        if (res.data.status === "Success") {
          toast.success("Payment Successful!");
          // Ensure cart is cleared and count updated
          window.dispatchEvent(new CustomEvent('cartUpdated'));
          navigate('/dashboard');
          return;
        } else if (res.data.status === "Failed") {
          toast.error("Payment Failed!");
          return;
        }

        if (++attempts < maxAttempts) {
          setTimeout(poll, delay);
          delay *= 1.5; // Exponential backoff
        } else {
          toast.error("Transaction timed out. Please try again.");
        }
      } catch (error) {
        console.error("Status Check Error:", error);
        toast.error("Error checking transaction status.");
      }
    };

    poll();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={orderData.shippingAddress.street}
                  onChange={(e) => setOrderData({
                    ...orderData,
                    shippingAddress: { ...orderData.shippingAddress, street: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={orderData.shippingAddress.city}
                    onChange={(e) => setOrderData({
                      ...orderData,
                      shippingAddress: { ...orderData.shippingAddress, city: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    value={orderData.shippingAddress.zipCode}
                    onChange={(e) => setOrderData({
                      ...orderData,
                      shippingAddress: { ...orderData.shippingAddress, zipCode: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (for M-Pesa)
                </label>
                <input
                  type="tel"
                  required
                  placeholder="254XXXXXXXXX"
                  value={orderData.phoneNumber || ''}
                  onChange={(e) => setOrderData({ ...orderData, phoneNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">M</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-green-800">M-Pesa Payment</h3>
                    <p className="text-sm text-green-600">Pay securely with M-Pesa mobile money</p>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item, index) => (
                <div key={item.productId?._id || item.productId || index} className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                    {(item.image || item.productId?.images?.[0]?.url || item.productId?.images?.[0]) ? (
                      <img 
                        src={item.image || item.productId?.images?.[0]?.url || item.productId?.images?.[0]} 
                        alt={item.name || item.productId?.name} 
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          console.error('Image failed to load:', e.target.src);
                          e.target.style.display = 'none';
                          const placeholder = e.target.parentElement.querySelector('.placeholder');
                          if (placeholder) placeholder.style.display = 'flex';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center placeholder">
                        <i className="fas fa-shopping-cart text-2xl text-primary-400"></i>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{item.name || item.productId?.name}</h4>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    KSh {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">KSh {getTotalPrice().toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-semibold">Free</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span className="text-primary-600">KSh {getTotalPrice().toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
