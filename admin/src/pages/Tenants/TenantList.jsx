import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const TenantList = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required. Please log in.');
          setLoading(false);
          return;
        }
        
        // Refresh dashboard stats to update tenant count
        try {
          await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/admin/stats`, {
            headers: { Authorization: `Bearer ${token}` }
          });
        } catch (statsError) {
          console.error('Error refreshing dashboard stats:', statsError);
        }
        
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/tenants`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data && response.data.tenants) {
          setTenants(response.data.tenants);
        } else {
          setTenants([]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tenants:', err);
        setError('Failed to load tenants. Please try again later.');
        setLoading(false);
      }
    };

    fetchTenants();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tenant? This will also revert the user role to regular user.')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }
      
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/tenants/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setTenants(tenants.filter(tenant => tenant._id !== id));
      toast.success('Tenant deleted successfully');
    } catch (err) {
      console.error('Error deleting tenant:', err);
      toast.error('Failed to delete tenant');
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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tenant Management</h1>
        <Link
          to="/tenants/add"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
        >
          Add New Tenant
        </Link>
      </div>

      {tenants.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">No tenants found. Add a new tenant to get started.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tenant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lease Period
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rent
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tenants.map((tenant) => (
                  <tr key={tenant._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{tenant.userId?.name || 'Unknown'}</div>
                          <div className="text-sm text-gray-500">{tenant.userId?.email || 'No email'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{tenant.propertyId?.title || 'Unknown'}</div>
                      <div className="text-sm text-gray-500">{tenant.propertyId?.location || 'No location'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {tenant.leaseStart ? new Date(tenant.leaseStart).toLocaleDateString() : 'N/A'} - 
                        {tenant.leaseEnd ? new Date(tenant.leaseEnd).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      KSh {typeof tenant.rentAmount === 'number' ? tenant.rentAmount.toLocaleString('en-KE') : tenant.rentAmount || 0}/month
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/tenants/${tenant._id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                        <Link
                          to={`/tenants/edit/${tenant._id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(tenant._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TenantList;