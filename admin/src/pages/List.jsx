import { useState, useEffect, useCallback } from "react";
import { 
  Trash2, 
  Edit3, 
  Search, 
  Filter, 
  Plus, 
  Home,
  BedDouble,
  Bath,
  Maximize,
  MapPin,
  Building,
  Loader,
  Eye
} from "lucide-react";
import BanknoteIcon from '../components/BanknoteIcon';
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { backendurl } from "../App";

const ProductListings = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const parseFeatures = (features) => {
    if (!features) return [];
    if (Array.isArray(features)) return features;
    
    try {
      return JSON.parse(features);
    } catch (error) {
      console.error("Error parsing features:", error);
      return [];
    }
  };

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendurl}/api/legacy-products/list`);
      if (response.data.success) {
        const parsedProducts = response.data.products.map(product => ({
          ...product,
          features: parseFeatures(product.features)
        }));
        setProducts(parsedProducts);
      } else {
        toast.error(response.data.error);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  }, [backendurl]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  // ^^^^ ESLint warning will be resolved

  const handleRemoveProduct = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to remove "${productName}"?`)) {
      try {
        const response = await axios.delete(`${backendurl}/api/legacy-products/remove/${productId}`);

        if (response.data.success) {
          toast.success("Product removed successfully");
          await fetchProducts();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error removing product:", error);
        toast.error("Failed to remove product");
      }
    }
  };
  
  const handleToggleAvailability = async (productId) => {
    try {
      console.log('Toggling availability for product:', productId);
      const response = await axios.post(
        `${backendurl}/api/legacy-products/toggle-availability`, 
        { productId }
      );

      if (response.data.success) {
        const newStatus = response.data.product.availability;
        toast.success(`Product availability updated to ${newStatus.replace('-', ' ')}`);
        await fetchProducts();
      } else {
        toast.error(response.data.message || 'Failed to update availability');
      }
    } catch (error) {
      console.error("Error toggling product availability:", error);
      toast.error("Failed to update product availability");
    }
  };

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = !searchTerm || 
        [product.name, product.brand, product.category]
          .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = filterCategory === "all" || product.category === filterCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 sm:pt-20 md:pt-24 px-3 sm:px-4 md:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              Product Listings
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              {filteredProducts.length} Products Found
            </p>
          </div>

          <Link 
            to="/add"
            className="inline-flex items-center px-3 sm:px-4 py-2 sm:py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto justify-center text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            <span className="sm:hidden">Add Product</span>
            <span className="hidden sm:inline">Add New Product</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm mb-4 sm:mb-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-primary-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex items-center gap-2 flex-1">
                <Filter className="text-gray-400 w-4 h-4 flex-shrink-0" />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 w-full text-sm sm:text-base"
                >
                  <option value="all">All Categories</option>
                  <option value="Power Tools & Workshop Gear">Power Tools</option>
                  <option value="Generators & Power Equipment">Generators</option>
                  <option value="Electronics & Appliances">Electronics</option>
                </select>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 flex-1 sm:flex-none sm:min-w-[180px] text-sm sm:text-base"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                key={product._id || product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                {/* Product Image */}
                <div className="relative h-48">
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={product.images[0].url || product.images[0]}
                      alt={product.images[0].alt || product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-primary-600 text-white text-sm font-medium rounded-full">
                      {product.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Link 
                      to={`/update/${product._id}`}
                      className="p-2 bg-white/90 backdrop-blur-sm text-primary-600 rounded-full hover:bg-primary-600 hover:text-white transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleToggleAvailability(product._id)}
                      className={`p-2 bg-white/90 backdrop-blur-sm ${
                        product.availability === 'in-stock' 
                          ? 'text-green-600 hover:bg-green-600' 
                          : 'text-orange-600 hover:bg-orange-600'
                      } rounded-full hover:text-white transition-all`}
                      title={product.availability === 'in-stock' ? 'Mark as out of stock' : 'Mark as in stock'}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveProduct(product._id, product.name)}
                      className="p-2 bg-white/90 backdrop-blur-sm text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Product Details */}
                <div className="p-6">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h2>
                    <div className="flex items-center text-gray-600">
                      <Building className="w-4 h-4 mr-2" />
                      {product.brand}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <BanknoteIcon className="w-5 h-5 mr-2 text-primary-600" />
                      <p className="text-2xl font-bold text-primary-600">
                        KSh {product.price?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        product.availability === 'in-stock' 
                          ? 'bg-green-100 text-green-800' 
                          : product.availability === 'out-of-stock'
                            ? 'bg-red-100 text-red-800'
                            : product.availability === 'pre-order'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-orange-100 text-orange-800'
                      }`}>
                        {product.availability?.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Unknown'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        product.condition === 'new' ? 'bg-green-100 text-green-800' : 
                        product.condition === 'refurbished' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {product.condition?.charAt(0).toUpperCase() + product.condition?.slice(1) || 'New'}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.description}
                    </p>
                  </div>

                  {/* Features */}
                  {product.features && product.features.length > 0 && (
                    <div className="border-t pt-4">
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Features</h3>
                      <div className="flex flex-wrap gap-2">
                        {product.features.slice(0, 3).map((feature, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 bg-primary-100 text-primary-600 text-xs rounded"
                          >
                            {feature}
                          </span>
                        ))}
                        {product.features.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{product.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white rounded-lg shadow-sm"
          >
            <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filters
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ProductListings;