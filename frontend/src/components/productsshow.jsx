import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ShoppingCart, 
  ArrowRight
} from '../utils/icons.jsx';
import { getProducts } from '../services/api.js';

const ProductsShow = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      if (response.success) {
        // Process products to ensure image fields are properly handled
        const processedProducts = (response.products || []).map(product => {
          // Extract image URL from various possible formats
          let imageUrl = null;
          let images = [];
          
          // Check if images is an array
          if (Array.isArray(product.images) && product.images.length > 0) {
            images = product.images;
            imageUrl = product.images[0];
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
          
          return {
            ...product,
            processedImageUrl: imageUrl,
            processedImages: images
          };
        });
        
        setAllProducts(processedProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getProductsByCategory = (category) => {
    return allProducts.filter(product => product.category === category).slice(0, 4);
  };

  const ProductCard = ({ product, index }) => {
    // Handle missing or null values
    const price = product.price || 0;
    const originalPrice = product.original_price || price;
    const productCode = product.model || 'N/A';
    
    // Use the pre-processed image URL
    const imageUrl = product.processedImageUrl;
    
    return (
      <Link to={`/products/${product._id || product.id}`} className="block">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
        >
          <div className="relative">
            <div className="aspect-w-1 aspect-h-1 bg-gray-100">
              <div className="w-full h-40 flex items-center justify-center">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Image failed to load:', imageUrl);
                      e.target.onerror = null;
                      e.target.src = '';
                      e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-12 h-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg></div>';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingCart className="w-12 h-12 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
            {originalPrice > price && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
              </div>
            )}
          </div>
          <div className="p-3">
            <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 text-sm">
              {product.name}
            </h3>
            <div className="space-y-1">
              <div className="text-lg font-bold text-primary-600">
                KSh {price.toLocaleString()}
              </div>
              {originalPrice > price && (
                <div className="text-sm text-gray-500 line-through">
                  KSh {originalPrice.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </Link>
    );
  };

  if (loading) {
    return (
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  // Define categories
  const categories = [
    { name: 'Power Tools & Workshop Gear', icon: '🔧' },
    { name: 'Generators & Power Equipment', icon: '⚡' },
    { name: 'Electronics & Appliances', icon: '💡' }
  ];

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Sections */}
        {categories.map((category) => {
          const categoryProducts = getProductsByCategory(category.name);
          
          return (
            <div key={category.name} className="mb-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <span className="text-2xl mr-3">{category.icon}</span>
                    {category.name}
                  </h2>
                  <Link 
                    to={`/products?category=${encodeURIComponent(category.name)}`}
                    className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
                  >
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
                
                {categoryProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categoryProducts.map((product, index) => (
                      <ProductCard key={product._id || product.id} product={product} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <ShoppingCart className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No products in this category</h3>
                    <p className="text-gray-600 mb-4">Products will appear here once they are added.</p>
                    <Link 
                      to="/products"
                      className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Browse all products
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        {/* Show message if no products at all */}
        {allProducts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm p-6">
            <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products available</h3>
            <p className="text-gray-600">Products will appear here once they are added.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsShow;