import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Star, 
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
        setAllProducts(response.products || []);
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

  const ProductCard = ({ product, index }) => (
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
              {product.image && product.image[0] ? (
                <img 
                  src={product.image[0]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="w-full h-full flex items-center justify-center" style={{display: product.image && product.image[0] ? 'none' : 'flex'}}>
                <ShoppingCart className="w-12 h-12 text-gray-400" />
              </div>
            </div>
          </div>
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 text-sm">
            {product.name}
          </h3>
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
            ))}
            <span className="text-xs text-gray-500 ml-2">({product.reviewCount || 0})</span>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-bold text-primary-600">
              KSh {(product.price || 0).toLocaleString()}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <div className="text-sm text-gray-500 line-through">
                KSh {product.originalPrice.toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  );

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

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Category Sections */}
        {[
          { name: 'Power Tools & Workshop Gear', icon: '🔧' },
          { name: 'Generators & Power Equipment', icon: '⚡' },
          { name: 'Electronics & Appliances', icon: '💡' }
        ].map((category) => {
          const categoryProducts = getProductsByCategory(category.name);
          if (categoryProducts.length === 0) return null;
          
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
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {categoryProducts.map((product, index) => (
                    <ProductCard key={product._id || product.id} product={product} index={index} />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
        
        {allProducts.length === 0 && (
          <div className="text-center py-12">
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


