import React from 'react';
import PropTypes from 'prop-types';

/**
 * ResponsiveImage Component
 * 
 * A component that renders responsive images with proper srcSet and sizes
 * for optimal loading on different devices, especially mobile.
 */
const ResponsiveImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false,
}) => {
  // Extract file extension and base path
  const extension = src.split('.').pop();
  const basePath = src.substring(0, src.lastIndexOf('.'));
  
  // Generate WebP versions
  const webpSrc = extension.toLowerCase() === 'webp' ? src : `${basePath}.webp`;
  
  // Generate responsive image paths
  const generateSrcSet = (basePath, ext) => {
    return `
      ${basePath}-640.${ext} 640w,
      ${basePath}-1024.${ext} 1024w,
      ${basePath}.${ext} 1920w
    `;
  };

  return (
    <picture>
      {/* WebP format for modern browsers */}
      <source 
        type="image/webp"
        sizes={sizes}
        srcSet={generateSrcSet(basePath, 'webp')}
      />
      
      {/* Original format as fallback */}
      <source 
        type={`image/${extension}`}
        sizes={sizes}
        srcSet={generateSrcSet(basePath, extension)}
      />
      
      {/* Fallback image */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : loading}
        className={className}
        style={{
          aspectRatio: `${width} / ${height}`,
          objectFit: 'cover',
        }}
      />
    </picture>
  );
};

ResponsiveImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  className: PropTypes.string,
  loading: PropTypes.oneOf(['lazy', 'eager']),
  sizes: PropTypes.string,
  priority: PropTypes.bool,
};

export default ResponsiveImage;

