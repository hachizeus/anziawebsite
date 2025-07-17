import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { testToken } from '../utils/tokenTest';

const Dashboard = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Test token storage
    testToken();
    
    // Redirect if not logged in or not a tenant
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    if (user && user.role !== 'tenant') {
      navigate('/');
      return;
    }

    const fetchTenantProperties = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        console.log('Dashboard fetching properties with token:', token ? token.substring(0, 20) + '...' : 'no token');
        
        const response = await axios.get(`https://anzia-electronics-api.onrender.com/api/tenants/user`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data.success) {
          // If the API returns a single property object
          if (response.data.property) {
            setProperties([response.data.property]);
          } 
          // If the API returns an array of properties
          else if (Array.isArray(response.data.properties)) {
            setProperties(response.data.properties);
          }
        } else {
          setError('Failed to fetch properties');
        }
      } catch (err) {
        console.error('Error fetching tenant properties:', err);
        
        // Check if it's an authentication error
        if (err.response && err.response.status === 401) {
          console.error('Authentication error - clearing token and redirecting to login');
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          navigate('/login');
          return;
        }
        
        setError('Error loading your properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTenantProperties();
  }, [isLoggedIn, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-red-500">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">My Properties</h1>
        
        {properties.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500">You do not have any properties assigned to you yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <div key={property._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {property.image && property.image.length > 0 && (
                  <img 
                    src={property.image[0]} 
                    alt={property.title} 
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{property.title}</h2>
                  <p className="text-gray-600 mb-4">{property.location}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Type</p>
                      <p className="font-medium">{property.type}</p>
                    </div>
                    
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="font-medium">${property.price?.toLocaleString()}</p>
                    </div>
                    
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Beds</p>
                      <p className="font-medium">{property.beds}</p>
                    </div>
                    
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500">Baths</p>
                      <p className="font-medium">{property.baths}</p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => navigate(`/properties/${property._id}`)}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

