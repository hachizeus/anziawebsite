import  { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import BanknoteIcon from '../../components/BanknoteIcon';

const TenantPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    amount: '',
    method: 'cash',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    status: 'completed'
  });

  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required. Please log in.');
          setLoading(false);
          return;
        }
        
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tenants/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setTenant(response.data.tenant);
        
        // Pre-fill amount with monthly rent
        if (response.data.tenant && response.data.tenant.rentAmount) {
          setFormData(prev => ({
            ...prev,
            amount: response.data.tenant.rentAmount
          }));
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tenant:', err);
        setError('Failed to load tenant details. Please try again later.');
        setLoading(false);
      }
    };

    fetchTenant();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        setSubmitting(false);
        return;
      }
      
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/tenants/${id}/payment`, 
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      toast.success('Payment recorded successfully');
      navigate(`/tenants/${id}`);
    } catch (err) {
      console.error('Error recording payment:', err);
      toast.error('Failed to record payment');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !tenant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error || 'Tenant not found'}</span>
        </div>
        <div className="mt-4">
          <Link to="/tenants" className="text-blue-600 hover:underline">
            &larr; Back to Tenants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to={`/tenants/${id}`} className="text-blue-600 hover:underline">
          &larr; Back to Tenant Details
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Record Payment</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">Tenant Information</h2>
          <p className="text-gray-700">
            {tenant.userId?.name || 'Unknown'} - {tenant.propertyId?.title || 'Unknown Property'}
          </p>
          <p className="text-gray-500 text-sm flex items-center">
            Monthly Rent: 
            <span className="flex items-center ml-1">
              <BanknoteIcon className="w-4 h-4 mr-1" />
              KSh {typeof tenant.rentAmount === 'number' ? tenant.rentAmount.toLocaleString('en-KE') : '0'}
            </span>
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <BanknoteIcon className="w-4 h-4 mr-1" />
                Payment Amount (KSh)
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                min="0"
                step="1"
              />
            </div>
            
            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method
              </label>
              <select
                name="method"
                value={formData.method}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="cash">Cash</option>
                <option value="check">Check</option>
                <option value="bank transfer">Bank Transfer</option>
                <option value="credit card">Credit Card</option>
                <option value="debit card">Debit Card</option>
                <option value="paypal">PayPal</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            {/* Payment Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            {/* Payment Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            
            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/tenants/${id}`)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'Recording...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenantPayment;