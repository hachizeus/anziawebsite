/**
 * Image Optimization Utility
 * 
 * This utility provides functions to optimize images for better performance:
 * - Adds width and height attributes to prevent layout shifts
 * - Provides WebP format support with fallback
 * - Implements lazy loading for images below the fold
 */

// Standard image dimensions for common components
export const IMAGE_DIMENSIONS = {
  propertyCard: { width: 400, height: 300 },
  heroImage: { width: 1200, height: 600 },
  teamMember: { width: 300, height: 300 },
  blogThumbnail: { width: 600, height: 400 },
  logo: { width: 150, height: 50 },
  icon: { width: 32, height: 32 },
  testimonial: { width: 80, height: 80 },
};

/**
 * Optimized Image Component props generator
 * @param {string} src - Image source URL
 * @param {string} alt - Image alt text
 * @param {Object} dimensions - Width and height object
 * @param {boolean} lazy - Whether to lazy load the image
 * @param {string} className - Additional CSS classes
 * @returns {Object} Props for image element
 */
export const getImageProps = (src, alt, dimensions, lazy = true, className = '') => {
  return {
    src,
    alt,
    width: dimensions.width,
    height: dimensions.height,
    loading: lazy ? 'lazy' : 'eager',
    className,
    style: {
      aspectRatio: `${dimensions.width} / ${dimensions.height}`,
      objectFit: 'cover',
    },
  };
};

/**
 * Creates a picture element with WebP support
 * @param {string} src - Original image source
 * @param {string} alt - Image alt text
 * @param {Object} dimensions - Width and height object
 * @param {boolean} lazy - Whether to lazy load the image
 * @param {string} className - Additional CSS classes
 * @returns {JSX.Element} Picture element with WebP support
 */
export const OptimizedPicture = ({ src, alt, dimensions, lazy = true, className = '' }) => {
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
        {...getImageProps(src, alt, dimensions, lazy, className)}
        onError={(e) => {
          // Fallback if WebP is not supported or file doesn't exist
          e.target.onerror = null;
          e.target.src = src;
        }}
      />
    </picture>
  );
};

/**
 * Determines if an image should be lazy loaded based on its position
 * @param {string} position - Position of the image (hero, above-fold, below-fold)
 * @returns {boolean} Whether to lazy load the image
 */
export const shouldLazyLoad = (position) => {
  return position !== 'hero' && position !== 'above-fold';
};

export default {
  IMAGE_DIMENSIONS,
  getImageProps,
  OptimizedPicture,
  shouldLazyLoad,
};

