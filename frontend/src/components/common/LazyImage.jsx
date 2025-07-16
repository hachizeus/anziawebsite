import { useState, useEffect, useRef } from 'react';

/**
 * LazyImage component for performance optimization
 * Only loads images when they are about to enter the viewport
 */
const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholderClassName = 'bg-gray-200 animate-pulse',
  width,
  height,
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    // Skip if image is already loaded or no ref
    if (isLoaded || !imgRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When image comes into view
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // Start loading when image is 200px from viewport
        threshold: 0.01
      }
    );
    
    observer.observe(imgRef.current);
    
    return () => {
      if (imgRef.current) {
        observer.disconnect();
      }
    };
  }, [isLoaded]);

  const handleImageLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleImageError = (e) => {
    console.error('Image failed to load:', src);
    if (onError) onError(e);
  };

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
      ref={imgRef}
    >
      {/* Placeholder */}
      {!isLoaded && (
        <div 
          className={`absolute inset-0 ${placeholderClassName}`}
          style={{ width, height }}
        />
      )}
      
      {/* Actual image */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          style={{ width, height }}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
    </div>
  );
};

export default LazyImage;