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
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import {
  DollarSign,
  Calendar,
  TrendingUp,
  AlertCircle,
  Loader,
  Home
} from 'lucide-react';
import { backendurl } from '../../App';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const FinancialAnalytics = () => {
  const [financialData, setFinancialData] = useState({
    paymentTrends: [],
    earningsPerProperty: []
  });
  const [period, setPeriod] = useState('monthly');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Fetch properties data
        const propertiesResponse = await axios.get(`${backendurl}/api/products/list`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Fetch tenants data
        const tenantsResponse = await axios.get(`${backendurl}/api/tenants`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const properties = propertiesResponse.data.property || [];
        const tenants = tenantsResponse.data.tenants || [];
        
        // Calculate earnings per property
        const propertyEarnings = {};
        
        tenants.forEach(tenant => {
          const propertyId = tenant.propertyId?._id;
          if (propertyId) {
            if (!propertyEarnings[propertyId]) {
              propertyEarnings[propertyId] = {
                propertyTitle: tenant.propertyId?.title || 'Unknown Property',
                totalEarnings: 0,
                transactionCount: 0
              };
            }
            
            propertyEarnings[propertyId].totalEarnings += tenant.rentAmount || 0;
            propertyEarnings[propertyId].transactionCount += 1;
          }
        });
        
        const earningsPerProperty = Object.keys(propertyEarnings)
          .map(propertyId => ({
            _id: propertyId,
            ...propertyEarnings[propertyId]
          }))
          .sort((a, b) => b.totalEarnings - a.totalEarnings);
        
        // Generate payment trends data
        const paymentTrends = [];
        const months = 6;
        const currentDate = new Date();
        
        for (let i = 0; i < months; i++) {
          const date = new Date(currentDate);
          date.setMonth(currentDate.getMonth() - i);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          
          // Filter tenants who were active in this month
          const activeTenantsInMonth = tenants.filter(tenant => {
            const startDate = new Date(tenant.leaseStart);
            const endDate = tenant.leaseEnd ? new Date(tenant.leaseEnd) : new Date();
            
            const monthStart = new Date(year, month - 1, 1);
            const monthEnd = new Date(year, month, 0);
            
            return startDate <= monthEnd && endDate >= monthStart;
          });
          
          const totalAmount = activeTenantsInMonth.reduce((sum, tenant) => {
            return sum + (tenant.rentAmount || 0);
          }, 0);
          
          paymentTrends.unshift({
            date: `${year}-${month.toString().padStart(2, '0')}`,
            totalAmount,
            count: activeTenantsInMonth.length
          });
        }
        
        setFinancialData({
          paymentTrends,
          earningsPerProperty
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching financial data:', error);
        setError(error.response?.data?.message || 'Failed to fetch financial data');
        setLoading(false);
      }
    };
    
    fetchFinancialData();
  }, [period, dateRange]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading financial data...</p>
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
            Error Loading Financial Data
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
  
  // Prepare chart data for payment trends
  const paymentTrendsData = {
    labels: financialData.paymentTrends.map(item => item.date),
    datasets: [
      {
        label: 'Payment Amount',
        data: financialData.paymentTrends.map(item => item.totalAmount),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true
      }
    ]
  };
  
  // Prepare chart data for earnings per property
  const propertyEarningsData = {
    labels: financialData.earningsPerProperty.map(item => item.propertyTitle),
    datasets: [
      {
        label: 'Earnings per Property',
        data: financialData.earningsPerProperty.map(item => item.totalEarnings),
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
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Financial Analytics</h1>
            <p className="text-gray-600">Detailed financial performance of your properties</p>
          </div>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Filter Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Period
              </label>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Payment Trends
            </h2>
            <div className="h-[300px] sm:h-[400px]">
              {financialData.paymentTrends.length > 0 ? (
                <Line 
                  data={paymentTrendsData} 
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
                  <p className="text-gray-500">No payment trend data available</p>
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
              <Home className="w-5 h-5 text-purple-500" />
              Earnings per Property
            </h2>
            <div className="h-[300px] sm:h-[400px]">
              {financialData.earningsPerProperty.length > 0 ? (
                <Bar 
                  data={propertyEarningsData} 
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
                      },
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
                  <p className="text-gray-500">No property earnings data available</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
        
        {financialData.earningsPerProperty.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg mb-8"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Top Performing Properties</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Earnings
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tenants
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {financialData.earningsPerProperty.map((property, index) => (
                    <tr key={property._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {property.propertyTitle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        KSh {property.totalEarnings.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {property.transactionCount}
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

export default FinancialAnalytics;