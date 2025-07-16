/**
 * Utility for lazy loading images to improve performance
 */

// IntersectionObserver options
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

/**
 * Initialize lazy loading for images
 * This should be called after the component mounts
 */
export const initLazyLoading = () => {
  // Check if IntersectionObserver is supported
  if (!('IntersectionObserver' in window)) {
    // For browsers that don't support IntersectionObserver, load all images immediately
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
    return;
  }

  // Create observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  }, observerOptions);

  // Observe all images with data-src attribute
  const lazyImages = document.querySelectorAll('img[data-src]');
  lazyImages.forEach(img => {
    observer.observe(img);
  });
};

/**
 * LazyImage component props interface
 * @typedef {Object} LazyImageProps
 * @property {string} src - The image source URL
 * @property {string} alt - Alt text for the image
 * @property {string} [className] - Optional CSS class
 * @property {function} [onLoad] - Optional callback when image loads
 * @property {function} [onError] - Optional callback when image fails to load
 */

/**
 * Create a lazy-loaded image element
 * @param {LazyImageProps} props - The image properties
 * @returns {HTMLImageElement} - The image element
 */
export const createLazyImage = ({ src, alt, className = '', onLoad, onError }) => {
  const img = document.createElement('img');
  img.alt = alt;
  img.className = className;
  
  // Set a placeholder or low-quality image initially
  img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E';
  
  // Set the actual image URL as a data attribute
  img.dataset.src = src;
  
  // Add event listeners if provided
  if (onLoad) img.addEventListener('load', onLoad);
  if (onError) img.addEventListener('error', onError);
  
  return img;
};

export default initLazyLoading;