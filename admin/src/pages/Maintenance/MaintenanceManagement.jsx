import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Loader, 
  Search, 
  Filter, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  XCircle,
  User,
  Home,
  Calendar,
  MessageSquare
} from 'lucide-react';
import { backendurl } from '../../App';

const MaintenanceManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [assignedTo, setAssignedTo] = useState('');
  const [agents, setAgents] = useState([]);
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState('');

  // Fetch maintenance requests from the real API endpoint
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Use direct XHR instead of axios
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://real-estate-backend-vybd.onrender.com/api/maintenance');
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          setRequests(response.maintenanceRequests || []);
          setError(null);
        } else {
          console.error('Error fetching maintenance requests:', xhr.statusText);
          setError('Failed to load maintenance requests');
        }
        setLoading(false);
      };
      
      xhr.onerror = function() {
        console.error('Network error occurred');
        setError('Network error. Please check your connection.');
        setLoading(false);
      };
      
      xhr.send();
    } catch (err) {
      console.error('Error fetching maintenance requests:', err);
      setError('Failed to load maintenance requests');
      setLoading(false);
    }
  };

  // Fetch agents for assignment
  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Use direct XHR instead of axios
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://real-estate-backend-vybd.onrender.com/api/agents/all');
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          setAgents(response.agents || []);
        } else {
          console.error('Error fetching agents:', xhr.statusText);
        }
      };
      
      xhr.onerror = function() {
        console.error('Network error occurred while fetching agents');
      };
      
      xhr.send();
    } catch (err) {
      console.error('Error fetching agents:', err);
    }
  };

  useEffect(() => {
    fetchRequests();
    fetchAgents();
  }, []);

  // Filter requests
  const filteredRequests = requests.filter(request => {
    // Apply status filter
    if (filter !== 'all' && request.status !== filter) {
      return false;
    }
    
    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        request.title.toLowerCase().includes(searchLower) ||
        request.description.toLowerCase().includes(searchLower) ||
        request.location.toLowerCase().includes(searchLower) ||
        (request.tenant?.name && request.tenant.name.toLowerCase().includes(searchLower)) ||
        (request.property?.title && request.property.title.toLowerCase().includes(searchLower))
      );
    }
    
    return true;
  });

  // Fetch CSRF token
  const fetchCsrfToken = async () => {
    return new Promise((resolve, reject) => {
      try {
        const token = localStorage.getItem('token');
        
        // Use direct XHR instead of axios
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://real-estate-backend-vybd.onrender.com/api/auth/csrf-token');
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        
        xhr.onload = function() {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText);
            resolve(response.csrfToken || '');
          } else {
            console.error('Error fetching CSRF token:', xhr.statusText);
            resolve('');
          }
        };
        
        xhr.onerror = function() {
          console.error('Network error occurred while fetching CSRF token');
          resolve('');
        };
        
        xhr.send();
      } catch (err) {
        console.error('Error fetching CSRF token:', err);
        resolve('');
      }
    });
  };

  // Update request status
  const updateRequestStatus = async (e) => {
    e.preventDefault();
    
    if (!selectedRequest) return;
    
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      
      const updateData = {
        status: e.target.status.value
      };
      
      // Add comment if provided
      if (comment.trim()) {
        updateData.comment = comment;
      }
      
      // Add assigned agent if provided
      if (assignedTo) {
        updateData.assignedTo = assignedTo;
      }
      
      // Add estimated completion date if provided
      if (estimatedCompletionDate) {
        updateData.estimatedCompletionDate = estimatedCompletionDate;
      }
      
      // Use direct XHR instead of axios
      const csrfToken = await fetchCsrfToken();
      
      const xhr = new XMLHttpRequest();
      xhr.open('PUT', `https://real-estate-backend-vybd.onrender.com/api/maintenance/${selectedRequest._id}/status`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      if (csrfToken) {
        xhr.setRequestHeader('X-CSRF-Token', csrfToken);
      }
      
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          // Refresh requests
          fetchRequests();
          
          // Reset form
          setComment('');
          setAssignedTo('');
          setEstimatedCompletionDate('');
          setSelectedRequest(null);
        } else {
          console.error('Error updating maintenance request:', xhr.statusText);
          alert('Failed to update maintenance request');
        }
        setSubmitting(false);
      };
      
      xhr.onerror = function() {
        console.error('Network error occurred');
        alert('Network error. Please check your connection.');
        setSubmitting(false);
      };
      
      xhr.send(JSON.stringify(updateData));
    } catch (err) {
      console.error('Error updating maintenance request:', err);
      alert('Failed to update maintenance request');
      setSubmitting(false);
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get priority badge class
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'emergency':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in-progress':
        return <Loader className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading maintenance requests...</p>
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Maintenance Requests</h1>
            <p className="text-gray-600">Manage and respond to tenant maintenance requests</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Requests</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          {error ? (
            <div className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Requests</h3>
              <p className="text-gray-500 mb-4">{error}</p>
              <button
                onClick={fetchRequests}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No maintenance requests found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Request
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tenant
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRequests.map((request) => (
                    <tr key={request._id} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{request.title}</div>
                        <div className="text-sm text-gray-500">{request.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.property?.title || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{request.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.tenant?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{request.tenant?.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(request.status)}`}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1">{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadgeClass(request.priority)}`}>
                          {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedRequest(null)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedRequest.title}</h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Request Details</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Description:</span>
                      <p className="mt-1 text-gray-900">{selectedRequest.description}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Location:</span>
                      <p className="mt-1 text-gray-900">{selectedRequest.location}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Category:</span>
                      <p className="mt-1 text-gray-900">{selectedRequest.category}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Available Times:</span>
                      <p className="mt-1 text-gray-900">{selectedRequest.availableTimes || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Status Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500 w-24">Status:</span>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(selectedRequest.status)}`}>
                        {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-500 w-24">Priority:</span>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadgeClass(selectedRequest.priority)}`}>
                        {selectedRequest.priority.charAt(0).toUpperCase() + selectedRequest.priority.slice(1)}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Submitted On:</span>
                      <p className="mt-1 text-gray-900">
                        {new Date(selectedRequest.createdAt).toLocaleDateString()} at {new Date(selectedRequest.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Assigned To:</span>
                      <p className="mt-1 text-gray-900">
                        {selectedRequest.assignedTo?.name || 'Not assigned'}
                      </p>
                    </div>
                    {selectedRequest.estimatedCompletionDate && (
                      <div>
                        <span className="text-sm font-medium text-gray-500">Estimated Completion:</span>
                        <p className="mt-1 text-gray-900">
                          {new Date(selectedRequest.estimatedCompletionDate).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Images */}
              {selectedRequest.images && selectedRequest.images.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Images</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {selectedRequest.images.map((image, index) => (
                      <a 
                        key={index} 
                        href={image} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <img 
                          src={image} 
                          alt={`Maintenance request ${index + 1}`} 
                          className="h-32 w-full object-cover rounded-md hover:opacity-80 transition-all"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Comments</h3>
                {selectedRequest.comments && selectedRequest.comments.length > 0 ? (
                  <div className="space-y-4">
                    {selectedRequest.comments.map((comment, index) => (
                      <div 
                        key={index} 
                        className="bg-gray-50 p-4 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="font-medium text-gray-900">
                            {comment.user?.name || 'Unknown User'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()} at {new Date(comment.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                        <p className="text-gray-800 whitespace-pre-line">
                          {comment.text}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No comments yet.</p>
                )}
              </div>

              {/* Update Form */}
              <form onSubmit={updateRequestStatus}>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Update Request</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      defaultValue={selectedRequest.status}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
                      Assign To
                    </label>
                    <select
                      id="assignedTo"
                      name="assignedTo"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select Agent</option>
                      {agents.map((agent) => (
                        <option key={agent._id} value={agent._id}>
                          {agent.name || agent.email}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="estimatedCompletionDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Completion Date
                  </label>
                  <input
                    type="date"
                    id="estimatedCompletionDate"
                    name="estimatedCompletionDate"
                    value={estimatedCompletionDate}
                    onChange={(e) => setEstimatedCompletionDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                    Add Comment
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your comment here..."
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setSelectedRequest(null)}
                    className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {submitting ? 'Updating...' : 'Update Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default MaintenanceManagement;