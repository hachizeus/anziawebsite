import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FileText } from 'lucide-react';
import BanknoteIcon from '../../components/BanknoteIcon';
import PageWrapper from '../../components/PageWrapper';
import ResponsiveCard from '../../components/ResponsiveCard';
import ResponsiveTable from '../../components/ResponsiveTable';

const TenantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setLoading(false);
      } catch (err) {
        console.error('Error fetching tenant:', err);
        setError('Failed to load tenant details. Please try again later.');
        setLoading(false);
      }
    };

    fetchTenant();
  }, [id]);

  const handleDelete = async () => {
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
      
      toast.success('Tenant deleted successfully');
      navigate('/tenants');
    } catch (err) {
      console.error('Error deleting tenant:', err);
      toast.error('Failed to delete tenant');
    }
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex justify-center items-center h-48 sm:h-64">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </PageWrapper>
    );
  }

  if (error || !tenant) {
    const backLink = (
      <Link to="/tenants" className="text-blue-600 hover:underline text-sm sm:text-base">
        &larr; Back to Tenants
      </Link>
    );
    
    return (
      <PageWrapper backLink={backLink}>
        <div className="bg-red-100 border border-red-400 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded relative" role="alert">
          <strong className="font-bold text-sm sm:text-base">Error!</strong>
          <span className="block sm:inline text-sm sm:text-base"> {error || 'Tenant not found'}</span>
        </div>
      </PageWrapper>
    );
  }

  const backLink = (
    <Link to="/tenants" className="text-blue-600 hover:underline text-sm sm:text-base">
      &larr; Back to Tenants
    </Link>
  );
  
  const actionButtons = (
    <div className="flex flex-wrap gap-2 w-full sm:w-auto">
      <Link
        to={`/tenants/${id}/documents`}
        className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-1.5 sm:py-2 px-3 sm:px-4 rounded-md flex items-center gap-1 sm:gap-2 text-xs sm:text-sm flex-1 sm:flex-none justify-center"
      >
        <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="whitespace-nowrap">Manage Docs</span>
      </Link>
      <Link
        to={`/tenants/${id}/payment`}
        className="bg-green-600 hover:bg-green-700 text-white font-medium py-1.5 sm:py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm flex-1 sm:flex-none justify-center flex items-center"
      >
        Record Payment
      </Link>
      <Link
        to={`/tenants/edit/${id}`}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1.5 sm:py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm flex-1 sm:flex-none justify-center flex items-center"
      >
        Edit
      </Link>
      <button
        onClick={handleDelete}
        className="bg-red-600 hover:bg-red-700 text-white font-medium py-1.5 sm:py-2 px-3 sm:px-4 rounded-md text-xs sm:text-sm flex-1 sm:flex-none justify-center flex items-center"
      >
        Delete
      </button>
    </div>
  );

  return (
    <PageWrapper
      title="Tenant Details"
      backLink={backLink}
      actionButton={actionButtons}
    >

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Tenant Information */}
        <ResponsiveCard title="Tenant Information">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex flex-col sm:flex-row border-b border-gray-100 pb-2">
              <span className="font-medium w-full sm:w-1/3 text-gray-600 text-sm sm:text-base">Name:</span>
              <span className="w-full sm:w-2/3 text-sm sm:text-base">{tenant.userId?.name || 'Unknown'}</span>
            </div>
            <div className="flex flex-col sm:flex-row border-b border-gray-100 pb-2">
              <span className="font-medium w-full sm:w-1/3 text-gray-600 text-sm sm:text-base">Email:</span>
              <span className="w-full sm:w-2/3 text-sm sm:text-base break-all">{tenant.userId?.email || 'No email'}</span>
            </div>
            <div className="flex flex-col sm:flex-row border-b border-gray-100 pb-2">
              <span className="font-medium w-full sm:w-1/3 text-gray-600 text-sm sm:text-base">Lease Start:</span>
              <span className="w-full sm:w-2/3 text-sm sm:text-base">{tenant.leaseStart ? new Date(tenant.leaseStart).toLocaleDateString() : 'Not set'}</span>
            </div>
            <div className="flex flex-col sm:flex-row border-b border-gray-100 pb-2">
              <span className="font-medium w-full sm:w-1/3 text-gray-600 text-sm sm:text-base">Lease End:</span>
              <span className="w-full sm:w-2/3 text-sm sm:text-base">{tenant.leaseEnd ? new Date(tenant.leaseEnd).toLocaleDateString() : 'Not set'}</span>
            </div>
            <div className="flex flex-col sm:flex-row">
              <span className="font-medium w-full sm:w-1/3 text-gray-600 text-sm sm:text-base">Monthly Rent:</span>
              <span className="w-full sm:w-2/3 font-semibold flex items-center text-sm sm:text-base">
                <BanknoteIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-gray-600" />
                KSh {typeof tenant.rentAmount === 'number' ? tenant.rentAmount.toLocaleString('en-KE') : '0'}
              </span>
            </div>
          </div>
        </ResponsiveCard>

        {/* Property Information */}
        <ResponsiveCard title="Property Information">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex flex-col sm:flex-row border-b border-gray-100 pb-2">
              <span className="font-medium w-full sm:w-1/3 text-gray-600 text-sm sm:text-base">Title:</span>
              <span className="w-full sm:w-2/3 text-sm sm:text-base">{tenant.propertyId?.title || 'Unknown'}</span>
            </div>
            <div className="flex flex-col sm:flex-row border-b border-gray-100 pb-2">
              <span className="font-medium w-full sm:w-1/3 text-gray-600 text-sm sm:text-base">Location:</span>
              <span className="w-full sm:w-2/3 text-sm sm:text-base">{tenant.propertyId?.location || 'Unknown'}</span>
            </div>
            <div className="flex flex-col sm:flex-row border-b border-gray-100 pb-2">
              <span className="font-medium w-full sm:w-1/3 text-gray-600 text-sm sm:text-base">Type:</span>
              <span className="w-full sm:w-2/3 text-sm sm:text-base">{tenant.propertyId?.type || 'Unknown'}</span>
            </div>
            <div className="flex flex-col sm:flex-row">
              <span className="font-medium w-full sm:w-1/3 text-gray-600 text-sm sm:text-base">Price:</span>
              <span className="w-full sm:w-2/3 flex items-center text-sm sm:text-base">
                <BanknoteIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-gray-600" />
                KSh {tenant.propertyId?.price ? tenant.propertyId.price.toLocaleString('en-KE') : '0'}
              </span>
            </div>
          </div>
          {tenant.propertyId?.image && Array.isArray(tenant.propertyId.image) && tenant.propertyId.image.length > 0 && (
            <div className="mt-3 sm:mt-4">
              <img 
                src={tenant.propertyId.image[0]} 
                alt={tenant.propertyId?.title || 'Property'} 
                className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-md"
              />
            </div>
          )}
        </ResponsiveCard>
      </div>

      {/* Payment History */}
      <ResponsiveCard 
        title="Payment History" 
        className="mt-4 sm:mt-6 md:mt-8"
      >
        {tenant.paymentHistory && tenant.paymentHistory.length > 0 ? (
          <ResponsiveTable
            columns={[
              {
                header: 'Date',
                accessor: 'date',
                render: (payment) => payment.date ? new Date(payment.date).toLocaleDateString() : 'Unknown date'
              },
              {
                header: 'Amount',
                accessor: 'amount',
                render: (payment) => (
                  <div className="flex items-center">
                    <BanknoteIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-gray-600" />
                    KSh {typeof payment.amount === 'number' ? payment.amount.toLocaleString('en-KE') : '0'}
                  </div>
                )
              },
              {
                header: 'Method',
                accessor: 'method',
                render: (payment) => <span className="capitalize">{payment.method}</span>
              },
              {
                header: 'Status',
                accessor: 'status',
                render: (payment) => (
                  <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {payment.status}
                  </span>
                )
              },
              {
                header: 'Notes',
                accessor: 'notes',
                render: (payment) => payment.notes || '-'
              }
            ]}
            data={tenant.paymentHistory}
            emptyMessage="No payment history available."
          />
        ) : (
          <p className="text-sm sm:text-base text-gray-500">No payment history available.</p>
        )}
      </ResponsiveCard>
    </PageWrapper>
  );
};

export default TenantDetail;