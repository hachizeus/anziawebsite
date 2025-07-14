import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Search, Filter, MapPin, Bed, Bath, Home, ArrowUpDown } from '../utils/icons.jsx';
import { Link } from 'react-router-dom';
import BecomeAgentCTA from '../components/BecomeAgentCTA';

const ExplorePage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    purpose: '',
    minPrice: '',
    maxPrice: '',
    beds: '',
    baths: ''
  });
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/agents/explore/properties`);
      
      if (response.data.success) {
        // Only show properties that have an agentId (agent properties)
        // Make sure to check if agentId exists and is not null/undefined
        const agentProperties = response.data.properties.filter(property => {
          console.log('Property:', property.title, 'AgentId:', property.agentId);
          return property.agentId !== null && property.agentId !== undefined;
        });
        setProperties(agentProperties);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      type: '',
      purpose: '',
      minPrice: '',
      maxPrice: '',
      beds: '',
      baths: ''
    });
  };

  const filteredProperties = properties.filter(property => {
    // Search filter
    if (filters.search && !property.title.toLowerCase().includes(filters.search.toLowerCase()) && 
        !property.location.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    // Type filter
    if (filters.type && property.type !== filters.type) {
      return false;
    }
    
    // Purpose filter
    if (filters.purpose && property.purpose !== filters.purpose) {
      return false;
    }
    
    // Price range filter
    if (filters.minPrice && property.price < Number(filters.minPrice)) {
      return false;
    }
    if (filters.maxPrice && property.price > Number(filters.maxPrice)) {
      return false;
    }
    
    // Beds filter
    if (filters.beds && property.beds < Number(filters.beds)) {
      return false;
    }
    
    // Baths filter
    if (filters.baths && property.baths < Number(filters.baths)) {
      return false;
    }
    
    return true;
  });

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'newest':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <BecomeAgentCTA />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Explore Properties</h1>
            <p className="text-gray-600 mt-2">
              Browse properties from our trusted agents
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <button
              onClick={toggleFilters}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </button>
            
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by property name or location..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          
          {showFilters && (
            <div className="mt-4 p-6 bg-white rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type
                  </label>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Types</option>
                    <option value="Apartment">Apartment</option>
                    <option value="House">House</option>
                    <option value="Villa">Villa</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Land">Land</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Office">Office</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purpose
                  </label>
                  <select
                    name="purpose"
                    value={filters.purpose}
                    onChange={handleFilterChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="">All Purposes</option>
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                    <option value="lease">For Lease</option>
                    <option value="booking">For Booking</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Range
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      name="minPrice"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      placeholder="Min"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      placeholder="Max"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bedrooms
                    </label>
                    <select
                      name="beds"
                      value={filters.beds}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5+</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bathrooms
                    </label>
                    <select
                      name="baths"
                      value={filters.baths}
                      onChange={handleFilterChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 mr-4"
                >
                  Reset Filters
                </button>
                <button
                  onClick={toggleFilters}
                  className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Properties Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : sortedProperties.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No properties found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We couldn't find any properties matching your criteria. Try adjusting your filters or check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        )}
        
        {/* Results Count */}
        {!loading && sortedProperties.length > 0 && (
          <div className="mt-6 text-center text-gray-500">
            Showing {sortedProperties.length} of {properties.length} properties
          </div>
        )}
      </div>
    </div>
  );
};

const PropertyCard = ({ property }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const agentName = property.agentId?.userId?.name || 'Agent';

  return (
    <Link 
      to={`/explore/property/${property._id}`}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={property.image[0] || ''}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = '<div class="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500"><span class="text-lg font-bold">No Image</span></div>';
          }} 
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-0 right-0 bg-primary-600 text-white px-3 py-1 m-2 rounded-full text-sm font-medium">
          {property.type}
        </div>
        <div className="absolute top-0 left-0 bg-indigo-600 text-white px-3 py-1 m-2 rounded-full text-sm font-medium">
          {property.purpose === 'sale' ? 'For Sale' :
           property.purpose === 'rent' ? 'For Rent' :
           property.purpose === 'lease' ? 'For Lease' :
           'For Booking'}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{property.title}</h3>
        
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm line-clamp-1">{property.location}</span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-gray-700">
            <Bed className="w-4 h-4 mr-1" />
            <span className="text-sm">{property.beds} Beds</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Bath className="w-4 h-4 mr-1" />
            <span className="text-sm">{property.baths} Baths</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Home className="w-4 h-4 mr-1" />
            <span className="text-sm">{property.sqft} sqft</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="text-primary-600 font-bold">
            {formatPrice(property.price)}
          </div>
          <div className="text-sm text-gray-500">
            Listed by {agentName}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ExplorePage;


