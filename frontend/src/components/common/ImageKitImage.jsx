import React, { useState } from 'react';
import { getOptimizedImageUrl } from '../../utils/imagekitUtils';

const ImageKitImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  lazy = true,
  quality = 80,
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  // Generate optimized image URL
  const optimizedSrc = src && src.includes('ik.imagekit.io') 
    ? getOptimizedImageUrl(src, { width, height, quality }) 
    : src;
  
  // Handle image load/error
  const handleLoad = () => setLoaded(true);
  const handleError = () => setError(true);
  
  if (!src || error) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{
          width: width ? `${width}px` : '100%',
          height: height ? `${height}px` : '100%'
        }}
        {...props}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" className="text-gray-400">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      </div>
    );
  }
  
  return (
    <img
      src={optimizedSrc}
      alt={alt || ''}
      loading={lazy ? 'lazy' : 'eager'}
      onLoad={handleLoad}
      onError={handleError}
      className={className}
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
        ...props.style
      }}
      {...props}
    />
  );
};

export default ImageKitImage;