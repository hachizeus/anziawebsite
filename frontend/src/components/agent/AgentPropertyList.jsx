import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Edit, Trash2, Eye, EyeOff, AlertCircle } from '../../utils/realIcons';
import AgentPropertyForm from './AgentPropertyForm';

const AgentPropertyList = ({ properties, loading, onPropertyUpdated, onPropertyDeleted }) => {
  const [editingProperty, setEditingProperty] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [currency, setCurrency] = useState('KSH');
  const [localProperties, setLocalProperties] = useState([]);
  
  // Get currency from localStorage or use KSH as default
  useEffect(() => {
    const savedCurrency = localStorage.getItem('agentCurrency');
    if (savedCurrency) {
      setCurrency(savedCurrency);
    }
    
    // Initialize local properties
    setLocalProperties(properties);
  }, [properties]);

  const handleEdit = (property) => {
    setEditingProperty(property);
  };

  const handleCancelEdit = () => {
    setEditingProperty(null);
  };

  const handleUpdate = (updatedProperty) => {
    // Update local state
    setLocalProperties(prevProps => 
      prevProps.map(p => p._id === updatedProperty._id ? updatedProperty : p)
    );
    onPropertyUpdated(updatedProperty);
    setEditingProperty(null);
  };

  const confirmDelete = (property) => {
    setPropertyToDelete(property);
    setIsDeleting(true);
  };

  const cancelDelete = () => {
    setPropertyToDelete(null);
    setIsDeleting(false);
  };

  const handleDelete = async () => {
    if (!propertyToDelete) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/agents/properties/${propertyToDelete._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update local state
      setLocalProperties(prevProps => 
        prevProps.filter(p => p._id !== propertyToDelete._id)
      );
      onPropertyDeleted(propertyToDelete._id);
      setIsDeleting(false);
      setPropertyToDelete(null);
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Failed to delete property');
    }
  };

  const handleToggleVisibility = (property) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    const token = localStorage.getItem('token');
    
    // Create a local copy with toggled visibility for immediate feedback
    const updatedLocalProperty = { ...property, visible: !property.visible };
    
    // Update local state immediately for responsive UI
    setLocalProperties(prevProps => 
      prevProps.map(p => p._id === property._id ? updatedLocalProperty : p)
    );
    
    // Make the API call to the actual endpoint
    axios.put(
      `${backendUrl}/api/agents/properties/${property._id}/toggle-visibility`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(response => {
      if (response.data.success) {
        const updatedProperty = response.data.property;
        // Update with server response
        setLocalProperties(prevProps => 
          prevProps.map(p => p._id === property._id ? updatedProperty : p)
        );
        onPropertyUpdated(updatedProperty);
      } else {
        // Revert the local change if the server request failed
        setLocalProperties(prevProps => 
          prevProps.map(p => p._id === property._id ? property : p)
        );
        toast.error('Failed to update visibility');
      }
    })
    .catch(() => {
      // Revert the local change if the request failed
      setLocalProperties(prevProps => 
        prevProps.map(p => p._id === property._id ? property : p)
      );
      toast.error('Failed to update visibility');
    });
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

  if (editingProperty) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold dark:text-white">Edit Property</h2>
          <button 
            onClick={handleCancelEdit}
            className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
          >
            Cancel
          </button>
        </div>
        <AgentPropertyForm 
          property={editingProperty} 
          onPropertyCreated={handleUpdate}
          isEditing={true}
        />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6 dark:text-white">My Properties</h2>
      
      {localProperties.length === 0 ? (
        <div className="text-center py-10">
          <div className="mb-4 flex justify-center">
            <AlertCircle className="w-12 h-12 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No properties found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">You haven&apos;t created any property listings yet.</p>
          <button
            onClick={() => document.querySelector('button[data-tab="add"]').click()}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Create Your First Listing
          </button>
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
                  Location
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {localProperties.map((property) => (
                <tr key={property._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        {property.image && property.image[0] ? (
                          <img 
                            className="h-10 w-10 rounded-md object-cover" 
                            src={property.image[0]} 
                            alt={property.title}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<div class="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold">IMG</div>';
                            }}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-bold">
                            IMG
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{property.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{property.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-200">{property.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-200">{currency} {property.price.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${property.availability === 'available' ? 'bg-green-100 text-green-800' : 
                        property.availability === 'sold' ? 'bg-red-100 text-red-800' : 
                        property.availability === 'rented' ? 'bg-blue-100 text-blue-800' : 
                        property.availability === 'booked' ? 'bg-purple-100 text-purple-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {property.availability}
                    </span>
                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${property.purpose === 'sale' ? 'bg-indigo-100 text-indigo-800' : 
                        property.purpose === 'rent' ? 'bg-pink-100 text-pink-800' : 
                        property.purpose === 'lease' ? 'bg-amber-100 text-amber-800' : 
                        'bg-cyan-100 text-cyan-800'}`}>
                      {property.purpose === 'sale' ? 'For Sale' :
                       property.purpose === 'rent' ? 'For Rent' :
                       property.purpose === 'lease' ? 'For Lease' :
                       'For Booking'}
                    </span>
                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${property.visible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {property.visible ? 'Visible' : 'Hidden'}
                    </span>
                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${property.approvalStatus === 'approved' ? 'bg-green-100 text-green-800' : 
                        property.approvalStatus === 'rejected' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {property.approvalStatus === 'approved' ? 'Approved' : 
                       property.approvalStatus === 'rejected' ? 'Rejected' : 
                       'Pending Approval'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {property.approvalStatus === 'rejected' && property.approvalNotes && (
                      <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-md text-xs text-red-700">
                        <p className="font-semibold">Rejection reason:</p>
                        <p>{property.approvalNotes}</p>
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          handleToggleVisibility(property);
                        }}
                        className={`p-2 bg-white/90 dark:bg-gray-700/90 backdrop-blur-sm ${
                          property.visible 
                            ? 'text-green-600 hover:bg-green-600' 
                            : 'text-gray-600 hover:bg-gray-600'
                        } rounded-full hover:text-white transition-all`}
                        title={property.visible ? 'Hide property' : 'Show property'}
                      >
                        {property.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => handleEdit(property)} 
                        className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-primary-600 rounded-full hover:bg-primary-600 hover:text-white transition-all"
                        title="Edit property"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => confirmDelete(property)} 
                        className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all"
                        title="Delete property"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {isDeleting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Confirm Deletion</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to delete &quot;{propertyToDelete?.title}&quot;? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add prop types validation
AgentPropertyList.propTypes = {
  properties: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  onPropertyUpdated: PropTypes.func.isRequired,
  onPropertyDeleted: PropTypes.func.isRequired
};

export default AgentPropertyList;

