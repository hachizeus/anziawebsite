/**
 * Lazy Loading Utility
 * 
 * This utility provides functions to lazy load components and resources
 * for better performance.
 */

import { lazy, Suspense } from 'react';

/**
 * Creates a lazy-loaded component with a fallback
 * @param {Function} importFunc - Dynamic import function
 * @param {JSX.Element} fallback - Fallback component to show while loading
 * @returns {JSX.Element} Lazy-loaded component
 */
export const lazyLoadComponent = (importFunc, fallback) => {
  const LazyComponent = lazy(importFunc);
  
  return (props) => (
    <Suspense fallback={fallback || <div className="loading">Loading...</div>}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

/**
 * Lazy loads an image
 * @param {string} src - Image source URL
 * @param {string} alt - Image alt text
 * @param {string} className - CSS class name
 * @param {Object} props - Additional props
 * @returns {JSX.Element} Image element
 */
export const LazyImage = ({ src, alt, className = '', ...props }) => {
  return (
    <img 
      src={src} 
      alt={alt} 
      loading="lazy" 
      className={`lazy-image ${className}`} 
      {...props} 
    />
  );
};

/**
 * Preloads critical resources
 * @param {Array} resources - Array of resource URLs to preload
 */
export const preloadCriticalResources = (resources = []) => {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.url;
    link.as = resource.type || 'image';
    if (resource.type === 'font') {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  });
};

/**
 * Lazy loads routes for code splitting
 */
export const lazyRoutes = {
  Home: lazy(() => import('../pages/Home')),
  About: lazy(() => import('../pages/About')),
  Properties: lazy(() => import('../pages/Properties')),
  Contact: lazy(() => import('../pages/Contact')),
  Blog: lazy(() => import('../pages/Blog')),
  Aiagent: lazy(() => import('../pages/Aiagent')),
  Dashboard: lazy(() => import('../pages/Dashboard')),
  Documents: lazy(() => import('../pages/Documents')),
  Services: lazy(() => import('../pages/Services')),
  Tenants: lazy(() => import('../pages/Tenants')),
  UserProfile: lazy(() => import('../pages/UserProfile')),
  AdminDashboard: lazy(() => import('../pages/AdminDashboard')),
};

export default {
  lazyLoadComponent,
  LazyImage,
  preloadCriticalResources,
  lazyRoutes,
};

