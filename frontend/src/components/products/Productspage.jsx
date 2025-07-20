import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star,
  ShoppingCart,
  Heart,
  Eye,
  X
} from '../../utils/icons.jsx';
import { getProducts } from '../../services/api.js';
import { showNotification } from '../../utils/notifications';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'Power Tools & Workshop Gear', name: 'Power Tools' },
    { id: 'Generators & Power Equipment', name: 'Generators' },
    { id: 'Electronics & Appliances', name: 'Electronics' }
  ];

  const fetchProducts = async () => {
    try {
      console.log('Fetching products from API...');
      const result = await getProducts();
      
      if (result.success) {
        const products = result.products || [];
        console.log(`Found ${products.length} products`);
        
        // Process products to ensure image fields are properly handled
        const processedProducts = products.map(product => {
          // Extract image URL from various possible formats
          let imageUrl = null;
          let images = [];
          
          // Check if images is an array
          if (Array.isArray(product.images) && product.images.length > 0) {
            images = product.images;
            // Handle ImageKit object format - exact same as admin
            imageUrl = product.images[0].url || product.images[0];
          }
          // Check if images is a string (JSON)
          else if (typeof product.images === 'string') {
            try {
              const parsedImages = JSON.parse(product.images);
              if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                images = parsedImages;
                imageUrl = parsedImages[0];
              }
            } catch (e) {
              console.error('Error parsing images JSON for product:', product.id, e);
            }
          }
          
          // Check individual image fields if no image found yet
          if (!imageUrl) {
            if (product.image1) imageUrl = product.image1;
            else if (product.image2) imageUrl = product.image2;
            else if (product.image3) imageUrl = product.image3;
            else if (product.image4) imageUrl = product.image4;
            
            // Collect all available image fields
            ['image1', 'image2', 'image3', 'image4'].forEach(field => {
              if (product[field]) {
                images.push(product[field]);
              }
            });
          }
          
          console.log(`Product ${product._id} (${product.name}): Image URL = ${imageUrl}`);
          
          return {
            ...product,
            processedImageUrl: imageUrl,
            processedImages: images
          };
        });
        
        setProducts(processedProducts);
        setFilteredProducts(processedProducts);
      } else {
        console.error('API returned error:', result.error);
        setProducts([]);
        setFilteredProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, priceRange, sortBy, products]);

  const filterProducts = () => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Price filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        // Rating sort removed
        case 'name':
        default:
          return a.name?.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  };

  const ProductCard = ({ product }) => {
    const [isInWishlist, setIsInWishlist] = useState(false);
    
    // Handle missing or null values
    const price = product.price || 0;
    const originalPrice = product.original_price || price;
    const productCode = product.model || 'N/A';
    
    // Use the pre-processed image URL
    const imageUrl = product.processedImageUrl;
    
    const API_URL = 'https://anzia-electronics-api.onrender.com/api';
    
    // Wishlist functionality disabled
    
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
          image: product.processedImageUrl
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden group relative"
      >
        <div className="relative">
          <div className="aspect-square bg-white p-4">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={product.name} 
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error('Image failed to load:', imageUrl);
                  e.target.style.display = 'none';
                  const placeholder = e.target.parentElement.querySelector('.placeholder');
                  if (placeholder) placeholder.style.display = 'flex';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gray-50 flex items-center justify-center placeholder">
                <i className="fas fa-shopping-cart text-4xl text-gray-300"></i>
              </div>
            )}
          </div>
          
          {originalPrice > price && (
            <div className="absolute top-2 left-2 bg-primary-500 text-white px-2 py-1 rounded text-sm font-medium">
              Save KSh {(originalPrice - price).toLocaleString()}
            </div>
          )}
          

        </div>

        <div className="p-3">
          <h3 className="text-sm text-gray-900 mb-2 line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>

          <div className="mb-3">
            <div className="text-lg font-bold text-primary-600">
              KSh {price.toLocaleString()}
            </div>
            {originalPrice > price && (
              <div className="text-sm text-gray-500 line-through">
                KSh {originalPrice.toLocaleString()}
              </div>
            )}
          </div>

          <div className="text-xs text-gray-500 mb-3">
            {product.brand || 'Electronics'}
          </div>

          <div className="space-y-2">
            <button
              onClick={addToCart}
              className="w-full bg-primary-600 text-white py-2 px-3 text-sm font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
            >
              <i className="fas fa-shopping-cart"></i>
              <span>Add to Cart</span>
            </button>
            <Link
              to={`/products/${product._id}`}
              className="w-full border border-gray-300 text-gray-600 py-2 px-3 hover:bg-gray-50 transition-colors text-center text-sm block"
            >
              View Details
            </Link>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Our Products</h1>
          <p className="text-gray-600">
            Discover our wide range of high-quality electronic tools and equipment
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            {/* View Mode */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid'
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <i className="fas fa-th"></i>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list'
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <p className="text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </p>
            {selectedCategory !== 'all' && (
              <div className="flex items-center bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm">
                <span>Category: {categories.find(c => c.id === selectedCategory)?.name}</span>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchParams({});
                  }}
                  className="ml-2 hover:bg-primary-200 rounded-full p-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-4 ${
          viewMode === 'grid'
            ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            <Link to="/" className="mt-4 inline-block bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
              Back to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
