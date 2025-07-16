import { useState, useEffect } from 'react';
import apiConfig from '../utils/apiConfig';

/**
 * Component that shows the current backend environment (Netlify only)
 */
const BackendSwitcher = () => {
  const [environment, setEnvironment] = useState('netlify');
  
  // Update the UI when environment changes
  useEffect(() => {
    // Force Netlify environment
    apiConfig.useNetlifyBackend();
    setEnvironment('netlify');
  }, []);
  
  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-3 z-50">
      <div className="text-sm font-medium mb-2">Backend Environment</div>
      <div className="flex space-x-2">
        <button
          className="px-3 py-1 rounded text-xs bg-blue-600 text-white"
        >
          Netlify
        </button>
      </div>
      <div className="text-xs mt-2 text-gray-500">
        Using Netlify backend
      </div>
    </div>
  );
};

export default BackendSwitcher;