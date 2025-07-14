import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { Loader } from '../utils/icons.jsx';
import { useAuth } from '../../context/AuthContext';

const MaintenanceRequestDetail = () => {
  const { requestId } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchRequestDetails();
  }, [requestId]);
  
  const fetchRequestDetails = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/api/maintenance/${requestId}`);
      setRequest(response.data.maintenanceRequest);
    } catch (error) {
      console.error('Error fetching maintenance request details:', error);
      toast.error('Failed to load request details');
      navigate('/tenant/maintenance');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const response = await api.post(`/api/maintenance/${requestId}/comments`, { text: comment });
      
      if (response.data.success) {
        toast.success('Comment added successfully');
        setComment('');
        fetchRequestDetails(); // Refresh to show new comment
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error(error.response?.data?.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };
  
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'emergency':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }
  
  if (!request) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          Request not found or you don't have permission to view it.
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 sm:mb-0">
          Maintenance Request Details
        </h2>
        
        <button
          onClick={() => navigate('/tenant/maintenance')}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-sm"
        >
          Back to List
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Request Information</h3>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Title</p>
              <p className="mt-1 text-base text-gray-900 dark:text-white">{request.title}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</p>
              <p className="mt-1 text-base text-gray-900 dark:text-white whitespace-pre-line">
                {request.description}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Location in Property</p>
              <p className="mt-1 text-base text-gray-900 dark:text-white">{request.location}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Available Times</p>
              <p className="mt-1 text-base text-gray-900 dark:text-white">
                {request.availableTimes || 'Not specified'}
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Status Information</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 w-24">Status:</p>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(request.status)}`}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
            </div>
            
            <div className="flex items-center">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 w-24">Priority:</p>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityBadgeClass(request.priority)}`}>
                {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
              </span>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</p>
              <p className="mt-1 text-base text-gray-900 dark:text-white">
                {request.category.charAt(0).toUpperCase() + request.category.slice(1)}
              </p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Submitted On</p>
              <p className="mt-1 text-base text-gray-900 dark:text-white">
                {new Date(request.createdAt).toLocaleDateString()} at {new Date(request.createdAt).toLocaleTimeString()}
              </p>
            </div>
            
            {request.assignedTo && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned To</p>
                <p className="mt-1 text-base text-gray-900 dark:text-white">
                  {request.assignedTo.name}
                </p>
              </div>
            )}
            
            {request.estimatedCompletionDate && (
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Estimated Completion</p>
                <p className="mt-1 text-base text-gray-900 dark:text-white">
                  {new Date(request.estimatedCompletionDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Images */}
      {request.images && request.images.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Images</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {request.images.map((image, index) => (
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
                  className="h-32 w-full object-cover rounded-md hover:opacity-90 transition-opacity"
                />
              </a>
            ))}
          </div>
        </div>
      )}
      
      {/* Comments */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Comments</h3>
        
        {request.comments && request.comments.length > 0 ? (
          <div className="space-y-4">
            {request.comments.map((comment, index) => (
              <div 
                key={index} 
                className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {comment.user?.name || 'Unknown User'}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString()} at {new Date(comment.createdAt).toLocaleTimeString()}
                  </div>
                </div>
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-line">
                  {comment.text}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No comments yet.</p>
        )}
        
        {/* Add Comment Form */}
        <form onSubmit={handleAddComment} className="mt-6">
          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Add a Comment
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter your comment here..."
              required
            />
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center justify-center text-sm"
            >
              {submitting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                'Add Comment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceRequestDetail;


