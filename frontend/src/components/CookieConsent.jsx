import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, Settings, Check } from '../utils/icons.jsx';

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Always required
    analytics: true,
    marketing: false,
    preferences: true
  });
  
  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookie-consent');
    const savedPreferences = localStorage.getItem('cookie-preferences');
    
    // Load saved preferences if they exist
    if (savedPreferences) {
      try {
        setCookiePreferences(JSON.parse(savedPreferences));
      } catch (e) {
        console.error('Error parsing cookie preferences:', e);
      }
    }
    
    // Only show if no choice has been made yet
    if (!cookieConsent) {
      // Small delay to not show immediately on page load
      const timer = setTimeout(() => {
        setShowConsent(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    localStorage.setItem('cookie-preferences', JSON.stringify(cookiePreferences));
    
    // Set expiration date for consent (6 months)
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 6);
    localStorage.setItem('cookie-consent-expiry', expirationDate.toISOString());
    
    setShowConsent(false);
    
    // Apply analytics if accepted
    if (cookiePreferences.analytics) {
      enableAnalytics();
    }
  };
  
  const handleDecline = () => {
    // Set all preferences to false except essential
    const declinedPreferences = {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    
    localStorage.setItem('cookie-consent', 'declined');
    localStorage.setItem('cookie-preferences', JSON.stringify(declinedPreferences));
    
    // Set expiration date for consent (6 months)
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 6);
    localStorage.setItem('cookie-consent-expiry', expirationDate.toISOString());
    
    setShowConsent(false);
    
    // Disable analytics
    disableAnalytics();
  };
  
  const handleClose = () => {
    setShowConsent(false);
  };
  
  const togglePreferences = () => {
    setShowPreferences(!showPreferences);
  };
  
  const handlePreferenceChange = (key) => {
    setCookiePreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const handleSavePreferences = () => {
    localStorage.setItem('cookie-consent', 'custom');
    localStorage.setItem('cookie-preferences', JSON.stringify(cookiePreferences));
    
    // Set expiration date for consent (6 months)
    const expirationDate = new Date();
    expirationDate.setMonth(expirationDate.getMonth() + 6);
    localStorage.setItem('cookie-consent-expiry', expirationDate.toISOString());
    
    setShowConsent(false);
    
    // Apply analytics if accepted
    if (cookiePreferences.analytics) {
      enableAnalytics();
    } else {
      disableAnalytics();
    }
  };
  
  // Helper functions for analytics
  const enableAnalytics = () => {
    // Enable Google Analytics or other tracking services
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  };
  
  const disableAnalytics = () => {
    // Disable Google Analytics or other tracking services
    if (window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
  };
  
  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
            <div className="p-4 md:p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="h-6 w-6 text-primary-500 mr-3 flex items-center justify-center">
                    🍪
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cookie Consent</h3>
                </div>
                <button 
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                  aria-label="Close cookie consent banner"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mt-4">
                <p className="text-gray-600 dark:text-gray-300">
                  We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                  By clicking "Accept All", you consent to our use of cookies as described in our Privacy Policy.
                </p>
                
                <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Shield className="h-4 w-4 mr-1.5 text-primary-500" />
                  <span>Your privacy choices are important to us</span>
                </div>
              </div>
              
              {showPreferences && (
                <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Cookie Preferences</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Essential Cookies</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Required for the website to function properly</p>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded text-xs font-medium text-gray-800 dark:text-gray-200">
                        Required
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Analytics Cookies</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Help us understand how visitors interact with our website</p>
                      </div>
                      <button 
                        onClick={() => handlePreferenceChange('analytics')}
                        className={`w-10 h-5 rounded-full flex items-center transition-colors duration-200 ease-in-out ${cookiePreferences.analytics ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <span 
                          className={`bg-white dark:bg-gray-200 w-4 h-4 rounded-full shadow transform transition-transform duration-200 ease-in-out ${cookiePreferences.analytics ? 'translate-x-5' : 'translate-x-1'}`}
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Preference Cookies</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Enable the website to remember your preferences</p>
                      </div>
                      <button 
                        onClick={() => handlePreferenceChange('preferences')}
                        className={`w-10 h-5 rounded-full flex items-center transition-colors duration-200 ease-in-out ${cookiePreferences.preferences ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <span 
                          className={`bg-white dark:bg-gray-200 w-4 h-4 rounded-full shadow transform transition-transform duration-200 ease-in-out ${cookiePreferences.preferences ? 'translate-x-5' : 'translate-x-1'}`}
                        />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Marketing Cookies</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Used to display relevant advertisements</p>
                      </div>
                      <button 
                        onClick={() => handlePreferenceChange('marketing')}
                        className={`w-10 h-5 rounded-full flex items-center transition-colors duration-200 ease-in-out ${cookiePreferences.marketing ? 'bg-primary-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <span 
                          className={`bg-white dark:bg-gray-200 w-4 h-4 rounded-full shadow transform transition-transform duration-200 ease-in-out ${cookiePreferences.marketing ? 'translate-x-5' : 'translate-x-1'}`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-5 sm:flex sm:items-center sm:justify-between">
                <div className="mt-3 sm:mt-0 flex space-x-4">
                  <a href="/policy-document" className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                    Privacy Policy
                  </a>
                  <a href="/policy-document" className="text-sm font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                    Terms of Service
                  </a>
                </div>
                <div className="mt-4 sm:mt-0 sm:flex sm:space-x-3">
                  {!showPreferences ? (
                    <>
                      <button
                        onClick={togglePreferences}
                        className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center"
                      >
                        <Settings className="h-4 w-4 mr-1.5" />
                        Customize
                      </button>
                      <button
                        onClick={handleDecline}
                        className="w-full mt-3 sm:mt-0 sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        Decline All
                      </button>
                      <button
                        onClick={handleAccept}
                        className="w-full mt-3 sm:mt-0 sm:w-auto px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center"
                      >
                        <Check className="h-4 w-4 mr-1.5" />
                        Accept All
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={togglePreferences}
                        className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleSavePreferences}
                        className="w-full mt-3 sm:mt-0 sm:w-auto px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center"
                      >
                        <Check className="h-4 w-4 mr-1.5" />
                        Save Preferences
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;


