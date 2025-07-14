import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Home } from '../utils/icons.jsx';
import SearchBar from "./Searchbar.jsx";
import EnhancedFilters from "./EnhancedFilters.jsx";
import PropertyCard from "./Propertycard.jsx";
import sliderHorizontalIcon from '../../../public/images/slider-horizontal-3.svg';
import gridIcon from '../../../public/images/16px-Grid_icon.png';
import listViewIcon from '../../../public/images/list-view-icon.svg';

const PropertiesPage = () => {
  const [viewState, setViewState] = useState({
    isGridView: true,
    showFilters: false,
    showMap: false,
  });

  const [propertyState, setPropertyState] = useState({
    properties: [],
    loading: true,
    error: null,
    selectedProperty: null,
  });

  const [filters, setFilters] = useState({
    propertyType: "",
    priceRange: [0, Number.MAX_SAFE_INTEGER],
    bedrooms: "0",
    bathrooms: "0",
    availability: "",
    searchQuery: "",
    sortBy: "",
  });

  const fetchProperties = async () => {
    try {
      setPropertyState((prev) => ({ ...prev, loading: true }));
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/products/list`);
      if (response.data.success) {
        // Only show admin properties - exclude any property that has an agentId
        const adminProperties = response.data.property.filter(property => {
          console.log('Properties page - Property:', property.title, 'AgentId:', property.agentId);
          return property.agentId === null || property.agentId === undefined;
        });
        
        setPropertyState((prev) => ({
          ...prev,
          properties: adminProperties,
          error: null,
          loading: false,
        }));
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      setPropertyState((prev) => ({
        ...prev,
        error: "Failed to fetch properties. Please try again later.",
        loading: false,
      }));
      console.error("Error fetching properties:", err);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const filteredProperties = useMemo(() => {
    return propertyState.properties
      .filter((property) => {
        const searchMatch = !filters.searchQuery || 
          [property.title, property.description, property.location]
            .some(field => field?.toLowerCase().includes(filters.searchQuery.toLowerCase()));

        const typeMatch = !filters.propertyType || 
          property.type?.toLowerCase() === filters.propertyType.toLowerCase();

        const priceMatch = property.price >= filters.priceRange[0] && 
          property.price <= filters.priceRange[1];

        const bedroomsMatch = !filters.bedrooms || filters.bedrooms === "0" || 
          property.beds >= parseInt(filters.bedrooms);

        const bathroomsMatch = !filters.bathrooms || filters.bathrooms === "0" || 
          property.baths >= parseInt(filters.bathrooms);

        const availabilityMatch = !filters.availability || 
          property.availability?.toLowerCase() === filters.availability.toLowerCase();

        return searchMatch && typeMatch && priceMatch && 
          bedroomsMatch && bathroomsMatch && availabilityMatch;
      })
      .sort((a, b) => {
        switch (filters.sortBy) {
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          case "newest":
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
          default:
            return 0;
        }
      });
  }, [propertyState.properties, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  if (propertyState.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center flex flex-col items-center"
        >
          <div className="relative mb-6">
            {/* Main loader animation */}
            <motion.div
              className="w-24 h-24 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center relative shadow-lg shadow-primary-500/30"
              animate={{ 
                rotate: [0, 0, 360, 360, 0],
                scale: [1, 0.9, 0.9, 1, 1],
                borderRadius: ["16%", "50%", "50%", "16%", "16%"]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Home className="w-12 h-12 text-white" />
            </motion.div>
            
            {/* Moving dots around the icon */}
            <motion.div 
              className="absolute w-3 h-3 bg-primary-300 rounded-full right-4 bottom-10"
              animate={{
                x: [0, 30, 0, -30, 0],
                y: [-30, 0, 30, 0, -30],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            
            <motion.div 
              className="absolute w-2 h-2 bg-primary-400 rounded-full"
              animate={{
                x: [0, -30, 0, 30, 0],
                y: [30, 0, -30, 0, 30],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            />
  
            {/* Background pulse effect */}
            <div className="absolute inset-0 bg-primary-500/10 rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
          </div>
          
          <h3 className="text-2xl font-bold text-gray-800 mb-3 bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
            Loading Properties
          </h3>
          
          <p className="text-gray-600 mb-5 max-w-xs text-center">
            {`We're finding the perfect homes that match your preferences...`}
          </p>
          
          {/* Progress bar with animated gradient */}
          <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden relative">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-600 via-primary-500 to-primary-600 bg-size-200 absolute top-0 left-0 right-0"
              animate={{ 
                backgroundPosition: ["0% center", "100% center", "0% center"] 
              }}
              style={{ backgroundSize: "200% 100%" }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>
          
          <div className="flex items-center mt-4 text-xs text-primary-600">
            <motion.div 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2"
            />
            <span>Please wait while we curate properties for you</span>
          </div>
        </motion.div>
      </div>
    );
  }

  if (propertyState.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-red-600 p-6 rounded-lg bg-red-50 max-w-md"
        >
          <p className="font-medium mb-4">{propertyState.error}</p>
          <button
            onClick={fetchProperties}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 
              transition-colors duration-200"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 pt-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your Perfect Property
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Discover a curated collection of premium properties
          </p>
        </motion.header>

        <div className="grid grid-cols-1 gap-8">
          <div className="flex flex-col lg:flex-row gap-8">
            <AnimatePresence mode="wait">
              {viewState.showFilters && (
                <motion.aside
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="w-full lg:w-1/4 lg:max-w-xs"
                >
                  <EnhancedFilters
                    filters={filters}
                    setFilters={setFilters}
                    onApplyFilters={handleFilterChange}
                  />
                </motion.aside>
              )}
            </AnimatePresence>

            <div className={`w-full ${viewState.showFilters ? "lg:w-3/4" : "w-full"}`}>
              <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="flex flex-col sm:flex-row items-stretch gap-4">
                  <div className="flex-grow">
                    <SearchBar
                      onSearch={(query) => setFilters(prev => ({ ...prev, searchQuery: query }))}
                      className="w-full"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2 justify-between sm:justify-end">
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        sortBy: e.target.value
                      }))}
                      className="px-3 py-2 border rounded-lg text-sm flex-shrink-0"
                    >
                      <option value="">Sort By</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                    </select>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewState(prev => ({
                          ...prev,
                          showFilters: !prev.showFilters
                        }))}
                        className="p-2 rounded-lg hover:bg-gray-100 flex-shrink-0"
                        title="Toggle Filters"
                      >
                        <img 
                          src={sliderHorizontalIcon} 
                          alt="Filters" 
                          className="w-5 h-5" 
                        />
                      </button>
                      <button
                        onClick={() => setViewState(prev => ({ ...prev, isGridView: true }))}
                        className={`p-2 rounded-lg flex-shrink-0 ${
                          viewState.isGridView ? "bg-primary-100 text-primary-600" : "hover:bg-gray-100"
                        }`}
                      >
                        <img 
                          src={gridIcon} 
                          alt="Grid View" 
                          className="w-5 h-5" 
                        />
                      </button>
                      <button
                        onClick={() => setViewState(prev => ({ ...prev, isGridView: false }))}
                        className={`p-2 rounded-lg flex-shrink-0 ${
                          !viewState.isGridView ? "bg-primary-100 text-primary-600" : "hover:bg-gray-100"
                        }`}
                      >
                        <img 
                          src={listViewIcon} 
                          alt="List View" 
                          className="w-5 h-5" 
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <motion.div
                layout
                className={`grid gap-6 ${
                  viewState.isGridView ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
                }`}
              >
                <AnimatePresence>
                  {filteredProperties.length > 0 ? (
                    filteredProperties.map((property) => (
                      <PropertyCard
                        key={property._id}
                        property={property}
                        viewType={viewState.isGridView ? "grid" : "list"}
                      />
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="col-span-full text-center py-12 bg-white rounded-lg shadow-sm"
                    >
                      <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No properties found
                      </h3>
                      <p className="text-gray-600">
                        Try adjusting your filters or search criteria
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertiesPage;


