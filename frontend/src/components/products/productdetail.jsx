import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProductById } from '../../services/api.js';
import { trackProductView, trackAddToCart } from '../../services/trackingService.js';
import { 
  Star, 
  Heart, 
  Share2, 
  ShoppingCart, 
  Phone, 
  MessageCircle,
  Check,
  Truck,
  Shield,
  ArrowLeft,
  Eye
} from '../../utils/icons.jsx';
import axios from 'axios';

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

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [isInWishlist, setIsInWishlist] = useState(false);
  
  const API_URL = 'https://anzia-electronics-api.onrender.com/api';

  // Helper function to format product data
  const formatProductData = (rawProduct) => {
    if (!rawProduct) return null;
    
    // Handle all possible image field formats
    let images = [];
    
    // Check if images is an array
    if (Array.isArray(rawProduct.images) && rawProduct.images.length > 0) {
      images = rawProduct.images;
    } 
    // Check if images is a string (JSON)
    else if (typeof rawProduct.images === 'string') {
      try {
        const parsedImages = JSON.parse(rawProduct.images);
        if (Array.isArray(parsedImages)) {
          images = parsedImages;
        }
      } catch (e) {
        console.error('Error parsing images JSON:', e);
      }
    }
    
    // Check for individual image fields if no images found yet
    if (images.length === 0) {
      const imageFields = ['image1', 'image2', 'image3', 'image4'];
      imageFields.forEach(field => {
        if (rawProduct[field]) {
          images.push(rawProduct[field]);
        }
      });
    }
    
    // If we still don't have images, check if there's a single image field
    if (images.length === 0 && rawProduct.image) {
      if (typeof rawProduct.image === 'string') {
        images.push(rawProduct.image);
      } else if (Array.isArray(rawProduct.image)) {
        images = rawProduct.image;
      }
    }
    
    // If we still don't have images, use a default image
    if (images.length === 0) {
      images = ['https://ik.imagekit.io/q5jukn457/laptop.jpg'];
    }
    
    console.log('Product images:', images);
    
    // Ensure we have a valid ID (handle both MongoDB _id and regular id)
    const productId = rawProduct._id ? rawProduct._id.toString() : (rawProduct.id ? rawProduct.id.toString() : '');
    
    // Extract and format data from the raw product
    return {
      id: productId,
      productCode: rawProduct.model || 'N/A',
      name: rawProduct.name || 'Unknown Product',
      brand: rawProduct.brand || 'Unknown Brand',
      model: rawProduct.model || 'N/A',
      category: rawProduct.category || 'Uncategorized',
      price: rawProduct.price || 0,
      originalPrice: rawProduct.original_price || rawProduct.price || 0,
      image: images,
      availability: rawProduct.availability || 'in-stock', // Default to in-stock
      stockQuantity: rawProduct.stock_quantity || 10, // Default to 10
      warranty: rawProduct.warranty || '1 Year', // Default warranty
      weight: '1.8 kg', // Default value
      dimensions: '25 x 8 x 20 cm', // Default value
      features: Array.isArray(rawProduct.features) ? rawProduct.features : ['Premium Quality', 'Durable Design', 'Energy Efficient', 'User Friendly'],
      specifications: Array.isArray(rawProduct.specifications) ? rawProduct.specifications : [
        { label: 'Brand', value: rawProduct.brand || 'Premium Brand' },
        { label: 'Model', value: rawProduct.model || 'Latest Model' },
        { label: 'Condition', value: rawProduct.condition || 'New' },
        { label: 'Warranty', value: rawProduct.warranty || '1 Year' },
      ],
      description: rawProduct.description || 'This premium product offers exceptional quality and performance. Made with high-quality materials and advanced technology, it provides reliable operation and long-lasting durability.',
      phone: '+254 700 000 000' // Default contact number
    };
  };

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        console.log('Fetching product with ID:', id);
        const result = await getProductById(id);
        console.log('API result:', result);
        
        if (result.success && result.product) {
          // Format the raw product data
          const formattedProduct = formatProductData(result.product);
          setProduct(formattedProduct);
          
          // Track product view
          trackProductView(formattedProduct.id).catch(err => 
            console.log('Error tracking product view:', err)
          );
          
          // Save to recently viewed in localStorage
          try {
            const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
            // Remove if already exists
            const filtered = viewed.filter(item => item.id !== formattedProduct.id);
            // Add to beginning of array
            const updated = [{ 
              id: formattedProduct.id.toString(), // Ensure ID is a string
              name: formattedProduct.name, 
              price: formattedProduct.price,
              image: formattedProduct.image[0] || ''
            }, ...filtered].slice(0, 4); // Keep only 4 items
            
            console.log('Saving product to recently viewed with ID:', formattedProduct.id.toString());
            localStorage.setItem('recentlyViewed', JSON.stringify(updated));
            setRecentlyViewed(updated);
          } catch (e) {
            console.error('Error handling recently viewed:', e);
          }
          
          // Fetch suggested products based on category
          if (formattedProduct.category) {
            fetchSuggestedProducts(formattedProduct);
          }
          
          // Check if product is in wishlist
          checkWishlistStatus(formattedProduct.id);
        } else {
          console.error('Failed to fetch product:', result.error || 'Unknown error');
        }
      } catch (error) {
        console.error('Error loading product:', error);
      } finally {
        setLoading(false);
      }
    }
    
    // Function to fetch suggested products
    async function fetchSuggestedProducts(currentProduct) {
      try {
        // Only fetch if we have a category
        if (!currentProduct.category) {
          setSuggestedProducts([]);
          return;
        }
        
        const response = await axios.get(`/api/products/category/${currentProduct.category}?limit=10`);
        if (response.data && response.data.products) {
          // Filter out current product
          const filtered = response.data.products
            .filter(p => p.id !== currentProduct.id)
            .map(p => formatProductData(p))
            .slice(0, 4);
          
          // Only set suggested products if we actually have some
          if (filtered.length > 0) {
            setSuggestedProducts(filtered);
          } else {
            setSuggestedProducts([]);
          }
        } else {
          setSuggestedProducts([]);
        }
      } catch (err) {
        console.error('Error fetching suggested products:', err);
        // Don't use mock data, just show nothing
        setSuggestedProducts([]);
      }
    }
    
    loadProduct();
    
    // Function to check wishlist status
    async function checkWishlistStatus(productId) {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user._id) return;
        
        const response = await axios.get(`${API_URL}/wishlist/${user._id}`);
        if (response.data.success) {
          const inWishlist = response.data.wishlist.some(item => 
            item.productId._id === productId
          );
          setIsInWishlist(inWishlist);
        }
      } catch (error) {
        console.error('Error checking wishlist status:', error);
      }
    }
    
    loadProduct();
    
    // Load recently viewed from localStorage
    try {
      const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      setRecentlyViewed(viewed);
    } catch (e) {
      console.error('Error loading recently viewed:', e);
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    try {
      // Get existing cart from localStorage
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      
      // Check if product already exists in cart
      const existingItemIndex = cart.findIndex(item => item.id === product.id.toString());
      
      if (existingItemIndex >= 0) {
        // Update quantity if product already in cart
        cart[existingItemIndex].quantity += quantity;
        
        // Create a popup notification instead of alert
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50 animate-fade-in-out';
        notification.innerHTML = `
          <div class="flex items-center">
            <div class="mr-3">
              <svg class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p class="font-bold">Item updated in cart</p>
              <p class="text-sm">${product.name} quantity updated to ${cart[existingItemIndex].quantity}</p>
            </div>
          </div>
        `;
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
          notification.classList.add('fade-out');
          setTimeout(() => document.body.removeChild(notification), 500);
        }, 3000);
      } else {
        // Add new item to cart
        cart.push({
          id: product.id.toString(), // Ensure ID is a string
          name: product.name,
          price: product.price,
          image: product.image[0] || '',
          quantity: quantity
        });
        
        // Create a popup notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md z-50 animate-fade-in-out';
        notification.innerHTML = `
          <div class="flex items-center">
            <div class="mr-3">
              <svg class="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p class="font-bold">Item added to cart</p>
              <p class="text-sm">${product.name}</p>
            </div>
          </div>
        `;
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
          notification.classList.add('fade-out');
          setTimeout(() => document.body.removeChild(notification), 500);
        }, 3000);
      }
      
      // Save updated cart to localStorage
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Track action in analytics
      trackAddToCart(product.id, quantity, product.price)
        .catch(err => console.log('Analytics tracking error:', err));
      
      // Dispatch custom event to update cart count in navbar
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    } catch (error) {
      console.error('Error adding to cart:', error);
      
      // Show error notification
      const notification = document.createElement('div');
      notification.className = 'fixed top-20 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md z-50';
      notification.innerHTML = `
        <div class="flex items-center">
          <div class="mr-3">
            <svg class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <p class="font-bold">Error</p>
            <p class="text-sm">Failed to add item to cart</p>
          </div>
        </div>
      `;
      document.body.appendChild(notification);
      
      // Remove notification after 3 seconds
      setTimeout(() => document.body.removeChild(notification), 3000);
    }
  };

  const toggleWishlist = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user._id) {
        alert('Please login to add to wishlist');
        return;
      }
      
      if (isInWishlist) {
        await axios.delete(`${API_URL}/wishlist/remove`, {
          data: { userId: user._id, productId: product.id }
        });
        setIsInWishlist(false);
      } else {
        await axios.post(`${API_URL}/wishlist/add`, {
          userId: user._id,
          productId: product.id
        });
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <Link to="/products" className="text-primary-600 hover:text-primary-700">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary-600">Products</Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Back Button */}
        <Link
          to="/products"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="aspect-w-1 aspect-h-1 mb-4">
              {product.image && product.image.length > 0 ? (
                <img 
                  src={product.image[selectedImage].url || product.image[selectedImage]} 
                  alt={product.name}
                  className="w-full h-96 object-contain rounded-lg"
                />
              ) : (
                <div className="w-full h-96 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-24 h-24 text-primary-400" />
                </div>
              )}
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex space-x-2">
              {product.image.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 rounded-lg border-2 ${
                    selectedImage === index
                      ? 'border-primary-500'
                      : 'border-gray-200'
                  }`}
                >
                  <img 
                    src={img.url || img} 
                    alt={`${product.name} - ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-primary-600 font-medium">
                {product.brand} • {product.productCode}
              </span>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={toggleWishlist}
                  className={`p-2 border rounded-lg transition-colors ${
                    isInWishlist 
                      ? 'border-red-300 bg-red-50 text-red-600' 
                      : 'border-gray-300 hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist ? 'fill-current' : ''}`} />
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Rating removed */}

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900">
                  KSh {product.price.toLocaleString()}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    KSh {product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              {product.originalPrice > product.price && (
                <div className="mt-2">
                  <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    Save KSh {(product.originalPrice - product.price).toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Availability */}
            <div className="flex items-center mb-6">
              <Check className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-green-700 font-medium">
                In Stock ({product.stockQuantity} available)
              </span>
            </div>

            {/* Key Features */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quantity and Actions */}
            <div className="border-t pt-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center">
                  <label className="text-sm font-medium text-gray-700 mr-3">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex mb-6">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center justify-center"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </button>
              </div>

              {/* Contact Info */}
              <div className="flex items-center justify-center space-x-6 py-4 bg-gray-50 rounded-lg">
                <a
                  href={`tel:${product.phone}`}
                  className="flex items-center text-primary-600 hover:text-primary-700"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  <span className="font-medium">Call Us</span>
                </a>
                <a
                  href={`https://wa.me/${product.phone.replace(/\D/g, '')}`}
                  className="flex items-center text-green-600 hover:text-green-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
              <div className="text-center">
                <Truck className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Free Delivery</p>
                <p className="text-xs text-gray-500">Within Nairobi</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">{product.warranty} Warranty</p>
                <p className="text-xs text-gray-500">Manufacturer</p>
              </div>
              <div className="text-center">
                <Check className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Genuine Product</p>
                <p className="text-xs text-gray-500">100% Authentic</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['description', 'specifications'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Technical Specifications</h3>
                  <dl className="space-y-3">
                    {product.specifications.map((spec, index) => (
                      <div key={index} className="flex justify-between py-2 border-b border-gray-100">
                        <dt className="font-medium text-gray-900">{spec.label}</dt>
                        <dd className="text-gray-700">{spec.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
                  <dl className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="font-medium text-gray-900">Brand</dt>
                      <dd className="text-gray-700">{product.brand}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="font-medium text-gray-900">Model</dt>
                      <dd className="text-gray-700">{product.model}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="font-medium text-gray-900">Warranty</dt>
                      <dd className="text-gray-700">{product.warranty}</dd>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <dt className="font-medium text-gray-900">Weight</dt>
                      <dd className="text-gray-700">{product.weight}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}

            {/* Reviews section removed */}
          </div>
        </div>
        
        {/* Suggested Products - Only show if we have real products */}
        {suggestedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {suggestedProducts.map((product) => (
                <Link to={`/products/${product.id}`} key={product.id}>
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-w-1 aspect-h-1 w-full">
                      {product.image && product.image.length > 0 ? (
                        <img 
                          src={product.image[0].url || product.image[0]} 
                          alt={product.name}
                          className="w-full h-48 object-contain"
                          onError={(e) => {
                            console.error('Image failed to load:', product.image[0]);
                            e.target.onerror = null;
                            e.target.src = '/images/logo.svg';
                          }}
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                          <ShoppingCart className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
                      <p className="mt-1 text-lg font-bold text-primary-600">KSh {product.price.toLocaleString()}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Recently Viewed Products */}
        {recentlyViewed.length > 1 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recently Viewed</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyViewed
                .filter(item => item.id !== id.toString()) // Filter out current product
                .map((item) => (
                <Link to={`/products/${item.id}`} key={item.id}>
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="aspect-w-1 aspect-h-1 w-full">
                      {item.image ? (
                        <img 
                          src={item.image.url || item.image} 
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
};

export default ProductDetail;