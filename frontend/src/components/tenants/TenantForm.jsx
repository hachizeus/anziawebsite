import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const TenantForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    address: '',
    property: '',
    leaseStart: '',
    leaseEnd: '',
    rentAmount: '',
    securityDeposit: '',
    notes: '',
    status: 'active',
    updatePropertyStatus: true
  });
  
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [userFound, setUserFound] = useState(false);
  
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/properties`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Filter only available properties
        const availableProperties = response.data.property.filter(
          prop => prop.availability === 'available' || (isEditMode && prop._id === formData.property)
        );
        
        setProperties(availableProperties);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load available properties.');
        setLoading(false);
      }
    };
    
    fetchProperties();
    
    if (isEditMode) {
      const fetchTenant = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/tenants/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          const tenant = response.data;
          setFormData({
            email: tenant.user?.email || '',
            name: tenant.user?.name || '',
            phone: tenant.user?.phone || '',
            address: tenant.user?.address || '',
            property: tenant.property?._id || '',
            leaseStart: tenant.leaseStart ? new Date(tenant.leaseStart).toISOString().split('T')[0] : '',
            leaseEnd: tenant.leaseEnd ? new Date(tenant.leaseEnd).toISOString().split('T')[0] : '',
            rentAmount: tenant.rentAmount || '',
            securityDeposit: tenant.securityDeposit || '',
            notes: tenant.notes || '',
            status: tenant.status || 'active',
            updatePropertyStatus: false
          });
          
          setUserFound(true);
        } catch (err) {
          console.error('Error fetching tenant:', err);
          setError('Failed to load tenant information.');
        }
      };
      
      fetchTenant();
    }
  }, [id, isEditMode, navigate]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    if (name === 'email') {
      setUserFound(false);
    }
  };
  
  const checkEmail = async () => {
    if (!formData.email) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/users/check-email`,
        { email: formData.email },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.exists) {
        setFormData(prev => ({
          ...prev,
          name: response.data.user.name || '',
          phone: response.data.user.phone || '',
          address: response.data.user.address || ''
        }));
        setUserFound(true);
      }
    } catch (err) {
      console.error('Error checking email:', err);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.name || !formData.property || !formData.leaseStart || 
        !formData.leaseEnd || !formData.rentAmount) {
      setError('Please fill in all required fields.');
      return;
    }
    
    setSubmitting(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      
      // Prepare tenant data
      const tenantData = {
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        propertyId: formData.property,
        leaseStart: formData.leaseStart,
        leaseEnd: formData.leaseEnd,
        rentAmount: formData.rentAmount,
        securityDeposit: formData.securityDeposit,
        notes: formData.notes,
        status: formData.status,
        updatePropertyStatus: formData.updatePropertyStatus
      };
      
      if (isEditMode) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/tenants/${id}`, tenantData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/tenants`, tenantData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      
      navigate('/tenants');
    } catch (err) {
      console.error('Error saving tenant:', err);
      setError(err.response?.data?.message || 'Failed to save tenant information.');
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
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {isEditMode ? 'Edit Tenant' : 'Add New Tenant'}
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select User</h3>
            <p className="text-sm text-gray-500 mb-2">
              This will upgrade the selected user to tenant role
            </p>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email Address *
              </label>
              <div className="flex">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter email address"
                  required
                />
                <button
                  type="button"
                  onClick={checkEmail}
                  className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Check
                </button>
              </div>
            </div>
            
            {userFound && (
              <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                <p className="text-green-700 font-medium">User found! Details loaded.</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Full Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter tenant's full name"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter address"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Lease Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="property">
                  Property *
                </label>
                <select
                  id="property"
                  name="property"
                  value={formData.property}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="">Select a property</option>
                  {properties.map((property) => (
                    <option key={property._id} value={property._id}>
                      {property.title} - {property.location}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
                  Status *
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="leaseStart">
                  Lease Start Date *
                </label>
                <input
                  id="leaseStart"
                  name="leaseStart"
                  type="date"
                  value={formData.leaseStart}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="leaseEnd">
                  Lease End Date *
                </label>
                <input
                  id="leaseEnd"
                  name="leaseEnd"
                  type="date"
                  value={formData.leaseEnd}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rentAmount">
                  Monthly Rent Amount ($) *
                </label>
                <input
                  id="rentAmount"
                  name="rentAmount"
                  type="number"
                  value={formData.rentAmount}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter monthly rent amount"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="securityDeposit">
                  Security Deposit ($)
                </label>
                <input
                  id="securityDeposit"
                  name="securityDeposit"
                  type="number"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter security deposit amount"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter any additional notes"
              rows="3"
            />
          </div>
          
          {!isEditMode && (
            <div className="mb-6">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="updatePropertyStatus"
                  checked={formData.updatePropertyStatus}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Mark property as rented</span>
              </label>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/tenants')}
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
              {submitting ? 'Saving...' : isEditMode ? 'Update Tenant' : 'Add Tenant'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenantForm;

