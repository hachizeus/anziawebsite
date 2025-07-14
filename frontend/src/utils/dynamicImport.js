import React, { lazy, Suspense } from 'react';

/**
 * Creates a dynamically imported component with loading fallback
 * 
 * @param {Function} importFunc - Dynamic import function
 * @param {React.ReactNode} fallback - Loading fallback component
 * @returns {React.ComponentType} - Lazy-loaded component
 */
export const dynamicImport = (importFunc, fallback = null) => {
  const LazyComponent = lazy(importFunc);
  
  return (props) => (
    <Suspense fallback={fallback || <div className="loading-spinner">Loading...</div>}>
      <LazyComponent {...props} />
    </Suspense>
  );
};

/**
 * Preloads a component for faster rendering
 * 
 * @param {Function} importFunc - Dynamic import function
 */
export const preloadComponent = (importFunc) => {
  importFunc();
};

/**
 * Dynamically imported common components
 */
export const DynamicComponents = {
  // Home page components
  Hero: dynamicImport(() => import('../components/Hero')),
  Features: dynamicImport(() => import('../components/Features')),
  Services: dynamicImport(() => import('../components/Services')),
  Testimonial: dynamicImport(() => import('../components/testimonial')),
  Blog: dynamicImport(() => import('../components/Blog')),
  
  // Property components
  PropertyCard: dynamicImport(() => import('../components/properties/Propertycard')),
  PropertyDetail: dynamicImport(() => import('../components/properties/propertydetail')),
  FilterSection: dynamicImport(() => import('../components/properties/Filtersection')),
  
  // Form components
  ContactForm: dynamicImport(() => import('../components/contact/contactForm')),
  PropertyInquiryForm: dynamicImport(() => import('../components/forms/PropertyInquiryForm')),
  
  // User components
  Login: dynamicImport(() => import('../components/login')),
  Signup: dynamicImport(() => import('../components/signup')),
  UserDashboard: dynamicImport(() => import('../components/UserDashboard')),
};

export default {
  dynamicImport,
  preloadComponent,
  DynamicComponents,
};

