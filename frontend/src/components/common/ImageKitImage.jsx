import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getOptimizedImageUrl } from '../../utils/imagekitUtils';

const ImageKitImage = ({ 
  src, 
  alt, 
  width = 400, 
  height = 300, 
  quality = 80, 
  className = '', 
  objectFit = 'cover',
  placeholder = true,
  lazyLoad = true
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  
  useEffect(() => {
    if (!src) {
      setError(true);
      setLoading(false);
      return;
    }
    
    // Get optimized image URL
    const optimizedUrl = getOptimizedImageUrl(src, width, height, quality);
    setImageSrc(optimizedUrl);
  }, [src, width, height, quality]);
  
  const handleLoad = () => {
    setLoading(false);
  };
  
  const handleError = () => {
    setError(true);
    setLoading(false);
  };
  
  // Placeholder styles
  const placeholderStyles = {
    backgroundColor: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%'
  };
  
  // Error placeholder
  const ErrorPlaceholder = () => (
    <div style={placeholderStyles} className={className}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className="text-gray-400"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
        <circle cx="8.5" cy="8.5" r="1.5"></circle>
        <polyline points="21 15 16 10 5 21"></polyline>
      </svg>
    </div>
  );
  
  // Loading placeholder
  const LoadingPlaceholder = () => (
    <div style={placeholderStyles} className={className}>
      <div className="animate-pulse bg-gray-200 w-full h-full"></div>
    </div>
  );
  
  if (error) {
    return <ErrorPlaceholder />;
  }
  
  return (
    <>
      {loading && placeholder && <LoadingPlaceholder />}
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} ${loading ? 'hidden' : ''}`}
        style={{ objectFit }}
        onLoad={handleLoad}
        onError={handleError}
        loading={lazyLoad ? 'lazy' : 'eager'}
        width={width}
        height={height}
      />
    </>
  );
};

ImageKitImage.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  quality: PropTypes.number,
  className: PropTypes.string,
  objectFit: PropTypes.string,
  placeholder: PropTypes.bool,
  lazyLoad: PropTypes.bool
};

export default ImageKitImage;
