import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import ResponsiveImage from '../common/ResponsiveImage';

/**
 * OptimizedPropertyCard Component
 * 
 * A mobile-optimized version of the property card component
 * that uses responsive images for better performance.
 */
const OptimizedPropertyCard = ({
  property,
  className = '',
}) => {
  const {
    _id,
    title,
    price,
    location,
    bedrooms,
    bathrooms,
    area,
    images,
  } = property;

  // Get the first image or use a placeholder
  const imageUrl = images && images.length > 0 
    ? images[0] 
    : '';

  return (
    <div className={`property-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow ${className}`}>
      <Link to={`/properties/${_id}`} className="block">
        <div className="relative">
          {/* Use ResponsiveImage for better mobile performance */}
          <ResponsiveImage
            src={imageUrl}
            alt={title}
            width={400}
            height={300}
            className="w-full h-[200px] object-cover"
            loading="lazy"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute top-2 right-2 bg-primary-500 text-white px-2 py-1 rounded text-sm font-medium">
            ${price.toLocaleString()}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{title}</h3>
          <p className="text-gray-600 text-sm mb-2 truncate">{location}</p>
          
          <div className="flex justify-between text-sm text-gray-700">
            <div className="flex items-center">
              <span className="mr-1">🛏️</span>
              <span>{bedrooms} {bedrooms === 1 ? 'Bed' : 'Beds'}</span>
            </div>
            <div className="flex items-center">
              <span className="mr-1">🚿</span>
              <span>{bathrooms} {bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
            <div className="flex items-center">
              <span className="mr-1">📏</span>
              <span>{area} sq.ft</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

OptimizedPropertyCard.propTypes = {
  property: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    location: PropTypes.string.isRequired,
    bedrooms: PropTypes.number.isRequired,
    bathrooms: PropTypes.number.isRequired,
    area: PropTypes.number.isRequired,
    images: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  className: PropTypes.string,
};

export default OptimizedPropertyCard;

