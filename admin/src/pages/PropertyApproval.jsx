import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Check, X, AlertCircle, Eye } from 'lucide-react';

const PropertyApprovalList = () => {
  const [pendingProperties, setPendingProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [approvalAction, setApprovalAction] = useState(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPendingProperties();
  }, []);

  const fetchPendingProperties = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin-property/pending-properties`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setPendingProperties(response.data.properties);
      } else {
        toast.error('Failed to fetch pending properties');
      }
    } catch (error) {
      console.error('Error fetching pending properties:', error);
      toast.error('Error fetching pending properties');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalAction = (property, action) => {
    setSelectedProperty(property);
    setApprovalAction(action);
    setApprovalNotes('');
    setShowModal(true);
  };

  const handleViewProperty = (property) => {
    // Open property in a new tab
    window.open(`/explore/property/${property._id}`, '_blank');
  };

  const submitApprovalAction = async () => {
    if (!selectedProperty || !approvalAction) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin-property/property-approval`,
        {
          propertyId: selectedProperty._id,
          action: approvalAction,
          notes: approvalNotes
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success(`Property ${approvalAction === 'approve' ? 'approved' : 'rejected'} successfully`);
        // Remove the property from the list
        setPendingProperties(prevProps => 
          prevProps.filter(p => p._id !== selectedProperty._id)
        );
        setShowModal(false);
      } else {
        toast.error(`Failed to ${approvalAction} property`);
      }
    } catch (error) {
      console.error(`Error ${approvalAction}ing property:`, error);
      toast.error(`Error ${approvalAction}ing property`);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6 dark:text-white">Property Approval Queue</h2>
      
      {pendingProperties.length === 0 ? (
        <div className="text-center py-10">
          <div className="mb-4 flex justify-center">
            <Check className="w-12 h-12 text-green-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No pending properties</h3>
          <p className="text-gray-500 dark:text-gray-400">All properties have been reviewed.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitted
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {pendingProperties.map((property) => (
                <tr key={property._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img 
                          className="h-10 w-10 rounded-md object-cover" 
                          src={property.image[0] || '/images/property-placeholder.jpg'} 
                          alt={property.title} 
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{property.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{property.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-200">
                      {property.agentId?.userId?.name || 'Unknown Agent'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {property.agentId?.userId?.email || 'No email'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-200">{property.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-200">KSH {property.price.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-200">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(property.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleViewProperty(property)} 
                        className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all"
                        title="View property"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleApprovalAction(property, 'approve')} 
                        className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-green-600 rounded-full hover:bg-green-600 hover:text-white transition-all"
                        title="Approve property"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleApprovalAction(property, 'reject')} 
                        className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all"
                        title="Reject property"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Approval/Rejection Modal */}
      {showModal && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              {approvalAction === 'approve' ? 'Approve Property' : 'Reject Property'}
            </h3>
            
            <div className="mb-4">
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                {approvalAction === 'approve' 
                  ? 'Are you sure you want to approve this property? It will be visible to all users.'
                  : 'Please provide a reason for rejecting this property. This will be shared with the agent.'}
              </p>
              
              <div className="mt-4">
                <label htmlFor="approvalNotes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {approvalAction === 'approve' ? 'Additional notes (optional)' : 'Rejection reason'}
                </label>
                <textarea
                  id="approvalNotes"
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  required={approvalAction === 'reject'}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  rows={4}
                  placeholder={approvalAction === 'approve' 
                    ? 'Any additional notes for the agent (optional)'
                    : 'Please explain why this property is being rejected'}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={submitApprovalAction}
                disabled={approvalAction === 'reject' && !approvalNotes.trim()}
                className={`px-4 py-2 rounded-md text-white ${
                  approvalAction === 'approve' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                } ${(approvalAction === 'reject' && !approvalNotes.trim()) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {approvalAction === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyApprovalList;