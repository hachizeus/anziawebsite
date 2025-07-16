import { useState, useEffect } from 'react';
import axios from 'axios';
import apiConfig from '../utils/apiConfig';

const ApiHealthCheck = () => {
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('');
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        // Use relative URL for API health check
        const baseUrl = '';
        // Start with the most likely working endpoint
        const endpoints = ['/api/products/list'];
        
        console.log('Checking API health at:', baseUrl);
        
        let connected = false;
        
        for (const endpoint of endpoints) {
          try {
            const response = await axios.get(`${baseUrl}${endpoint}`, {
              timeout: 8000,
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              }
            });
            
            if (response.status === 200) {
              setStatus('connected');
              setMessage(`API connected via ${endpoint} (${apiConfig.getCurrentEnvironment()})`);
              connected = true;
              
              // Store the working URL in session storage
              sessionStorage.setItem('workingApiUrl', baseUrl);
              sessionStorage.setItem('workingApiEndpoint', endpoint);
              sessionStorage.setItem('apiEnvironment', apiConfig.getCurrentEnvironment());
              
              // Hide after 5 seconds if connected
              setTimeout(() => setVisible(false), 5000);
              break;
            }
          } catch (endpointErr) {
            console.log(`Endpoint ${endpoint} failed:`, endpointErr.message);
            // Continue to next endpoint
          }
        }
        
        if (!connected) {
          setStatus('error');
          setMessage('All API endpoints failed');
        }
      } catch (err) {
        console.error('API health check failed:', err);
        setStatus('error');
        
        setMessage(err.code === 'ECONNABORTED' 
          ? 'API connection timed out' 
          : `API connection error: ${err.message}`);
      }
    };

    checkApiHealth();
  }, []);

  if (!visible) return null;

  return (
    <div className={`fixed bottom-4 left-4 z-50 p-3 rounded-lg shadow-lg max-w-xs ${
      status === 'checking' ? 'bg-yellow-50 border border-yellow-200' :
      status === 'connected' ? 'bg-green-50 border border-green-200' :
      'bg-red-50 border border-red-200'
    }`}>
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full mr-2 ${
          status === 'checking' ? 'bg-yellow-500 animate-pulse' :
          status === 'connected' ? 'bg-green-500' :
          'bg-red-500'
        }`}></div>
        <div>
          <p className={`text-sm font-medium ${
            status === 'checking' ? 'text-yellow-700' :
            status === 'connected' ? 'text-green-700' :
            'text-red-700'
          }`}>
            {status === 'checking' ? 'Connecting to API...' :
             status === 'connected' ? 'API Connected' :
             'API Connection Issue'}
          </p>
          {message && <p className="text-xs mt-0.5 text-gray-600">{message}</p>}
        </div>
        <button 
          onClick={() => setVisible(false)}
          className="ml-auto text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ApiHealthCheck;

