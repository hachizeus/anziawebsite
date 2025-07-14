import { Home, DollarSign, Filter, Building, Hotel, Map } from '../utils/icons.jsx';
import { motion } from "framer-motion";

// Updated property categories and types
const propertyCategories = {
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

const purposeTypes = ["Buy", "Rent", "Lease", "Book"];
const priceRanges = [
  { min: 0, max: 5000000, label: "Under KSh 5M" },
  { min: 5000000, max: 10000000, label: "KSh 5M - KSh 10M" },
  { min: 10000000, max: 20000000, label: "KSh 10M - KSh 20M" },
  { min: 20000000, max: Number.MAX_SAFE_INTEGER, label: "Above KSh 20M" }
];

const FilterSection = ({ filters, setFilters, onApplyFilters }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (category) => {
    setFilters(prev => ({
      ...prev,
      category,
      propertyType: "" // Reset property type when category changes
    }));
  };

  const handleTypeChange = (type) => {
    setFilters(prev => ({
      ...prev,
      propertyType: type.toLowerCase().replace(/\s+/g, '-')
    }));
  };

  const handlePriceRangeChange = (min, max) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [min, max]
    }));
  };

  const handleReset = () => {
    setFilters({
      category: "",
      propertyType: "",
      priceRange: [0, Number.MAX_SAFE_INTEGER],
      bedrooms: "0",
      bathrooms: "0",
      purpose: "",
      searchQuery: "",
      sortBy: ""
    });
  };

  // Get the category icon
  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Residential': return <Home className="w-5 h-5" />;
      case 'Commercial': return <Building className="w-5 h-5" />;
      case 'Specialty': return <Hotel className="w-5 h-5" />;
      case 'Land & Agricultural': return <Map className="w-5 h-5" />;
      default: return <Home className="w-5 h-5" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="bg-white p-6 rounded-xl shadow-lg"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-primary-600" />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        <button
          onClick={handleReset}
          className="text-sm text-primary-600 hover:text-primary-700"
        >
          Reset All
        </button>
      </div>

      <div className="space-y-6">
        {/* Property Category */}
        <div className="filter-group">
          <label className="filter-label flex items-center font-medium text-gray-700 mb-2">
            <Home className="w-4 h-4 mr-2" />
            Property Category
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(propertyCategories).map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center
                  ${filters.category === category
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                <span className="mr-2">{getCategoryIcon(category)}</span>
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Property Type - Show only if category is selected */}
        {filters.category && (
          <div className="filter-group">
            <label className="filter-label flex items-center font-medium text-gray-700 mb-2">
              <Building className="w-4 h-4 mr-2" />
              Property Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {propertyCategories[filters.category].map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeChange(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${filters.propertyType === type.toLowerCase().replace(/\s+/g, '-')
                      ? "bg-primary-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Price Range */}
        <div className="filter-group">
          <label className="filter-label flex items-center font-medium text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 mr-2" />
            Price Range
          </label>
          <div className="grid grid-cols-2 gap-2">
            {priceRanges.map(({ min, max, label }) => (
              <button
                key={label}
                onClick={() => handlePriceRangeChange(min, max)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${filters.priceRange[0] === min && filters.priceRange[1] === max
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Property Purpose */}
        <div className="filter-group">
          <label className="filter-label flex items-center font-medium text-gray-700 mb-2">
            <Building className="w-4 h-4 mr-2" />
            Property Purpose
          </label>
          <div className="grid grid-cols-2 gap-2">
            {purposeTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilters(prev => ({ ...prev, purpose: type.toLowerCase() }))}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${filters.purpose === type.toLowerCase()
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        
        {/* Apply Filters Button */}
        <div className="flex space-x-4 mt-8">
          <button
            onClick={() => onApplyFilters(filters)}
            className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 
              transition-colors font-medium"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterSection;


