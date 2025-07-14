import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Star, ShoppingCart } from '../utils/icons.jsx';
import { getProducts } from '../services/api.js';

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [timeLeft, setTimeLeft] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const response = await getProducts();
        if (response.success) {
          // Transform products into deals format
          const dealsData = response.products.slice(0, 6).map((product, index) => ({
            id: product.id,
            name: product.name,
            price: product.price,
            originalPrice: Math.round(product.price * 1.3), // 30% markup for original price
            discount: 20 + (index * 5), // Varying discounts
            image: product.image1 || '/images/placeholder.jpg',
            rating: 4.0 + (Math.random() * 1), // Random rating 4.0-5.0
            reviewCount: Math.floor(Math.random() * 200) + 50,
            sold: Math.floor(Math.random() * 100) + 20,
            total: Math.floor(Math.random() * 200) + 100,
            endTime: new Date(Date.now() + (2 + index * 2) * 60 * 60 * 1000) // Staggered end times
          }));
          setDeals(dealsData);
        }
      } catch (error) {
        console.error('Error fetching deals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

  useEffect(() => {
    if (deals.length === 0) return;
    
    const timer = setInterval(() => {
      const newTimeLeft = {};
      deals.forEach(deal => {
        const now = new Date().getTime();
        const distance = deal.endTime.getTime() - now;
        
        if (distance > 0) {
          const hours = Math.floor(distance / (1000 * 60 * 60));
          const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          newTimeLeft[deal.id] = `${hours}h ${minutes}m`;
        } else {
          newTimeLeft[deal.id] = 'Expired';
        }
      });
      setTimeLeft(newTimeLeft);
    }, 1000);

    return () => clearInterval(timer);
  }, [deals]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Flash Deals</h1>
          <p className="text-gray-600">Limited time offers on quality electronics</p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading flash deals...</p>
          </div>
        ) : (
          /* Deals Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.map((deal, index) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Deal Badge */}
              <div className="bg-red-500 text-white px-4 py-2 flex items-center justify-between">
                <span className="font-bold">⚡ FLASH DEAL</span>
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  {timeLeft[deal.id] || 'Loading...'}
                </div>
              </div>

              {/* Product Image */}
              <div className="relative">
                <div className="aspect-w-1 aspect-h-1 bg-gray-100">
                  <img 
                    src={deal.image} 
                    alt={deal.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = '/images/placeholder.jpg';
                    }}
                  />
                </div>
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                  -{deal.discount}%
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {deal.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(deal.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">({deal.reviewCount})</span>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="text-2xl font-bold text-red-600">
                    KSh {deal.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 line-through">
                    KSh {deal.originalPrice.toLocaleString()}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{deal.sold} sold</span>
                    <span>{deal.total} total</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-red-500 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${(deal.sold / deal.total) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  to={`/products/${deal.id}`}
                  className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors text-center block"
                >
                  Buy Now
                </Link>
              </div>
            </motion.div>
          ))}
          </div>
        )}

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="bg-white text-primary-600 border border-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
            Load More Deals
          </button>
        </div>
      </div>
    </div>
  );
};

export default Deals;


