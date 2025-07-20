import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from '../../utils/icons.jsx';

// Mock product data
const mockProducts = [
  {
    id: 1,
    name: 'Dell XPS 15 Laptop',
    price: 159999,
    originalPrice: 179999,
    brand: 'Dell',
    model: 'XPS 15',
    category: 'Electronics',
    availability: 'in-stock',
    processedImageUrl: 'https://ik.imagekit.io/q5jukn457/laptop.jpg',
  },
  {
    id: 2,
    name: 'Samsung Galaxy S21 Smartphone',
    price: 89999,
    originalPrice: 99999,
    brand: 'Samsung',
    model: 'Galaxy S21',
    category: 'Electronics',
    availability: 'in-stock',
    processedImageUrl: 'https://ik.imagekit.io/q5jukn457/smartphone.jpg',
  },
  {
    id: 3,
    name: 'Sony WH-1000XM4 Headphones',
    price: 34999,
    originalPrice: 39999,
    brand: 'Sony',
    model: 'WH-1000XM4',
    category: 'Audio',
    availability: 'in-stock',
    processedImageUrl: 'https://ik.imagekit.io/q5jukn457/headphones.jpg',
  },
  {
    id: 4,
    name: 'LG 27UK850 4K Monitor',
    price: 49999,
    originalPrice: 54999,
    brand: 'LG',
    model: '27UK850',
    category: 'Electronics',
    availability: 'in-stock',
    processedImageUrl: 'https://ik.imagekit.io/q5jukn457/monitor.jpg',
  },
  {
    id: 5,
    name: 'Logitech G Pro X Mechanical Keyboard',
    price: 14999,
    originalPrice: 16999,
    brand: 'Logitech',
    model: 'G Pro X',
    category: 'Accessories',
    availability: 'in-stock',
    processedImageUrl: 'https://ik.imagekit.io/q5jukn457/keyboard.jpg',
  },
  {
    id: 6,
    name: 'Apple MacBook Pro',
    price: 199999,
    originalPrice: 219999,
    brand: 'Apple',
    model: 'MacBook Pro',
    category: 'Electronics',
    availability: 'in-stock',
    processedImageUrl: 'https://ik.imagekit.io/q5jukn457/laptop.jpg',
  }
];

const MockProducts = ({ limit = 6 }) => {
  // Take only the specified number of products
  const displayProducts = mockProducts.slice(0, limit);

  const ProductCard = ({ product }) => {
    // Handle missing or null values
    const price = product.price || 0;
    const originalPrice = product.originalPrice || price;
    const productCode = product.model || 'N/A';
    
    // Use the pre-processed image URL
    const imageUrl = product.processedImageUrl;
    
    return (
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
        <div className="relative">
          <div className="aspect-w-16 aspect-h-12 bg-gray-200">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={product.name} 
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '';
                  e.target.parentElement.innerHTML = '<div class="w-full h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center"><svg class="w-16 h-16 text-primary-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg></div>';
                }}
              />
            ) : (
              <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                <ShoppingCart className="w-16 h-16 text-primary-400" />
              </div>
            )}
          </div>
          
          {originalPrice > price && (
            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
              Save KSh {(originalPrice - price).toLocaleString()}
            </div>
          )}
          
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
              <Heart className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 font-medium">{product.brand || 'Unknown'}</span>
            <span className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded">
              {productCode}
            </span>
          </div>

          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {product.name}
          </h3>

          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-lg font-bold text-gray-900">
                KSh {price.toLocaleString()}
              </span>
              {originalPrice > price && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  KSh {originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            <span className={`text-xs px-2 py-1 rounded-full ${
              product.availability === 'in-stock'
                ? 'text-green-700 bg-green-100'
                : 'text-red-700 bg-red-100'
            }`}>
              {product.availability === 'in-stock' ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <div className="flex">
            <Link
              to={`/products/${product.id}`}
              className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors text-center text-sm font-medium"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {displayProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default MockProducts;
