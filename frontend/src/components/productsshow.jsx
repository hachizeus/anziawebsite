import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// Font Awesome icons used directly in JSX
import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from "prop-types";
import { showNotification } from '../utils/notifications';
import { cachedFetch } from '../utils/requestCache';


const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  
  const API_URL = 'https://anzia-electronics-api.onrender.com/api';
  
  useEffect(() => {
    checkWishlistStatus();
  }, []);
  
  const checkWishlistStatus = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user._id) return;
      
      const response = await axios.get(`${API_URL}/wishlist/${user._id}`);
      if (response.data.success) {
        const inWishlist = response.data.wishlist.some(item => 
          item.productId._id === product._id
        );
        setIsInWishlist(inWishlist);
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  };

  const handleNavigate = () => {
    navigate(`/products/${product._id}`);
  };

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user._id) {
        showNotification('Please login to add to wishlist', 'warning');
        return;
      }
      
      if (isInWishlist) {
        await axios.delete(`${API_URL}/wishlist/remove`, {
          data: { userId: user._id, productId: product._id }
        });
        setIsInWishlist(false);
      } else {
        await axios.post(`${API_URL}/wishlist/add`, {
          userId: user._id,
          productId: product._id
        });
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };

  const addToCart = async (e) => {
    e.stopPropagation();
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user._id) {
        showNotification('Please login to add items to cart', 'warning');
        return;
      }
      
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/cart/add`, {
        userId: user._id,
        productId: product._id,
        quantity: 1,
        price: product.price,
        name: product.name,
        image: product.images?.[0]?.url || product.images?.[0]
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      window.dispatchEvent(new CustomEvent('cartUpdated'));
      showNotification('Added to cart!', 'success');
    } catch (error) {
      console.error('Error adding to cart:', error);
      showNotification('Failed to add to cart. Please try again.', 'error');
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={handleNavigate}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative h-48">
        <img
          src={product.images?.[0]?.url || product.images?.[0] || '/images/placeholder-product.jpg'}
          alt={product.images?.[0]?.alt || product.name || product.title}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/images/placeholder-product.jpg';
          }}
        />
        
        {/* Product badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="bg-primary-600 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-md">
            {product.category || 'Electronics'}
          </span>
          {product.inStock && (
            <span className="bg-green-600 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-md">
              In Stock
            </span>
          )}
        </div>
        
        {/* Bookmark button */}
        <button 
          onClick={toggleWishlist}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 
            ${isInWishlist 
              ? 'bg-primary-500 text-white' 
              : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:text-primary-500'}`}
        >
          <i className={`fas fa-heart ${isInWishlist ? 'text-primary-500' : ''}`}></i>
        </button>
        
        {/* View overlay on hover */}
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="px-5 py-3 bg-white dark:bg-gray-800 text-primary-600 rounded-lg font-medium flex items-center gap-2 shadow-lg"
              >
                <i className="fas fa-eye"></i>
                View Details
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Product Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary-600 transition-colors">
          {product.name || product.title}
        </h3>
        
        <div className="flex items-center text-gray-600 dark:text-gray-300 mb-4">
          <i className="fas fa-bolt mr-2 flex-shrink-0 text-primary-500"></i>
          <span className="line-clamp-1">{product.brand || 'Quality Electronics'}</span>
        </div>
        
        {/* Product Features */}
        <div className="flex justify-between items-center py-2 border-y border-gray-100 dark:border-gray-700 mb-3">
          <div className="flex items-center gap-1">
            <i className="fas fa-star text-yellow-500"></i>
            <span className="text-sm text-gray-600 dark:text-gray-300">{product.rating || '4.5'} Rating</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-600 dark:text-gray-300">Model: {product.model || 'N/A'}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-primary-600 font-bold">
            <span className="text-lg font-bold text-primary-600">KSh {Number(product.price || 0).toLocaleString()}</span>
          </div>
          
          <button
            onClick={addToCart}
            className="text-sm bg-primary-500 text-white px-3 py-2 rounded-md flex items-center hover:bg-primary-600 transition-colors"
          >
            <i className="fas fa-shopping-cart mr-1"></i>
            Add to Cart
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ProductsShow = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const navigate = useNavigate();

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'power-tools', label: 'Power Tools' },
    { id: 'generators', label: 'Generators' },
    { id: 'welding', label: 'Welding Equipment' },
    { id: 'electronics', label: 'Electronics' },
    { id: 'appliances', label: 'Home Appliances' }
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Add delay to prevent rapid requests
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        if (!isMounted) return;
        
        const response = await axios.get(`https://anzia-electronics-api.onrender.com/api/products`, {
          timeout: 15000,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (isMounted && response.data.success) {
          // Take only the first 6 products for featured section
          const featuredProducts = response.data.products?.slice(0, 6) || [];
          setProducts(featuredProducts);
        } else if (isMounted) {
          setError('API temporarily unavailable');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        if (isMounted) setError('Failed to load products');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(product => product.category?.toLowerCase().includes(activeCategory.replace('-', ' ')) || product.type?.toLowerCase() === activeCategory);

  const viewAllProducts = () => {
    navigate('/products');
  };

  if (loading) {
    return (
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="h-6 bg-gray-200 rounded w-32 mx-auto mb-4 animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          
          <div className="space-y-16">
            {['Generators', 'Power Tools', 'Electronics'].map((section) => (
              <div key={section}>
                <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-6 animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                      <div className="h-48 bg-gray-200"></div>
                      <div className="p-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                        <div className="flex justify-between items-center">
                          <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                          <div className="h-8 bg-gray-200 rounded w-20"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary-600 font-semibold tracking-wide uppercase text-sm">Featured Products</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
            Electronics Catalog
          </h2>
          <div className="w-24 h-1 bg-primary-600 mx-auto mb-6"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover our handpicked selection of premium electronics and tools designed for professionals and enthusiasts
          </p>
        </motion.div>

        {/* Category sections */}
        <div className="space-y-16">
          {/* Generators Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Generators</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.filter(product => product.category?.toLowerCase().includes('generator')).slice(0, 3).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </motion.div>

          {/* Power Tools Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Power Tools</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.filter(product => product.category?.toLowerCase().includes('power') || product.category?.toLowerCase().includes('tool')).slice(0, 3).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </motion.div>

          {/* Electronics Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Electronics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.filter(product => product.category?.toLowerCase().includes('electronic') || !product.category?.toLowerCase().includes('generator') && !product.category?.toLowerCase().includes('power')).slice(0, 3).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </motion.div>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-amber-700 bg-amber-50 p-4 rounded-lg border border-amber-200 mb-8 max-w-md mx-auto text-center"
          >
            <p className="font-medium mb-1">Note: {error}</p>
            <p className="text-sm">Showing sample products for demonstration.</p>
          </motion.div>
        )}

        {products.length === 0 && (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm">
            <i className="fas fa-search text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No products available</h3>
            <p className="text-gray-600 mb-6">Loading products...</p>
          </div>
        )}

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button
            onClick={viewAllProducts}
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20 font-medium"
          >
            Browse All Products
            <i className="fas fa-arrow-right ml-2"></i>
          </button>
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-sm">
            Discover our complete collection of premium electronics and tools
          </p>
        </motion.div>
      </div>
    </section>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired
};

export default ProductsShow;


