import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUserAlt, FaEdit, FaTrash, FaEye, FaMoneyBillWave } from 'react-icons/fa';

const TenantList = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/tenants`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setTenants(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load tenants. Please try again later.');
        setLoading(false);
        console.error('Error fetching tenants:', err);
      }
    };
    
    fetchTenants();
  }, [navigate]);
  
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tenant record?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/tenants/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setTenants(tenants.filter(tenant => tenant._id !== id));
    } catch (err) {
      setError('Failed to delete tenant. Please try again later.');
      console.error('Error deleting tenant:', err);
    }
  };
  
  const handleView = (id) => {
    navigate(`/tenants/${id}`);
  };
  
  const handleEdit = (id) => {
    navigate(`/tenants/edit/${id}`);
  };
  
  const handlePayment = (id) => {
    navigate(`/tenants/${id}/payment`);
  };
  
  const filteredTenants = filter === 'all' 
    ? tenants 
    : tenants.filter(tenant => tenant.status === filter);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Tenant Management System</h2>
        <button 
          onClick={() => navigate('/tenants/add')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
        >
          Add New Tenant
        </button>
      </div>
      
      <div className="mb-6">
        <div className="flex space-x-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-md ${filter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Active
          </button>
          <button 
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-md ${filter === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Pending
          </button>
          <button 
            onClick={() => setFilter('inactive')}
            className={`px-4 py-2 rounded-md ${filter === 'inactive' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Inactive
          </button>
        </div>
      </div>
      
      {filteredTenants.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No tenants found.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lease Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rent</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTenants.map((tenant) => (
                <tr key={tenant._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-200 rounded-full">
                        <FaUserAlt className="text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{tenant.user?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{tenant.user?.email || 'No email'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{tenant.property?.title || 'Unknown'}</div>
                    <div className="text-sm text-gray-500">{tenant.property?.location || 'No location'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(tenant.leaseStart).toLocaleDateString()} - {new Date(tenant.leaseEnd).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${tenant.rentAmount.toLocaleString()}/month</div>
                    <div className="text-sm text-gray-500">Deposit: ${tenant.securityDeposit.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${tenant.status === 'active' ? 'bg-green-100 text-green-800' : 
                        tenant.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}
                    >
                      {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleView(tenant._id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button 
                      onClick={() => handleEdit(tenant._id)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="Edit Tenant"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      onClick={() => handlePayment(tenant._id)}
                      className="text-green-600 hover:text-green-900 mr-3"
                      title="Record Payment"
                    >
                      <FaMoneyBillWave />
                    </button>
                    <button 
                      onClick={() => handleDelete(tenant._id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Tenant"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TenantList;

