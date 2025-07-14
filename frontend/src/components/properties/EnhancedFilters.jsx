import { useState } from "react";
import { Home, DollarSign, Filter, MapPin, Search } from '../utils/icons.jsx';
import { motion } from "framer-motion";

// Updated property types with categories
const PROPERTY_CATEGORIES = {
  'Residential': [
    'Single-family home',
    'Multi-family home',
    'Apartment',
    'Condominium',
    'Townhouse',
    'Airbnb'
  ],
  'Commercial': [
    'Office building',
    'Retail store',
    'Shopping center',
    'Mall',
    'Warehouse',
    'Industrial space'
  ],
  'Specialty': [
    'Hotel',
    'Resort',
    'Student housing',
    'Senior housing',
    'Assisted living',
    'Co-working space',
    'Event venue'
  ],
  'Land & Agricultural': [
    'Vacant lot',
    'Raw land',
    'Agricultural land',
    'Farm',
    'Ranch'
  ]
};

// Flatten property types for filter display
const propertyTypes = Object.values(PROPERTY_CATEGORIES).flat();

const availabilityTypes = ["Rent", "Buy", "Lease"];
const priceRanges = [
  { min: 0, max: 5000000, label: "Under KSh 5M" },
  { min: 5000000, max: 10000000, label: "KSh 5M - KSh 10M" },
  { min: 10000000, max: 20000000, label: "KSh 10M - KSh 20M" },
  { min: 20000000, max: Number.MAX_SAFE_INTEGER, label: "Above KSh 20M" }
];

const locations = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Kiambu"];

const EnhancedFilters = ({ filters, setFilters, onApplyFilters }) => {
  const [activeTab, setActiveTab] = useState("location");
  const [activeCategory, setActiveCategory] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePriceRangeChange = (min, max) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [min, max]
    }));
  };

  const handleLocationChange = (location) => {
    setFilters(prev => ({
      ...prev,
      location: location
    }));
  };

  const handleReset = () => {
    setFilters({
      propertyType: "",
      priceRange: [0, Number.MAX_SAFE_INTEGER],
      bedrooms: "0",
      bathrooms: "0",
      availability: "",
      searchQuery: "",
      location: "",
      sortBy: ""
    });
    setActiveCategory(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      {/* Filter Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab("location")}
          className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 ${
            activeTab === "location" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
          }`}
        >
          <MapPin className="w-4 h-4" />
          Location
        </button>
        <button
          onClick={() => setActiveTab("type")}
          className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 ${
            activeTab === "type" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
          }`}
        >
          <Home className="w-4 h-4" />
          Property Type
        </button>
        <button
          onClick={() => setActiveTab("price")}
          className={`flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 ${
            activeTab === "price" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-600"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Price Range
        </button>
      </div>

      {/* Filter Content */}
      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          <button
            onClick={handleReset}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Reset All
          </button>
        </div>

        {/* Location Tab */}
        {activeTab === "location" && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search location..."
                value={filters.searchQuery || ""}
                onChange={(e) => handleChange({
                  target: { name: "searchQuery", value: e.target.value }
                })}
                className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {locations.map((location) => (
                <button
                  key={location}
                  onClick={() => handleLocationChange(location)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${filters.location === location
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Property Type Tab */}
        {activeTab === "type" && (
          <div className="space-y-4">
            {/* Category buttons */}
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.keys(PROPERTY_CATEGORIES).map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(activeCategory === category ? null : category)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                    ${activeCategory === category
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            {/* Property types */}
            <div className="max-h-60 overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-2">
                {(activeCategory 
                  ? PROPERTY_CATEGORIES[activeCategory] 
                  : propertyTypes).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleChange({
                      target: { name: "propertyType", value: type }
                    })}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all
                      ${filters.propertyType === type
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Availability</h3>
              <div className="grid grid-cols-3 gap-2">
                {availabilityTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => handleChange({
                      target: { name: "availability", value: type.toLowerCase() }
                    })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                      ${filters.availability === type.toLowerCase()
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Price Range Tab */}
        {activeTab === "price" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {priceRanges.map(({ min, max, label }) => (
                <button
                  key={label}
                  onClick={() => handlePriceRangeChange(min, max)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${filters.priceRange[0] === min && filters.priceRange[1] === max
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  {label}
                </button>
              ))}
            </div>
            
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Bedrooms</h3>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, "5+"].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleChange({
                      target: { name: "bedrooms", value: num.toString() }
                    })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                      ${filters.bedrooms === num.toString()
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex space-x-4 mt-6">
          <button
            onClick={() => onApplyFilters(filters)}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 
              transition-colors font-medium"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EnhancedFilters;


