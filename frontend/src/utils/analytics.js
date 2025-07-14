/**
 * Utility functions for Google Analytics tracking
 */

/**
 * Track a custom event in Google Analytics
 * @param {string} eventName - Name of the event
 * @param {Object} eventParams - Additional parameters for the event
 */
export const trackEvent = (eventName, eventParams = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

/**
 * Track a page view in Google Analytics
 * @param {string} pagePath - Path of the page being viewed
 * @param {string} pageTitle - Title of the page being viewed
 */
export const trackPageView = (pagePath, pageTitle) => {
  if (window.gtag) {
    window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
      page_path: pagePath,
      page_title: pageTitle
    });
  }
};

/**
 * Track user engagement with properties
 * @param {string} propertyId - ID of the property
 * @param {string} propertyName - Name of the property
 * @param {string} action - Action performed (view, inquire, favorite)
 */
export const trackPropertyEngagement = (propertyId, propertyName, action) => {
  trackEvent('property_engagement', {
    property_id: propertyId,
    property_name: propertyName,
    action: action
  });
};

