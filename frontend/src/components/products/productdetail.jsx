import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');

  // Mock product data
  const mockProduct = {
    id: 1,
    productCode: 'AE-001-001',
    name: 'Bosch Professional Drill GSB 13 RE',
    brand: 'Bosch',
    model: 'GSB 13 RE',
    category: 'Power Tools & Workshop Gear',
    price: 12500,
    originalPrice: 15000,
    image: [
      '/images/drill1.jpg',
      '/images/drill2.jpg',
      '/images/drill3.jpg'
    ],
    rating: 4.5,
    reviewCount: 23,
    availability: 'in-stock',
    stockQuantity: 15,
    warranty: '2 years',
    weight: '1.8 kg',
    dimensions: '25 x 8 x 20 cm',
    powerRating: '600W',
    voltage: '220-240V',
    features: [
      '13mm Chuck capacity',
      '600W high-performance motor',
      'Variable speed control',
      'Forward/reverse rotation',
      'Ergonomic design',
      'Professional grade quality'
    ],
    specifications: [
      { label: 'Chuck Capacity', value: '13mm' },
      { label: 'Power Input', value: '600W' },
      { label: 'No-load Speed', value: '0-2800 rpm' },
      { label: 'Impact Rate', value: '0-44800 bpm' },
      { label: 'Max Torque', value: '34 Nm' },
      { label: 'Weight', value: '1.8 kg' }
    ],
    description: `The Bosch Professional GSB 13 RE is a high-performance impact drill designed for professional use. 
    With its powerful 600W motor and robust construction, this drill is perfect for drilling in wood, metal, and masonry. 
    The variable speed control and forward/reverse rotation make it versatile for various applications.
    
    Built with Bosch's renowned quality and reliability, this drill features an ergonomic design for comfortable use 
    during extended work sessions. The 13mm chuck capacity allows for use with a wide range of drill bits and accessories.`,
    phone: '+254 700 000 000'
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProduct(mockProduct);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleAddToCart = () => {
    // Add to cart logic
    console.log(`Added ${quantity} of product ${product.id} to cart`);
  };

  const handleBuyNow = () => {
    // Buy now logic
    console.log(`Buy now: ${quantity} of product ${product.id}`);
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
              <div className="w-full h-96 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center">
                <ShoppingCart className="w-24 h-24 text-primary-400" />
              </div>
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex space-x-2">
              {product.image.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 rounded-lg border-2 ${
                    selectedImage === index
                      ? 'border-primary-500'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <Eye className="w-4 h-4 text-gray-400" />
                  </div>
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
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Heart className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>

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

              <div className="flex space-x-4 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Add to Cart
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-gray-900 text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  Buy Now
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
              {['description', 'specifications', 'reviews'].map((tab) => (
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

            {activeTab === 'reviews' && (
              <div className="text-center py-12">
                <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-500">Be the first to review this product</p>
                <button className="mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                  Write a Review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;


