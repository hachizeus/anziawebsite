import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const TenantPayment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [tenant, setTenant] = useState(null);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    datePaid: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    status: 'completed',
    reference: '',
    description: 'Monthly rent payment'
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchTenant = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/tenants/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setTenant(response.data);
        setPaymentData({
          ...paymentData,
          amount: response.data.rentAmount
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to load tenant information. Please try again later.');
        setLoading(false);
        console.error('Error fetching tenant:', err);
      }
    };
    
    fetchTenant();
  }, [id, navigate, paymentData.paymentMethod]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({
      ...paymentData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!paymentData.amount || !paymentData.datePaid || !paymentData.paymentMethod) {
      setError('Please fill in all required fields.');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/tenants/${id}/payments`, paymentData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      navigate(`/tenants/${id}`);
    } catch (err) {
      console.error('Error recording payment:', err);
      setError('Failed to record payment. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!tenant) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-10">
          <p className="text-gray-500">Tenant not found.</p>
        </div>
        <button 
          onClick={() => navigate('/tenants')}
          className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          Back to Tenants
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Record Payment</h2>
        
        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Tenant Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Name</p>
              <p className="text-sm text-gray-900">{tenant.user?.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Property</p>
              <p className="text-sm text-gray-900">{tenant.property?.title}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Monthly Rent</p>
              <p className="text-sm text-gray-900">${tenant.rentAmount.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="text-sm text-gray-900">{tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}</p>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
              Payment Amount ($) *
            </label>
            <input
              id="amount"
              name="amount"
              type="number"
              value={paymentData.amount}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter payment amount"
              min="0"
              step="0.01"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="datePaid">
              Payment Date *
            </label>
            <input
              id="datePaid"
              name="datePaid"
              type="date"
              value={paymentData.datePaid}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="paymentMethod">
              Payment Method *
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={paymentData.paymentMethod}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="cash">Cash</option>
              <option value="check">Check</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="credit_card">Credit Card</option>
              <option value="mobile_payment">Mobile Payment</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
              Payment Status *
            </label>
            <select
              id="status"
              name="status"
              value={paymentData.status}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            >
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reference">
              Reference Number
            </label>
            <input
              id="reference"
              name="reference"
              type="text"
              value={paymentData.reference}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter reference number (optional)"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={paymentData.description}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter payment description"
              rows="2"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(`/tenants/${id}`)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                submitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? 'Processing...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenantPayment;

