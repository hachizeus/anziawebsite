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
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  TrendingUp,
  DollarSign,
  FileText,
  Calendar,
  Download,
  Filter,
  AlertCircle,
  Loader,
  Plus
} from 'lucide-react';
import { backendurl } from '../../App';
import { Link } from 'react-router-dom';

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

const FinancialDashboard = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [incomeData, setIncomeData] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  
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
  
  // Fetch financial data
  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const { startDate, endDate } = getDateRange();
      
      // Fetch income report
      const incomeResponse = await axios.post(
        `${backendurl}/api/financial/reports`,
        {
          reportType: 'income',
          title: `Income Report (${startDate} to ${endDate})`,
          dateRange: { start: startDate, end: endDate }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Fetch invoices
      const invoiceResponse = await axios.get(
        `${backendurl}/api/financial/invoices?startDate=${startDate}&endDate=${endDate}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setIncomeData(incomeResponse.data.report);
      setInvoiceData(invoiceResponse.data);
      
    } catch (error) {
      console.error('Error fetching financial data:', error);
      setError(error.response?.data?.message || error.message || 'Failed to fetch financial data');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchFinancialData();
  }, [timeRange]);
  
  // Prepare income chart data
  const prepareIncomeChartData = () => {
    if (!incomeData || !incomeData.data || !incomeData.data.incomeByMonth) return null;
    
    const months = Object.keys(incomeData.data.incomeByMonth).sort();
    const incomeValues = months.map(month => incomeData.data.incomeByMonth[month]);
    
    return {
      labels: months,
      datasets: [
        {
          label: 'Income',
          data: incomeValues,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.4,
          fill: true
        }
      ]
    };
  };
  
  // Prepare payment methods chart data
  const preparePaymentMethodsData = () => {
    if (!incomeData || !incomeData.data || !incomeData.data.paymentMethods) return null;
    
    const methods = Object.keys(incomeData.data.paymentMethods);
    const counts = methods.map(method => incomeData.data.paymentMethods[method].count);
    
    return {
      labels: methods.map(method => method.charAt(0).toUpperCase() + method.slice(1)),
      datasets: [
        {
          data: counts,
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
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
        intersect: false,
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'KES'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      }
    },
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
    },
    interaction: {
      mode: 'index',
      intersect: false
    }
  };
  
  const doughnutChartOptions = {
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
            onClick={fetchFinancialData}
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
  
  const incomeChartData = prepareIncomeChartData();
  const paymentMethodsData = preparePaymentMethodsData();
  
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
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Financial Dashboard</h1>
            <p className="text-gray-600">Comprehensive financial insights and reporting tools</p>
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
              onClick={fetchFinancialData}
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
          {/* Total Income */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-green-500">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Total Income</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              KSh {incomeData?.summary?.totalIncome?.toLocaleString() || 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">For selected period</p>
          </motion.div>
          
          {/* Invoices */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-blue-500">
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Invoices</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {invoiceData?.invoices?.length || 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">Total invoices generated</p>
          </motion.div>
          
          {/* Payment Count */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-purple-500">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Payments</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {incomeData?.summary?.paymentCount || 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">Successful transactions</p>
          </motion.div>
          
          {/* Outstanding Amount */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-orange-500">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Outstanding</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              KSh {invoiceData?.outstandingAmount?.toLocaleString() || 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">Unpaid invoices</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default FinancialDashboard;