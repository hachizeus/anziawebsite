import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GoogleAnalytics = ({ measurementId }) => {
  const location = useLocation();

  useEffect(() => {
    // Load Google Analytics script
    const loadGoogleAnalytics = () => {
      // Check if the script is already loaded
      if (document.getElementById('google-analytics')) {
        return;
      }

      // Create script elements
      const gtagScript = document.createElement('script');
      gtagScript.async = true;
      gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      gtagScript.id = 'google-analytics';

      const dataLayerScript = document.createElement('script');
      dataLayerScript.innerHTML = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${measurementId}', { 'send_page_view': false });
      `;

      // Append scripts to document
      document.head.appendChild(gtagScript);
      document.head.appendChild(dataLayerScript);
    };

    loadGoogleAnalytics();

    // Track page views
    const trackPageView = () => {
      if (window.gtag) {
        window.gtag('config', measurementId, {
          page_path: location.pathname + location.search,
        });
      }
    };

    // Track initial page view
    trackPageView();

    // Track when location changes
    return () => {
      trackPageView();
    };
  }, [location, measurementId]);

  return null; // This component doesn't render anything
};

export default GoogleAnalytics;

