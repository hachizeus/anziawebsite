import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaEdit, FaTrash, FaMoneyBillWave, FaFileAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

const TenantDetail = () => {
  const { id } = useParams();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [document, setDocument] = useState({ title: '', file: null });
  const navigate = useNavigate();
  
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
        setLoading(false);
      } catch (err) {
        setError('Failed to load tenant information. Please try again later.');
        setLoading(false);
        console.error('Error fetching tenant:', err);
      }
    };
    
    fetchTenant();
  }, [id, navigate]);
  
  const handleDelete = async () => {
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
      
      navigate('/tenants');
    } catch (err) {
      setError('Failed to delete tenant. Please try again later.');
      console.error('Error deleting tenant:', err);
    }
  };

  const handleDocumentUpload = async (e) => {
    e.preventDefault();

    if (!document.title || !document.file) {
      toast.error('Please provide both title and file');
      return;
    }

    const formData = new FormData();
    formData.append('title', document.title);
    formData.append('file', document.file);
    formData.append('tenantId', tenant._id);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/documents/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Document uploaded successfully');
      setDocument({ title: '', file: null });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document');
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
        <button 
          onClick={() => navigate('/tenants')}
          className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" /> Back to Tenants
        </button>
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
          <FaArrowLeft className="mr-2" /> Back to Tenants
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/tenants')}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" /> Back to Tenants
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">{tenant.user?.name}</h2>
              <p className="text-gray-600">{tenant.user?.email}</p>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => navigate(`/tenants/${id}/payment`)}
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center"
              >
                <FaMoneyBillWave className="mr-2" /> Record Payment
              </button>
              <button 
                onClick={() => navigate(`/tenants/edit/${id}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center"
              >
                <FaEdit className="mr-2" /> Edit
              </button>
              <button 
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center"
              >
                <FaTrash className="mr-2" /> Delete
              </button>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tenant Information</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-sm text-gray-900">{tenant.user?.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-sm text-gray-900">{tenant.user?.address || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${tenant.status === 'active' ? 'bg-green-100 text-green-800' : 
                        tenant.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}
                    >
                      {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Notes</p>
                    <p className="text-sm text-gray-900">{tenant.notes || 'No notes'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Property Information</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Property</p>
                    <p className="text-sm text-gray-900">
                      <a 
                        href={`/properties/${tenant.property?._id}`} 
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {tenant.property?.title}
                      </a>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="text-sm text-gray-900">{tenant.property?.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Lease Period</p>
                    <p className="text-sm text-gray-900">
                      {new Date(tenant.leaseStart).toLocaleDateString()} - {new Date(tenant.leaseEnd).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Monthly Rent</p>
                    <p className="text-sm text-gray-900">${tenant.rentAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Security Deposit</p>
                    <p className="text-sm text-gray-900">${tenant.securityDeposit.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Payment History</h3>
              <button 
                onClick={() => navigate(`/documents?property=${tenant.property?._id}`)}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <FaFileAlt className="mr-2" /> View Related Documents
              </button>
            </div>
            
            {tenant.paymentHistory && tenant.paymentHistory.length > 0 ? (
              <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reference
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tenant.paymentHistory.map((payment, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(payment.datePaid).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${payment.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.paymentMethod.charAt(0).toUpperCase() + payment.paymentMethod.slice(1).replace('_', ' ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'}`}
                          >
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.reference || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-md">
                <p className="text-gray-500">No payment history available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDetail;

