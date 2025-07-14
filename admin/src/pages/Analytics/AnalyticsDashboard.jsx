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
  Filler,
  ArcElement
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  TrendingUp,
  Users,
  Eye,
  Calendar,
  Search,
  MousePointer,
  Home,
  AlertCircle,
  Loader,
  DollarSign,
  BarChart2
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
  Filler,
  ArcElement
);

const AnalyticsDashboard = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [trafficData, setTrafficData] = useState(null);
  const [conversionData, setConversionData] = useState(null);
  const [behaviorData, setBehaviorData] = useState(null);
  const [propertyData, setPropertyData] = useState(null);
  const [searchData, setSearchData] = useState(null);
  
  // Get date range based on selected time range
  const getDateRange = () => {
    const endDate = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case '7days':
        startDate.setDate(endDate.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(endDate.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(endDate.getDate() - 90);
        break;
      case '6months':
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case '1year':
        startDate.setFullYear(endDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(endDate.getDate() - 30);
    }
    
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    };
  };
  
  // Fetch analytics data
  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const { startDate, endDate } = getDateRange();
      
      // Fetch traffic analytics
      const trafficResponse = await axios.get(
        `${backendurl}/api/analytics/data/traffic?startDate=${startDate}&endDate=${endDate}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Fetch conversion metrics
      const conversionResponse = await axios.get(
        `${backendurl}/api/analytics/data/conversions?startDate=${startDate}&endDate=${endDate}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Fetch user behavior analytics
      const behaviorResponse = await axios.get(
        `${backendurl}/api/analytics/data/user-behavior?startDate=${startDate}&endDate=${endDate}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Fetch property performance
      const propertyResponse = await axios.get(
        `${backendurl}/api/analytics/data/property-performance?startDate=${startDate}&endDate=${endDate}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Fetch search analytics
      const searchResponse = await axios.get(
        `${backendurl}/api/analytics/data/search?startDate=${startDate}&endDate=${endDate}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setTrafficData(trafficResponse.data.data);
      setConversionData(conversionResponse.data.data);
      setBehaviorData(behaviorResponse.data.data);
      setPropertyData(propertyResponse.data.data);
      setSearchData(searchResponse.data.data);
      
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);
  
  // Prepare traffic chart data
  const prepareTrafficChartData = () => {
    if (!trafficData || !trafficData.pageViews) return null;
    
    const dates = Object.keys(trafficData.pageViews).sort();
    const pageViewsData = dates.map(date => {
      return Object.values(trafficData.pageViews[date] || {}).reduce((sum, count) => sum + count, 0);
    });
    
    const visitorsData = dates.map(date => trafficData.uniqueVisitors[date] || 0);
    
    return {
      labels: dates,
      datasets: [
        {
          label: 'Page Views',
          data: pageViewsData,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.2)',
          tension: 0.4,
          fill: true
        },
        {
          label: 'Unique Visitors',
          data: visitorsData,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  };
  
  // Prepare conversion funnel chart data
  const prepareConversionChartData = () => {
    if (!conversionData || !conversionData.funnelByDay) return null;
    
    const dates = Object.keys(conversionData.funnelByDay).sort();
    const pageViewsData = dates.map(date => conversionData.funnelByDay[date].pageView || 0);
    const propertyViewsData = dates.map(date => conversionData.funnelByDay[date].propertyView || 0);
    const inquiriesData = dates.map(date => conversionData.funnelByDay[date].inquiry || 0);
    const appointmentsData = dates.map(date => conversionData.funnelByDay[date].appointment || 0);
    
    return {
      labels: dates,
      datasets: [
        {
          label: 'Page Views',
          data: pageViewsData,
          borderColor: 'rgb(53, 162, 235)',
          backgroundColor: 'rgba(53, 162, 235, 0.2)',
          tension: 0.4
        },
        {
          label: 'Property Views',
          data: propertyViewsData,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4
        },
        {
          label: 'Inquiries',
          data: inquiriesData,
          borderColor: 'rgb(255, 159, 64)',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          tension: 0.4
        },
        {
          label: 'Appointments',
          data: appointmentsData,
          borderColor: 'rgb(153, 102, 255)',
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          tension: 0.4
        }
      ]
    };
  };
  
  // Prepare property performance chart data
  const preparePropertyPerformanceData = () => {
    if (!propertyData || !propertyData.mostViewedProperties) return null;
    
    const properties = propertyData.mostViewedProperties.slice(0, 5);
    
    return {
      labels: properties.map(p => p.title),
      datasets: [
        {
          label: 'Views',
          data: properties.map(p => p.views),
          backgroundColor: 'rgba(53, 162, 235, 0.8)'
        }
      ]
    };
  };
  
  // Prepare search terms chart data
  const prepareSearchTermsData = () => {
    if (!searchData || !searchData.topSearchQueries) return null;
    
    const searchTerms = searchData.topSearchQueries.slice(0, 5);
    
    return {
      labels: searchTerms.map(term => term._id),
      datasets: [
        {
          label: 'Search Count',
          data: searchTerms.map(term => term.count),
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 1
        }
      ]
    };
  };
  
  // Chart options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false
    }
  };
  
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  
  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      }
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics data...</p>
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
            Error Loading Analytics
          </h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={fetchAnalyticsData}
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
  
  const trafficChartData = prepareTrafficChartData();
  const conversionChartData = prepareConversionChartData();
  const propertyPerformanceData = preparePropertyPerformanceData();
  const searchTermsData = prepareSearchTermsData();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen pt-20 sm:pt-24 md:pt-32 px-2 sm:px-4 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Analytics Dashboard</h1>
            <p className="text-gray-600">Comprehensive insights into your real estate platform performance</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
            
            <button
              onClick={fetchAnalyticsData}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              Refresh Data
            </button>
          </div>
        </div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Traffic Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-500">
                <Eye className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Total Page Views</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {conversionData?.metrics?.totalPageViews?.toLocaleString() || 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">Website traffic</p>
          </motion.div>
          
          {/* Conversion Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-500">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Inquiry Rate</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {conversionData?.rates?.inquiryRate?.toFixed(2) || 0}%
            </p>
            <p className="text-sm text-gray-500 mt-1">Property views to inquiries</p>
          </motion.div>
          
          {/* User Behavior Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-500">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Avg. Session Duration</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {behaviorData?.sessionMetrics?.averageSessionDuration || 0}s
            </p>
            <p className="text-sm text-gray-500 mt-1">Time spent on site</p>
          </motion.div>
          
          {/* Property Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-orange-500">
                <Home className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Property Views</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {conversionData?.metrics?.propertyViews?.toLocaleString() || 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">Total property page views</p>
          </motion.div>
        </div>
        
        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Traffic Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-500" />
              Traffic Overview
            </h2>
            <div className="h-[300px] sm:h-[400px]">
              {trafficChartData ? (
                <Line data={trafficChartData} options={lineChartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No traffic data available</p>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Conversion Funnel Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              Conversion Funnel
            </h2>
            <div className="h-[300px] sm:h-[400px]">
              {conversionChartData ? (
                <Line data={conversionChartData} options={lineChartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No conversion data available</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Additional Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Property Performance Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg lg:col-span-2"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <Home className="w-5 h-5 text-orange-500" />
              Top Performing Properties
            </h2>
            <div className="h-[300px]">
              {propertyPerformanceData ? (
                <Bar data={propertyPerformanceData} options={barChartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No property performance data available</p>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Search Terms Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <Search className="w-5 h-5 text-purple-500" />
              Top Search Terms
            </h2>
            <div className="h-[300px]">
              {searchTermsData ? (
                <Pie data={searchTermsData} options={pieChartOptions} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No search data available</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Data Tables Section */}
        <div className="grid grid-cols-1 gap-6">
          {/* Top Pages Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 sm:p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-blue-500" />
              Top Pages
            </h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Page
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trafficData?.topPages?.map((page, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {page._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {page.views.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                  
                  {(!trafficData?.topPages || trafficData.topPages.length === 0) && (
                    <tr>
                      <td colSpan="2" className="px-6 py-4 text-center text-sm text-gray-500">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsDashboard;