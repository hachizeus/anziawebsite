import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import {
  Home,
  MapPin,
  Tag,
  AlertCircle,
  Loader
} from 'lucide-react';
import { backendurl } from '../../App';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const PropertyAnalytics = () => {
  const [propertyData, setPropertyData] = useState({
    statusDistribution: [],
    typeDistribution: [],
    locationDistribution: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Fetch properties data
        const propertiesResponse = await axios.get(`${backendurl}/api/products/list`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const properties = propertiesResponse.data.property || [];
        console.log("Properties data:", properties);
        
        // Calculate status distribution
        const statusCounts = properties.reduce((acc, property) => {
          const status = property.availability || 'Not Specified';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
        
        const statusDistribution = Object.entries(statusCounts).map(([_id, count]) => ({ _id, count }));
        
        // Calculate type distribution
        const typeCounts = properties.reduce((acc, property) => {
          const type = property.type || 'Not Specified';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});
        
        const typeDistribution = Object.entries(typeCounts).map(([_id, count]) => ({ _id, count }));
        
        // Calculate location distribution
        const locationCounts = properties.reduce((acc, property) => {
          // Check for location in different possible formats
          let location = 'Not Specified';
          
          if (property.location) {
            if (typeof property.location === 'string') {
              location = property.location;
            } else if (property.location.city) {
              location = property.location.city;
            } else if (property.location.address) {
              location = property.location.address;
            }
          }
          
          acc[location] = (acc[location] || 0) + 1;
          return acc;
        }, {});
        
        const locationDistribution = Object.entries(locationCounts)
          .map(([_id, count]) => ({ _id, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);
        
        setPropertyData({
          statusDistribution,
          typeDistribution,
          locationDistribution
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching property data:', error);
        setError(error.response?.data?.message || 'Failed to fetch property data');
        setLoading(false);
      }
    };
    
    fetchPropertyData();
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading property analytics...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Property Analytics
          </h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
              transition-colors duration-200 flex items-center gap-2 mx-auto"
          >
            <Home className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  // Format labels to capitalize first letter and replace underscores with spaces
  const formatLabel = (label) => {
    if (label === 'Not Specified') return label;
    return label
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Prepare chart data for status distribution
  const statusData = {
    labels: propertyData.statusDistribution.map(item => formatLabel(item._id)),
    datasets: [
      {
        data: propertyData.statusDistribution.map(item => item.count),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  // Prepare chart data for type distribution
  const typeData = {
    labels: propertyData.typeDistribution.map(item => formatLabel(item._id)),
    datasets: [
      {
        data: propertyData.typeDistribution.map(item => item.count),
        backgroundColor: [
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)'
        ],
        borderWidth: 1
      }
    ]
  };
  
  // Prepare chart data for location distribution
  const locationData = {
    labels: propertyData.locationDistribution.map(item => formatLabel(item._id)),
    datasets: [
      {
        label: 'Properties by Location',
        data: propertyData.locationDistribution.map(item => item.count),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderWidth: 1
      }
    ]
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen pt-20 sm:pt-24 md:pt-32 px-2 sm:px-4 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Property Analytics</h1>
            <p className="text-gray-600">Insights into your property portfolio</p>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
              transition-colors duration-200 flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Refresh Data
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <Home className="w-5 h-5 text-blue-500" />
              Property Status Distribution
            </h2>
            <div className="h-[300px] sm:h-[400px]">
              {propertyData.statusDistribution.length > 0 ? (
                <Pie 
                  data={statusData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right'
                      }
                    }
                  }} 
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No status data available</p>
                </div>
              )}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <Tag className="w-5 h-5 text-purple-500" />
              Property Type Distribution
            </h2>
            <div className="h-[300px] sm:h-[400px]">
              {propertyData.typeDistribution.length > 0 ? (
                <Doughnut 
                  data={typeData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right'
                      }
                    }
                  }} 
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No property type data available</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 sm:p-6 rounded-lg shadow-lg mb-8"
        >
          <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-500" />
            Properties by Location
          </h2>
          <div className="h-[300px]">
            {propertyData.locationDistribution.length > 0 ? (
              <Bar 
                data={locationData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    }
                  },
                  scales: {
                    x: {
                      ticks: {
                        maxRotation: 45,
                        minRotation: 45
                      }
                    }
                  }
                }} 
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">No location data available</p>
              </div>
            )}
          </div>
        </motion.div>
        
        {propertyData.locationDistribution.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg mb-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Popular Locations</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property Count
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {propertyData.locationDistribution.map((location, index) => (
                    <tr key={location._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatLabel(location._id)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {location.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default PropertyAnalytics;