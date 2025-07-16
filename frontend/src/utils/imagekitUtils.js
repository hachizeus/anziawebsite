import { getImageKitAuth } from '../services/api';

/**
 * Initialize ImageKit SDK for frontend uploads
 * @returns {Promise<Object>} ImageKit authentication parameters
 */
export const initializeImageKit = async () => {
  try {
    const { success, authParams } = await getImageKitAuth();
    
    if (!success || !authParams) {
      throw new Error('Failed to get ImageKit authentication parameters');
    }
    
    return {
      publicKey: authParams.publicKey,
      urlEndpoint: authParams.urlEndpoint,
      authenticationEndpoint: authParams.authenticationEndpoint,
      signature: authParams.signature,
      token: authParams.token,
      expire: authParams.expire,
      timestamp: authParams.timestamp
    };
  } catch (error) {
    console.error('Error initializing ImageKit:', error);
    throw error;
  }
};

/**
 * Generate optimized ImageKit URL with transformations
 * @param {string} originalUrl - Original ImageKit URL
 * @param {Object} options - Transformation options
 * @returns {string} Transformed URL
 */
export const getOptimizedImageUrl = (originalUrl, options = {}) => {
  if (!originalUrl || !originalUrl.includes('ik.imagekit.io')) {
    return originalUrl;
  }
  
  const {
    width,
    height,
    quality = 80,
    format = 'auto',
    blur = 0,
    crop = null
  } = options;
  
  // Build transformation string
  const transformations = [];
  
  if (width) transformations.push(`w-${width}`);
  if (height) transformations.push(`h-${height}`);
  if (quality) transformations.push(`q-${quality}`);
  if (format) transformations.push(`f-${format}`);
  if (blur > 0) transformations.push(`bl-${blur}`);
  if (crop) transformations.push(`c-${crop}`);
  
  // Insert transformations into URL
  if (transformations.length > 0) {
    const transformString = transformations.join(',');
    
    // Check if URL already has transformations
    if (originalUrl.includes('/tr:')) {
      return originalUrl.replace(/\/tr:[^/]+/, `/tr:${transformString}`);
    } else {
      // Find the position after the domain and insert transformations
      const domainEnd = originalUrl.indexOf('/', 8); // Skip https://
      if (domainEnd !== -1) {
        return `${originalUrl.substring(0, domainEnd)}/tr:${transformString}${originalUrl.substring(domainEnd)}`;
      }
    }
  }
  
  return originalUrl;
};

/**
 * Get responsive image URLs for different screen sizes
 * @param {string} originalUrl - Original ImageKit URL
 * @returns {Object} Object with different sized image URLs
 */
export const getResponsiveImageUrls = (originalUrl) => {
  if (!originalUrl || !originalUrl.includes('ik.imagekit.io')) {
    return {
      small: originalUrl,
      medium: originalUrl,
      large: originalUrl
    };
  }
  
  return {
    small: getOptimizedImageUrl(originalUrl, { width: 400, quality: 70 }),
    medium: getOptimizedImageUrl(originalUrl, { width: 800, quality: 80 }),
    large: getOptimizedImageUrl(originalUrl, { width: 1200, quality: 85 })
  };
};

/**
 * Generate a placeholder blur URL for lazy loading
 * @param {string} originalUrl - Original ImageKit URL
 * @returns {string} Low quality placeholder URL
 */
export const getPlaceholderUrl = (originalUrl) => {
  if (!originalUrl || !originalUrl.includes('ik.imagekit.io')) {
    return originalUrl;
  }
  
  return getOptimizedImageUrl(originalUrl, {
    width: 20,
    quality: 20,
    blur: 5
  });
};

export default {
  initializeImageKit,
  getOptimizedImageUrl,
  getResponsiveImageUrls,
  getPlaceholderUrl
};