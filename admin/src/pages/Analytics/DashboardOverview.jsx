import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Home,
  DollarSign,
  TrendingUp,
  MapPin,
  AlertCircle,
  Loader
} from 'lucide-react';
import { backendurl } from '../../App';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalProperties: 0,
    propertiesByStatus: {},
    totalEarnings: 0,
    monthlyEarnings: [],
    popularLocations: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Fetch properties data
        const propertiesResponse = await axios.get(`${backendurl}/api/products/list`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Process properties data
        const properties = propertiesResponse.data.property || [];
        const totalProperties = properties.length;
        
        // Calculate properties by status
        const propertiesByStatus = properties.reduce((acc, property) => {
          const status = property.availability || 'Not Specified';
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
        
        // Calculate popular locations
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
        
        const popularLocations = Object.entries(locationCounts)
          .map(([_id, count]) => ({ _id, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5);
        
        // Fetch tenants data for earnings estimation
        const tenantsResponse = await axios.get(`${backendurl}/api/tenants`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const tenants = tenantsResponse.data.tenants || [];
        
        // Calculate total earnings (estimated from rent amounts)
        const totalEarnings = tenants.reduce((sum, tenant) => {
          return sum + (tenant.rentAmount || 0);
        }, 0);
        
        // Generate monthly earnings data (simulated)
        const currentDate = new Date();
        const monthlyEarnings = [];
        
        for (let i = 0; i < 6; i++) {
          const month = new Date(currentDate);
          month.setMonth(currentDate.getMonth() - i);
          
          const tenantsInMonth = tenants.filter(tenant => {
            const startDate = new Date(tenant.leaseStart);
            return startDate <= month;
          });
          
          const monthlyTotal = tenantsInMonth.reduce((sum, tenant) => {
            return sum + (tenant.rentAmount || 0);
          }, 0);
          
          monthlyEarnings.unshift({
            month: month.getMonth() + 1,
            earnings: monthlyTotal
          });
        }
        
        setStats({
          totalProperties,
          propertiesByStatus,
          totalEarnings,
          monthlyEarnings,
          popularLocations
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setError(error.response?.data?.message || 'Failed to fetch dashboard stats');
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard stats...</p>
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
            Error Loading Dashboard
          </h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
              transition-colors duration-200 flex items-center gap-2 mx-auto"
          >
            <TrendingUp className="w-4 h-4" />
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
  
  // Prepare chart data
  const monthlyEarningsData = {
    labels: stats.monthlyEarnings.map(item => {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return monthNames[item.month - 1];
    }),
    datasets: [
      {
        label: 'Monthly Earnings',
        data: stats.monthlyEarnings.map(item => item.earnings),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: true
      }
    ]
  };
  
  const propertyStatusData = {
    labels: Object.keys(stats.propertiesByStatus).map(formatLabel),
    datasets: [
      {
        data: Object.values(stats.propertiesByStatus),
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
  
  const locationData = {
    labels: stats.popularLocations.map(item => formatLabel(item._id)),
    datasets: [
      {
        label: 'Properties by Location',
        data: stats.popularLocations.map(item => item.count),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
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
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Analytics Dashboard</h1>
            <p className="text-gray-600">Overview of your real estate business performance</p>
          </div>
          
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
              transition-colors duration-200 flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Refresh Data
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-500">
                <Home className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Total Properties</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalProperties}</p>
            <p className="text-sm text-gray-500 mt-1">Listed properties</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-500">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Total Earnings</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              KSh {stats.totalEarnings.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">Monthly rental income</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-500">
                <Home className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Available Properties</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.propertiesByStatus.available || 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">Ready for rent/sale</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-orange-500">
                <MapPin className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Popular Locations</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats.popularLocations.length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Top performing areas</p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              Monthly Earnings
            </h2>
            <div className="h-[300px] sm:h-[400px]">
              {stats.monthlyEarnings.length > 0 ? (
                <Line 
                  data={monthlyEarningsData} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: function(value) {
                            return 'KSh ' + value.toLocaleString();
                          }
                        }
                      }
                    }
                  }} 
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No earnings data available</p>
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
              <Home className="w-5 h-5 text-blue-500" />
              Property Status
            </h2>
            <div className="h-[300px] sm:h-[400px]">
              {Object.keys(stats.propertiesByStatus).length > 0 ? (
                <Pie 
                  data={propertyStatusData} 
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
                  <p className="text-gray-500">No property status data available</p>
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
            Popular Locations
          </h2>
          <div className="h-[300px]">
            {stats.popularLocations.length > 0 ? (
              <Bar 
                data={locationData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
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
      </div>
    </motion.div>
  );
};

export default DashboardOverview;