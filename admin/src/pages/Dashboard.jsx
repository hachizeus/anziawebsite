import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Home,
  Activity,
  Users,
  Eye,
  Calendar,
  TrendingUp,
  AlertCircle,
  Loader,
  Briefcase,
  Map,
  UserPlus,
  Plus
} from 'lucide-react';
import { backendurl } from '../App';

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

// Hotel icon component (since it's not available in lucide-react)
const HotelIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M2 20h20"></path>
    <path d="M5 20v-4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4"></path>
    <path d="M12 2L2 9l10 4 10-4-10-7z"></path>
  </svg>
);

// Product categories with their icons
const PRODUCT_CATEGORIES = {
  'Power Tools & Workshop Gear': <Home className="w-5 h-5" />,
  'Generators & Power Equipment': <Briefcase className="w-5 h-5" />,
  'Electronics & Appliances': <HotelIcon className="w-5 h-5" />
};

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    inStockProducts: 0,
    totalCustomers: 0,
    totalViews: 0,
    pendingOrders: 0,
    productsByCategory: {},
    viewsData: {},
    recentActivity: [],
    loading: true,
    error: null
  });
  
  // Removed unreadNotifications state

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0
        },
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    },
    elements: {
      line: {
        tension: 0.4
      },
      point: {
        radius: 4,
        hoverRadius: 6
      }
    }
  };

  // Removed fetchUnreadNotifications function

  const fetchStats = async () => {
    try {
      console.log('[DEBUG] Starting fetchStats');
      const token = localStorage.getItem("token");
      console.log('[DEBUG] Token:', token ? 'Exists' : 'Missing');
      
      // Fetch admin stats
      const response = await axios.get(`${backendurl}/api/admin/stats`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('[DEBUG] Response status:', response.status);
      console.log('[DEBUG] Response data:', response.data);
      
      // Fetch products to calculate category breakdown
      const productsResponse = await axios.get(`${backendurl}/api/legacy-products/list`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Fetch orders
      const ordersResponse = await axios.get(`${backendurl}/api/orders/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const products = productsResponse.data.products || [];
      const orders = ordersResponse.data.orders || [];
      
      // Calculate products by category
      const productsByCategory = {};
      const categoryColors = {
        'Power Tools & Workshop Gear': 'rgba(79, 70, 229, 0.6)', // primary color
        'Generators & Power Equipment': 'rgba(255, 99, 132, 0.6)',
        'Electronics & Appliances': 'rgba(255, 206, 86, 0.6)',
        'Other': 'rgba(153, 102, 255, 0.6)'
      };
      
      products.forEach(product => {
        const category = product.category || 'Other';
        productsByCategory[category] = (productsByCategory[category] || 0) + 1;
      });
      
      // Prepare category chart data
      const categoryChartData = {
        labels: Object.keys(productsByCategory),
        datasets: [{
          data: Object.values(productsByCategory),
          backgroundColor: Object.keys(productsByCategory).map(cat => categoryColors[cat] || 'rgba(153, 102, 255, 0.6)'),
          borderWidth: 1
        }]
      };
      
      if (response.data.success) {
        setStats(prev => ({
          ...prev,
          ...response.data.stats,
          productsByCategory: categoryChartData,
          recentOrders: orders.slice(0, 5),
          pendingOrders: orders.filter(order => order.status === 'pending').length,
          loading: false,
          error: null,
        }));
      } else {
        throw new Error(response.data.message || "Failed to fetch stats");
      }
    } catch (error) {
      console.error('[DEBUG] Full error:', error);
      console.error('[DEBUG] Error response:', error.response);
      
      setStats(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || 
               error.message || 
               "Failed to fetch dashboard data",
      }));
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Refresh data every 5 minutes
    const statsInterval = setInterval(fetchStats, 300000);
    
    return () => {
      clearInterval(statsInterval);
    };
  }, []);

  const statCards = [
    {
      title: "Total Products",
      value: stats.totalProducts,
      icon: Home,
      color: "bg-primary-500",
      description: "Total products listed",
    },
    {
      title: "In Stock",
      value: stats.inStockProducts,
      icon: Activity,
      color: "bg-green-500",
      description: "Products available",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      color: "bg-indigo-500",
      description: "Registered customers",
    },
    // Total Views removed
    // Pending Orders removed
  ];

  if (stats.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Dashboard
          </h3>
          <p className="text-gray-500 mb-4">{stats.error}</p>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 
              transition-colors duration-200 flex items-center gap-2 mx-auto"
          >
            <TrendingUp className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen pt-16 sm:pt-20 md:pt-24 px-3 sm:px-4 md:px-6 lg:px-8 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Dashboard</h1>
            <p className="text-sm sm:text-base text-gray-600">Overview of your electronics store</p>
          </div>
          <button
            onClick={fetchStats}
            className="px-3 sm:px-4 py-2 sm:py-2.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 
              transition-colors duration-200 flex items-center gap-2 w-full sm:w-auto justify-center text-sm sm:text-base"
          >
            <TrendingUp className="w-4 h-4" />
            <span className="sm:inline">Refresh Data</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-4 sm:p-5 md:p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className={`p-2.5 sm:p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <span className="text-xs font-medium text-gray-500 hidden sm:inline">
                  Last 30 days
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-1">{stat.title}</h3>
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
              <p className="text-xs sm:text-sm text-gray-500">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Property Views Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-md"
          >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
              Product Views
            </h2>
            <div className="h-[250px] xs:h-[280px] sm:h-[320px] md:h-[350px] lg:h-[300px] xl:h-[350px]">
              {stats.viewsData && Object.keys(stats.viewsData).length > 0 ? (
                <Line data={stats.viewsData} options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: {
                      ...chartOptions.plugins.legend,
                      display: window.innerWidth > 640 // Only show legend on larger screens
                    }
                  }
                }} />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-sm sm:text-base text-gray-500">No view data available</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Property Categories Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-md"
          >
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
              Products by Category
            </h2>
            <div className="h-[250px] xs:h-[280px] sm:h-[320px] md:h-[350px] lg:h-[300px] xl:h-[350px]">
              {stats.productsByCategory && Object.keys(stats.productsByCategory).length > 0 ? (
                <Doughnut 
                  data={stats.productsByCategory} 
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: window.innerWidth < 768 ? 'bottom' : 'right',
                        labels: {
                          boxWidth: window.innerWidth < 768 ? 12 : 20,
                          font: {
                            size: window.innerWidth < 768 ? 10 : 12
                          }
                        }
                      }
                    }
                  }} 
                />
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-sm sm:text-base text-gray-500">No category data available</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Product Categories Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-md mb-6 sm:mb-8"
        >
          <div className="flex justify-between items-center mb-3 sm:mb-4 md:mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Product Categories</h2>
            <Link to="/add" className="text-sm text-primary-600 hover:text-primary-700 flex items-center">
              <Plus className="w-4 h-4 mr-1" />
              Add Product
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {Object.entries(PRODUCT_CATEGORIES).map(([category, icon], index) => (
              <div 
                key={category}
                className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className={`p-1.5 sm:p-2 rounded-full ${
                    index === 0 ? 'bg-primary-100 text-primary-600' : 
                    index === 1 ? 'bg-red-100 text-red-600' : 
                    'bg-yellow-100 text-yellow-600'
                  }`}>
                    {icon}
                  </div>
                  <h3 className="font-medium text-sm sm:text-base text-gray-900">{category}</h3>
                </div>
                
                <div className="space-y-2 pl-2">
                  {category === 'Power Tools & Workshop Gear' && (
                    <>
                      <p className="text-sm text-gray-600">• Drills & Drivers</p>
                      <p className="text-sm text-gray-600">• Saws & Cutting Tools</p>
                      <p className="text-sm text-gray-600">• Grinders & Sanders</p>
                      <p className="text-sm text-gray-600">• Welding Equipment</p>
                      <p className="text-sm text-gray-600">• Hand Tools</p>
                    </>
                  )}
                  
                  {category === 'Generators & Power Equipment' && (
                    <>
                      <p className="text-sm text-gray-600">• Portable Generators</p>
                      <p className="text-sm text-gray-600">• Standby Generators</p>
                      <p className="text-sm text-gray-600">• UPS Systems</p>
                      <p className="text-sm text-gray-600">• Solar Equipment</p>
                      <p className="text-sm text-gray-600">• Batteries</p>
                    </>
                  )}
                  
                  {category === 'Electronics & Appliances' && (
                    <>
                      <p className="text-sm text-gray-600">• Home Appliances</p>
                      <p className="text-sm text-gray-600">• Audio & Video</p>
                      <p className="text-sm text-gray-600">• Computing</p>
                      <p className="text-sm text-gray-600">• Mobile & Accessories</p>
                      <p className="text-sm text-gray-600">• Lighting</p>
                    </>
                  )}
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <Link 
                    to={`/list?category=${encodeURIComponent(category)}`}
                    className="text-xs sm:text-sm text-primary-600 hover:text-primary-700"
                  >
                    View Products
                  </Link>
                  <Link 
                    to={`/add?category=${encodeURIComponent(category)}`}
                    className="text-xs sm:text-sm bg-primary-50 text-primary-600 px-2 py-1 rounded hover:bg-primary-100"
                  >
                    Add New
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </motion.div>


        
        {/* Recent Orders section removed */}

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-3 sm:p-4 md:p-6 rounded-lg shadow-md mb-6 sm:mb-8"
        >
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
            Recent Activity
          </h2>
          <div className="space-y-2 sm:space-y-3 md:space-y-4 max-h-[250px] sm:max-h-[300px] md:max-h-[400px] overflow-y-auto">
            {stats.recentActivity?.length > 0 ? (
              stats.recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 sm:gap-3 md:gap-4 p-2 sm:p-3 hover:bg-gray-50 rounded-lg 
                    transition-colors duration-200"
                >
                  <div className="p-1.5 sm:p-2 bg-primary-100 rounded-lg flex-shrink-0">
                    {activity.type === 'property' ? (
                      <Home className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                    ) : activity.type === 'customer' ? (
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
                    ) : activity.type === 'order' ? (
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                    ) : (
                      <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base text-gray-900 truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
                No recent activity
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Dashboard;