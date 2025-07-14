import React from 'react';
import PropTypes from 'prop-types';
import { IMAGE_DIMENSIONS, shouldLazyLoad } from '../../utils/imageOptimizer';

/**
 * OptimizedImage Component
 * 
 * A component that renders images with proper width/height attributes,
 * WebP support, and lazy loading for better performance.
 */
const OptimizedImage = ({
  src,
  alt,
  type = 'default',
  position = 'below-fold',
  className = '',
  customDimensions = null,
}) => {
  // Get dimensions based on type or use custom dimensions
  const dimensions = customDimensions || IMAGE_DIMENSIONS[type] || { width: 300, height: 200 };
  
  // Determine if image should be lazy loaded
  const lazy = shouldLazyLoad(position);
  
  // Extract file extension and base path
  const extension = src.split('.').pop();
  const basePath = src.substring(0, src.lastIndexOf('.'));
  
  // Only create webp version if not already webp
  const webpSrc = extension.toLowerCase() === 'webp' ? src : `${basePath}.webp`;
  
  return (
    <picture>
      <source srcSet={webpSrc} type="image/webp" />
      <source srcSet={src} type={`image/${extension}`} />
      <img 
        src={src}
        alt={alt}
        width={dimensions.width}
        height={dimensions.height}
        loading={lazy ? 'lazy' : 'eager'}
        className={className}
        style={{
          aspectRatio: `${dimensions.width} / ${dimensions.height}`,
          objectFit: 'cover',
        }}
        onError={(e) => {
          // Fallback if WebP is not supported or file doesn't exist
          e.target.onerror = null;
          e.target.src = src;
        }}
      />
    </picture>
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  type: PropTypes.oneOf([
    'default',
    'propertyCard',
    'heroImage',
    'teamMember',
    'blogThumbnail',
    'logo',
    'icon',
    'testimonial',
  ]),
  position: PropTypes.oneOf(['hero', 'above-fold', 'below-fold']),
  className: PropTypes.string,
  customDimensions: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }),
};

export default OptimizedImage;

