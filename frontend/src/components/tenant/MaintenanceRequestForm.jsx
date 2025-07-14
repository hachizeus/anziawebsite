import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { Loader } from '../utils/icons.jsx';

const MaintenanceRequestForm = () => {
  const [formData, setFormData] = useState({
    propertyId: '',
    title: '',
    description: '',
    priority: 'medium',
    category: 'other',
    location: '',
    availableTimes: '',
    images: []
  });
  
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  
  // Fetch tenant's properties
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/tenants/properties');
        setProperties(response.data.properties || []);
        
        // Set default property if there's only one
        if (response.data.properties?.length === 1) {
          setFormData(prev => ({
            ...prev,
            propertyId: response.data.properties[0]._id
          }));
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
        toast.error('Failed to load properties');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, []);
  
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
      toast.warning('You can upload a maximum of 5 images');
      return;
    }
    
    // Check file sizes
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024); // 5MB
    if (oversizedFiles.length > 0) {
      toast.warning('Some files exceed the 5MB size limit');
      return;
    }
    
    setLoading(true);
    
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });
      
      const response = await api.post('/api/upload/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, ...response.data.imageUrls]
        }));
        toast.success('Images uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
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
      toast.error('Please select a property');
      return;
    }
    
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Please enter a description');
      return;
    }
    
    if (!formData.location.trim()) {
      toast.error('Please specify the location within the property');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const response = await api.post('/api/maintenance', formData);
      
      if (response.data.success) {
        toast.success('Maintenance request submitted successfully');
        navigate('/tenant/maintenance');
      }
    } catch (error) {
      console.error('Error submitting maintenance request:', error);
      toast.error(error.response?.data?.message || 'Failed to submit maintenance request');
    } finally {
      setSubmitting(false);
    }
  };
  
  if (loading && properties.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Submit Maintenance Request</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Property Selection */}
        <div>
          <label htmlFor="propertyId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Property
          </label>
          <select
            id="propertyId"
            name="propertyId"
            value={formData.propertyId}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          >
            <option value="">Select a property</option>
            {properties.map(property => (
              <option key={property._id} value={property._id}>
                {property.title} - {property.location}
              </option>
            ))}
          </select>
        </div>
        
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Brief description of the issue"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>
        
        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Detailed description of the issue"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>
        
        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location in Property
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Kitchen, Bathroom, Bedroom"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            required
          />
        </div>
        
        {/* Priority and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
          <label htmlFor="availableTimes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Available Times for Inspection/Repair
          </label>
          <input
            type="text"
            id="availableTimes"
            name="availableTimes"
            value={formData.availableTimes}
            onChange={handleChange}
            placeholder="e.g., Weekdays after 5pm, Weekends anytime"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
        
        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Upload Images (Max 5)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={formData.images.length >= 5 || loading}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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
  );
};

export default MaintenanceRequestForm;


