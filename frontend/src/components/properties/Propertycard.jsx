import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar } from '../utils/icons.jsx';
import PropTypes from 'prop-types';
import bookmarkIcon from '../../../public/images/32px-Bookmark-solid.png';

const PropertyCard = ({ property, viewType = 'grid' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);

  const isPropertyAvailable = property.availability === 'available' && property.paymentStatus !== 'paid';
  
  useEffect(() => {
    // Reset image state when property changes
    setImageLoaded(false);
    
    if (property.image && property.image.length > 0) {
      // Check if image exists by creating a new Image object
      const img = new Image();
      img.crossOrigin = "anonymous"; // Add CORS header
      
      img.onload = () => {
        setImageUrl(property.image[0]);
        setImageLoaded(true);
      };
      
      img.onerror = () => {
        // If ImageKit URL fails, use empty string to show fallback
        setImageUrl('');
        setImageLoaded(true);
      };
      
      // Start loading the image
      img.src = property.image[0];
    }
  }, [property]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="relative">
        <Link to={`/properties/single/${property._id}`}>
          {!imageLoaded ? (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Loading...</span>
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={property.title}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="absolute top-2 left-2">
            <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
              isPropertyAvailable 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {isPropertyAvailable ? 'Available' : 'Not Available'}
            </span>
          </div>
          {property.type && (
            <div className="absolute top-2 right-2">
              <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-primary-100 text-primary-800">
                {property.type}
              </span>
            </div>
          )}
          {property.purpose && (
            <div className="absolute bottom-2 right-2">
              <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                property.purpose === 'sale' ? 'bg-indigo-100 text-indigo-800' : 
                property.purpose === 'rent' ? 'bg-pink-100 text-pink-800' : 
                property.purpose === 'lease' ? 'bg-amber-100 text-amber-800' : 
                'bg-cyan-100 text-cyan-800'
              }`}>
                {property.purpose === 'sale' ? 'For Sale' :
                 property.purpose === 'rent' ? 'For Rent' :
                 property.purpose === 'lease' ? 'For Lease' :
                 'For Booking'}
              </span>
            </div>
          )}
        </Link>
      </div>
      
      <div className="p-4">
        <Link to={`/properties/single/${property._id}`}>
          <h3 className="text-lg font-bold text-gray-900 mb-1 hover:text-primary-600">
            {property.title}
          </h3>
        </Link>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          <p className="text-xl font-bold text-primary-600">
            KSh {property.price?.toLocaleString() || '0'}
          </p>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 9V5c0-1.1.9-2 2-2h16a2 2 0 0 1 2 2v4"></path>
              <path d="M2 11v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-9"></path>
              <path d="M2 12h20"></path>
              <path d="M7 12v5"></path>
              <path d="M17 12v5"></path>
            </svg>
            <span className="text-sm text-gray-700">
              {property.beds} {property.beds !== 1 ? 'Beds' : 'Bed'}
            </span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"></path>
              <line x1="10" y1="6" x2="20" y2="6"></line>
              <line x1="10" y1="10" x2="20" y2="10"></line>
              <line x1="10" y1="14" x2="20" y2="14"></line>
              <rect x="2" y="14" width="6" height="6" rx="1"></rect>
            </svg>
            <span className="text-sm text-gray-700">
              {property.baths} {property.baths !== 1 ? 'Baths' : 'Bath'}
            </span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h6v6"></path>
              <path d="M9 21H3v-6"></path>
              <path d="m21 3-9 9"></path>
              <path d="m3 21 9-9"></path>
            </svg>
            <span className="text-sm text-gray-700">
              {property.sqft?.toLocaleString() || '0'} sqft
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between border-t pt-3">
          <div className="flex items-center text-gray-500 text-xs">
            <Calendar className="w-3 h-3 mr-1" />
            <span>Listed {formatDate(property.createdAt)}</span>
          </div>
          
          <Link 
            to={`/properties/single/${property._id}`}
            className="px-3 py-1 bg-primary-600 text-white text-sm font-medium rounded hover:bg-primary-700"
          >
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

PropertyCard.propTypes = {
  property: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number,
    location: PropTypes.string,
    description: PropTypes.string,
    beds: PropTypes.number,
    baths: PropTypes.number,
    sqft: PropTypes.number,
    type: PropTypes.string,
    category: PropTypes.string,
    availability: PropTypes.string,
    paymentStatus: PropTypes.string,
    image: PropTypes.arrayOf(PropTypes.string),
    createdAt: PropTypes.string,
  }).isRequired,
  viewType: PropTypes.oneOf(['grid', 'list']),
};

export default PropertyCard;


