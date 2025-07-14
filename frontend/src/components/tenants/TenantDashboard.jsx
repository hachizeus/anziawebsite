import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { callApi } from '../../utils/apiClient';
import { XCircle, Loader } from '../utils/icons.jsx';

const TenantDocuments = ({ tenantId }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // No need for refs or message listeners with XHR approach
  
  const handleUploadSignedDocument = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setUploading(true);
      
      // Create FormData to send the file directly to the server
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', `Signed: ${file.name}`);
      formData.append('tenantId', tenantId);
      formData.append('description', 'Signed document uploaded by tenant');
      
      // Get the token for authentication
      const token = localStorage.getItem('token');
      
      // Use direct XHR instead of fetch or axios to avoid CORS issues
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://real-estate-backend-vybd.onrender.com/api/documents/signed');
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      
      // Set up event handlers
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          alert('Document uploaded successfully!');
          fetchDocuments();
        } else {
          alert(`Upload failed: ${xhr.statusText}`);
        }
        setUploading(false);
      };
      
      xhr.onerror = function() {
        alert('Network error occurred');
        setUploading(false);
      };
      
      xhr.timeout = 30000; // 30 seconds timeout
      xhr.ontimeout = function() {
        alert('Request timed out');
        setUploading(false);
      };
      
      // Send the request
      xhr.send(formData);
      
    } catch (error) {
      console.error('Error preparing document upload:', error);
      alert('Error preparing document upload: ' + error.message);
      setUploading(false);
    }
  };
  
  const fetchDocuments = async () => {
    try {
      // Use our improved API client utility
      const data = await callApi('get', `/api/documents?tenantId=${tenantId}`, null, {
        timeout: 10000
      });
      
      console.log('Tenant documents response:', data);
      // Handle both array and object responses
      setDocuments(Array.isArray(data) ? data : data.documents || []);
    } catch (error) {
      console.error('Error fetching documents:', error.message);
      // Continue with locally stored documents only
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tenantId) {
      fetchDocuments();
    }
  }, [tenantId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Documents</h2>
        <div className="animate-pulse">Loading documents...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* No iframe needed with XHR approach */}
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Documents</h2>
        <div>
          <input 
            type="file" 
            id="signedDocUpload" 
            className="hidden" 
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={handleUploadSignedDocument}
          />
          <label 
            htmlFor="signedDocUpload" 
            className={`bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm cursor-pointer inline-block ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload Signed Document'}
          </label>
        </div>
      </div>
      {documents.length > 0 ? (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc._id} className="border rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {doc.title}
                  </h3>
                  {doc.description && (
                    <p className="text-sm text-gray-600 mt-1">{doc.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Uploaded: {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    View
                  </a>
                  <button
                    onClick={() => {
                      const anchor = document.createElement('a');
                      anchor.href = doc.fileUrl;
                      anchor.download = doc.title || 'document';
                      document.body.appendChild(anchor);
                      anchor.click();
                      document.body.removeChild(anchor);
                    }}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No documents available.</p>
      )}
    </div>
  );
};

// Maintenance Request Form Modal Component
const MaintenanceRequestModal = ({ isOpen, onClose, tenantId, property, onRequestCreated }) => {
  const [formData, setFormData] = useState({
    propertyId: property?._id || '',
    title: '',
    description: '',
    priority: 'medium',
    category: 'other',
    location: '',
    availableTimes: '',
    images: []
  });
  
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    // Update propertyId when property changes
    if (property?._id) {
      setFormData(prev => ({
        ...prev,
        propertyId: property._id
      }));
    }
  }, [property]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length > 5) {
      alert('You can upload a maximum of 5 images');
      return;
    }
    
    // Check file sizes
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024); // 5MB
    if (oversizedFiles.length > 0) {
      alert('Some files exceed the 5MB size limit');
      return;
    }
    
    setLoading(true);
    
    try {
      // Use direct XHR instead of fetch or axios to avoid CORS issues
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });
      
      // Get the token for authentication
      const token = localStorage.getItem('token');
      
      // Use direct XHR instead of fetch or axios
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://real-estate-backend-vybd.onrender.com/api/upload/images');
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      
      // Set up event handlers
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          if (response.imageUrls) {
            setFormData(prev => ({
              ...prev,
              images: [...prev.images, ...response.imageUrls]
            }));
            alert('Images uploaded successfully');
          }
        } else {
          alert(`Upload failed: ${xhr.statusText}`);
        }
        setLoading(false);
      };
      
      xhr.onerror = function() {
        alert('Network error occurred');
        setLoading(false);
      };
      
      xhr.timeout = 30000; // 30 seconds timeout
      xhr.ontimeout = function() {
        alert('Request timed out');
        setLoading(false);
      };
      
      // Send the request
      xhr.send(formData);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert('Failed to upload images');
      setLoading(false);
    }
  };
  
  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.propertyId) {
      alert('Please select a property');
      return;
    }
    
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }
    
    if (!formData.description.trim()) {
      alert('Please enter a description');
      return;
    }
    
    if (!formData.location.trim()) {
      alert('Please specify the location within the property');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Use direct XHR instead of fetch or axios
      const token = localStorage.getItem('token');
      
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://real-estate-backend-vybd.onrender.com/api/maintenance');
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          alert('Maintenance request submitted successfully');
          if (onRequestCreated && response.maintenanceRequest) {
            onRequestCreated(response.maintenanceRequest);
          }
          onClose();
        } else {
          console.error('Error submitting maintenance request:', xhr.statusText);
          alert(`Failed to submit maintenance request: ${xhr.statusText}`);
        }
        setSubmitting(false);
      };
      
      xhr.onerror = function() {
        console.error('Network error occurred');
        alert('Network error occurred');
        setSubmitting(false);
      };
      
      xhr.send(JSON.stringify(formData));
    } catch (error) {
      console.error('Error submitting maintenance request:', error);
      alert(error.message || 'Failed to submit maintenance request');
      setSubmitting(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Submit Maintenance Request</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Property Selection - Auto-selected */}
            <div>
              <label htmlFor="propertyId" className="block text-sm font-medium text-gray-700 mb-1">
                Property
              </label>
              <input
                type="text"
                value={property?.title ? `${property.title} - ${property.location}` : 'Loading property...'}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-900"
                disabled
              />
              <input type="hidden" name="propertyId" value={formData.propertyId} />
            </div>
            
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Brief description of the issue"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
                required
              />
            </div>
            
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Detailed description of the issue"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
                required
              />
            </div>
            
            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location in Property
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Kitchen, Bathroom, Bedroom"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
                required
              />
            </div>
            
            {/* Priority and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
                >
                  <option value="plumbing">Plumbing</option>
                  <option value="electrical">Electrical</option>
                  <option value="appliance">Appliance</option>
                  <option value="heating">Heating</option>
                  <option value="cooling">Cooling</option>
                  <option value="structural">Structural</option>
                  <option value="pest">Pest Control</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            {/* Available Times */}
            <div>
              <label htmlFor="availableTimes" className="block text-sm font-medium text-gray-700 mb-1">
                Available Times for Inspection/Repair
              </label>
              <input
                type="text"
                id="availableTimes"
                name="availableTimes"
                value={formData.availableTimes}
                onChange={handleChange}
                placeholder="e.g., Weekdays after 5pm, Weekends anytime"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
              />
            </div>
            
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Images (Max 5)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
                disabled={formData.images.length >= 5 || loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Max 5 images, 5MB each. Supported formats: JPG, PNG, GIF
              </p>
              
              {/* Image Preview */}
              {formData.images.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="h-24 w-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center justify-center"
              >
                {submitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const TenantDashboard = () => {
  const { user } = useAuth();
  const [tenantData, setTenantData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false);
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [comment, setComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchTenantData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required. Please log in.');
          setLoading(false);
          return;
        }

        console.log('Fetching tenant data for dashboard...', token);
        const data = await callApi('get', '/api/tenants/user', null, {
          timeout: 10000
        });
        
        console.log('Tenant data response:', data);
        setTenantData(data);
      } catch (err) {
        console.error('Error fetching tenant data:', err.message);
        if (err.message.includes('403')) {
          setError('Access denied. You do not have tenant privileges.');
        } else {
          setError('Failed to load tenant information: ' + err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTenantData();
  }, []);
  
  // Close maintenance modal when tenant data changes
  useEffect(() => {
    if (showMaintenanceModal && !tenantData) {
      setShowMaintenanceModal(false);
    }
  }, [tenantData, showMaintenanceModal]);
  
  // Function to add a comment to a maintenance request
  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!comment.trim() || !selectedRequest) return;
    
    setSubmittingComment(true);
    
    try {
      // Use direct XHR instead of fetch or axios
      const token = localStorage.getItem('token');
      
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `https://real-estate-backend-vybd.onrender.com/api/maintenance/${selectedRequest._id}/comments`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.setRequestHeader('Content-Type', 'application/json');
      
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          // Refresh request details to show new comment
          fetchRequestDetails(selectedRequest._id);
          setComment('');
        } else {
          console.error('Error adding comment:', xhr.statusText);
          alert(`Failed to add comment: ${xhr.statusText}`);
        }
        setSubmittingComment(false);
      };
      
      xhr.onerror = function() {
        console.error('Network error occurred');
        alert('Network error occurred');
        setSubmittingComment(false);
      };
      
      xhr.send(JSON.stringify({ text: comment }));
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
      setSubmittingComment(false);
    }
  };
  
  // Function to fetch maintenance request details
  const fetchRequestDetails = async (requestId) => {
    try {
      // Use direct XHR instead of callApi
      const token = localStorage.getItem('token');
      
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `https://real-estate-backend-vybd.onrender.com/api/maintenance/${requestId}`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          if (response.maintenanceRequest) {
            setSelectedRequest(response.maintenanceRequest);
          }
        } else {
          console.error('Error fetching maintenance request details:', xhr.statusText);
          alert('Failed to load request details');
        }
      };
      
      xhr.onerror = function() {
        console.error('Network error occurred');
        alert('Network error occurred');
      };
      
      xhr.send();
    } catch (error) {
      console.error('Error fetching maintenance request details:', error);
      alert('Failed to load request details');
    }
  };
  
  // Function to fetch all maintenance requests
  const fetchMaintenanceRequests = async () => {
    if (!user) return;
    
    try {
      // Use direct XHR instead of callApi
      const token = localStorage.getItem('token');
      
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://real-estate-backend-vybd.onrender.com/api/maintenance/tenant');
      console.log('Fetching maintenance requests with token:', token.substring(0, 20) + '...');
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          const response = JSON.parse(xhr.responseText);
          if (response.maintenanceRequests) {
            setMaintenanceRequests(response.maintenanceRequests);
          }
        } else {
          console.error('Error fetching maintenance requests:', xhr.statusText);
        }
      };
      
      xhr.onerror = function() {
        console.error('Network error occurred while fetching maintenance requests');
      };
      
      xhr.send();
    } catch (error) {
      console.error('Error fetching maintenance requests:', error);
    }
  };
  
  // Fetch maintenance requests on component mount
  useEffect(() => {
    fetchMaintenanceRequests();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 pb-12 container mx-auto px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  if (!tenantData || !tenantData.tenant) {
    return (
      <div className="pt-24 pb-12 container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">Tenant Dashboard</h1>
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <p className="text-yellow-700">No tenant information found. Please contact property management.</p>
        </div>
      </div>
    );
  }

  const { tenant, property } = tenantData;

  return (
    <div className="pt-24 pb-12 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Tenant Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Tenant Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Tenant Information</h2>
            <div className="space-y-3">
              <div className="flex border-b border-gray-100 pb-2">
                <span className="font-medium w-1/3 text-gray-600">Name:</span>
                <span className="w-2/3">{user?.name}</span>
              </div>
              <div className="flex border-b border-gray-100 pb-2">
                <span className="font-medium w-1/3 text-gray-600">Email:</span>
                <span className="w-2/3">{user?.email}</span>
              </div>
              <div className="flex border-b border-gray-100 pb-2">
                <span className="font-medium w-1/3 text-gray-600">Lease Start:</span>
                <span className="w-2/3">{new Date(tenant.leaseStart).toLocaleDateString()}</span>
              </div>
              <div className="flex border-b border-gray-100 pb-2">
                <span className="font-medium w-1/3 text-gray-600">Lease End:</span>
                <span className="w-2/3">{new Date(tenant.leaseEnd).toLocaleDateString()}</span>
              </div>
              <div className="flex">
                <span className="font-medium w-1/3 text-gray-600">Monthly Rent:</span>
                <span className="w-2/3 font-semibold">KSh {tenant.rentAmount ? tenant.rentAmount.toLocaleString('en-KE') : '0'}</span>
              </div>
            </div>
          </div>

          {/* Property Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Property Information</h2>
            {property && property._id && property._id !== '000000000000000000000000' ? (
              <div>
                <div className="mb-4">
                  <h3 className="font-semibold text-lg">{property.title}</h3>
                  <p className="text-gray-600">{property.location}</p>
                </div>
                
                {property.image && Array.isArray(property.image) && property.image.length > 0 ? (
                  <img 
                    src={property.image[0]} 
                    alt={property.title} 
                    className="w-full h-48 object-cover rounded-md"
                  />
                ) : property.image && typeof property.image === 'string' ? (
                  <img 
                    src={property.image} 
                    alt={property.title} 
                    className="w-full h-48 object-cover rounded-md"
                  />
                ) : null}
                
                {property.description && (
                  <p className="mt-3 text-gray-700 text-sm">{property.description}</p>
                )}
              </div>
            ) : (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="text-yellow-700">No property has been assigned to you yet. Please contact property management.</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Payment History</h2>
          {tenant.paymentHistory && tenant.paymentHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-2 px-4 border-b text-left">Date</th>
                    <th className="py-2 px-4 border-b text-left">Amount</th>
                    <th className="py-2 px-4 border-b text-left">Method</th>
                    <th className="py-2 px-4 border-b text-left">Status</th>
                    <th className="py-2 px-4 border-b text-left">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {tenant.paymentHistory.map((payment, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-2 px-4 border-b">{new Date(payment.date).toLocaleDateString()}</td>
                      <td className="py-2 px-4 border-b">KSh {payment.amount.toLocaleString('en-KE')}</td>
                      <td className="py-2 px-4 border-b capitalize">{payment.method}</td>
                      <td className="py-2 px-4 border-b">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="py-2 px-4 border-b">{payment.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No payment history available.</p>
          )}
        </div>

        {/* Maintenance Requests */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Maintenance Requests</h2>
            <button 
              onClick={() => setShowMaintenanceModal(true)} 
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded inline-block"
            >
              New Request
            </button>
          </div>
          <p className="mb-4">Need repairs or have maintenance issues? Submit and track your maintenance requests.</p>
          
          {/* Maintenance Requests List */}
          <div className="mt-6">
            {maintenanceRequests.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-2 px-4 border-b text-left">Title</th>
                      <th className="py-2 px-4 border-b text-left">Status</th>
                      <th className="py-2 px-4 border-b text-left">Priority</th>
                      <th className="py-2 px-4 border-b text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {maintenanceRequests.map((request) => (
                      <tr 
                        key={request._id} 
                        className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer" 
                        onClick={() => fetchRequestDetails(request._id)}
                      >
                        <td className="py-2 px-4 border-b">
                          <div className="font-medium">{request.title}</div>
                          <div className="text-sm text-gray-500">{request.location}</div>
                        </td>
                        <td className="py-2 px-4 border-b">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            request.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                            request.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-2 px-4 border-b">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            request.priority === 'low' ? 'bg-green-100 text-green-800' : 
                            request.priority === 'medium' ? 'bg-blue-100 text-blue-800' : 
                            request.priority === 'high' ? 'bg-orange-100 text-orange-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                          </span>
                        </td>
                        <td className="py-2 px-4 border-b">{new Date(request.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No maintenance requests found. Create a new request to get started.</p>
            )}
          </div>
        </div>
        
        {/* Documents */}
        <TenantDocuments tenantId={tenant._id} />
        
        {/* Maintenance Request Modal */}
        <MaintenanceRequestModal 
          isOpen={showMaintenanceModal} 
          onClose={() => setShowMaintenanceModal(false)} 
          tenantId={tenant._id}
          property={property}
          onRequestCreated={(newRequest) => {
            setMaintenanceRequests(prev => [newRequest, ...prev]);
          }}
        />
        
        {/* Maintenance Request Detail Modal */}
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
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          selectedRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          selectedRequest.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
                          selectedRequest.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-500 w-24">Priority:</span>
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          selectedRequest.priority === 'low' ? 'bg-green-100 text-green-800' : 
                          selectedRequest.priority === 'medium' ? 'bg-blue-100 text-blue-800' : 
                          selectedRequest.priority === 'high' ? 'bg-orange-100 text-orange-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {selectedRequest.priority.charAt(0).toUpperCase() + selectedRequest.priority.slice(1)}
                        </span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Submitted On:</span>
                        <p className="mt-1 text-gray-900">
                          {new Date(selectedRequest.createdAt).toLocaleDateString()} at {new Date(selectedRequest.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      {selectedRequest.assignedTo && (
                        <div>
                          <span className="text-sm font-medium text-gray-500">Assigned To:</span>
                          <p className="mt-1 text-gray-900">
                            {selectedRequest.assignedTo.name || 'Not assigned'}
                          </p>
                        </div>
                      )}
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
                  
                  {/* Add Comment Form */}
                  <form onSubmit={handleAddComment} className="mt-6">
                    <div className="mb-4">
                      <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                        Add a Comment
                      </label>
                      <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900"
                        placeholder="Enter your comment here..."
                        required
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={submittingComment}
                        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center justify-center text-sm"
                      >
                        {submittingComment ? (
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantDashboard;


