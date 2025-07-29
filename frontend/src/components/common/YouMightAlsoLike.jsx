import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';

const API_URL = 'https://anzia-electronics-api.onrender.com/api';

const YouMightAlsoLike = ({ 
  currentProductId = null, 
  category = null, 
  limit = 4,
  title = "You Might Also Like",
  className = ""
}) => {
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to format product data
  const formatProductData = (rawProduct) => {
    if (!rawProduct) return null;
    
    let images = [];
    
    if (Array.isArray(rawProduct.images) && rawProduct.images.length > 0) {
      images = rawProduct.images;
    } else if (typeof rawProduct.images === 'string') {
      try {
        const parsedImages = JSON.parse(rawProduct.images);
        if (Array.isArray(parsedImages)) {
          images = parsedImages;
        }
      } catch (e) {
        console.error('Error parsing images JSON:', e);
      }
    }
    
    if (images.length === 0) {
      const imageFields = ['image1', 'image2', 'image3', 'image4'];
      imageFields.forEach(field => {
        if (rawProduct[field]) {
          images.push(rawProduct[field]);
        }
      });
    }
    
    if (images.length === 0 && rawProduct.image) {
      if (typeof rawProduct.image === 'string') {
        images.push(rawProduct.image);
      } else if (Array.isArray(rawProduct.image)) {
        images = rawProduct.image;
      }
    }
    
    if (images.length === 0) {
      images = ['/images/logo.svg'];
    }
    
    const productId = rawProduct._id ? rawProduct._id.toString() : (rawProduct.id ? rawProduct.id.toString() : '');
    
    return {
      id: productId,
      name: rawProduct.name || 'Unknown Product',
      brand: rawProduct.brand || 'Unknown Brand',
      category: rawProduct.category || 'Uncategorized',
      price: rawProduct.price || 0,
      originalPrice: rawProduct.original_price || rawProduct.price || 0,
      image: images,
      availability: rawProduct.availability || 'in-stock'
    };
  };

  useEffect(() => {
    let isCancelled = false;
    
    const fetchSuggestedProducts = async () => {
      if (isCancelled) return;
      
      try {
        setLoading(true);
        
        let endpoint = `${API_URL}/products?limit=${limit + 2}`;
        if (category) {
          endpoint += `&category=${encodeURIComponent(category)}`;
        }
        
        const response = await axios.get(endpoint);
        
        if (!isCancelled && response.data && response.data.products) {
          let filtered = response.data.products
            .filter(p => currentProductId ? p._id !== currentProductId : true)
            .map(p => formatProductData(p))
            .filter(p => p && p.id)
            .slice(0, limit);
          
          setSuggestedProducts(filtered);
        }
      } catch (err) {
        console.error('Error fetching suggested products:', err);
        setSuggestedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedProducts();
    
    return () => {
      isCancelled = true;
    };
  }, [currentProductId, category, limit]);

  if (loading) {
    return (
      <div className={`mt-8 ${className}`}>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
              <div className="w-full h-32 sm:h-48 bg-gray-200"></div>
              <div className="p-3 sm:p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-5 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (suggestedProducts.length === 0) {
    return null;
  }

  return (
    <div className={`mt-8 ${className}`}>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {suggestedProducts.map((product) => (
          <Link to={`/products/${product.id}`} key={product.id}>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 group">
              <div className="aspect-square bg-white p-2 sm:p-4 relative group">
                {product.image && product.image.length > 0 ? (
                  <img 
                    src={product.image[0].url || product.image[0]} 
                    alt={product.name}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/logo.svg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <i className="fas fa-shopping-cart text-2xl sm:text-4xl text-gray-400"></i>
                  </div>
                )}
                
                {/* Stock badge */}
                <div className="absolute top-1 sm:top-2 left-1 sm:left-2">
                  <span className="bg-green-500 text-white text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md shadow-sm">
                    ✓ Stock
                  </span>
                </div>
              </div>
              
              <div className="p-2 sm:p-3 md:p-4">
                <h3 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] leading-tight mb-2">
                  {product.name}
                </h3>
                
                <div className="mb-2">
                  <div className="text-sm sm:text-base md:text-lg font-bold text-primary-600">
                    KSh {product.price.toLocaleString()}
                  </div>
                  {product.originalPrice > product.price && (
                    <div className="text-xs sm:text-sm text-gray-500 line-through">
                      KSh {product.originalPrice.toLocaleString()}
                    </div>
                  )}
                </div>
                
                <div className="text-xs text-gray-500 truncate">
                  {product.brand}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

YouMightAlsoLike.propTypes = {
  currentProductId: PropTypes.string,
  category: PropTypes.string,
  limit: PropTypes.number,
  title: PropTypes.string,
  className: PropTypes.string
};

export default YouMightAlsoLike;