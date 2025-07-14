import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Upload, X } from '../utils/icons.jsx';

// Updated property types with categories
const PROPERTY_CATEGORIES = {
  'Residential': [
    'Single-family home',
    'Multi-family home',
    'Apartment',
    'Condominium',
    'Townhouse',
    'Airbnb'
  ],
  'Commercial': [
    'Office building',
    'Retail store',
    'Shopping center',
    'Mall',
    'Warehouse',
    'Industrial space'
  ],
  'Specialty': [
    'Hotel',
    'Resort',
    'Student housing',
    'Senior housing',
    'Assisted living',
    'Co-working space',
    'Event venue'
  ],
  'Land & Agricultural': [
    'Vacant lot',
    'Raw land',
    'Agricultural land',
    'Farm',
    'Ranch'
  ]
};

const AVAILABILITY_TYPES = ['available', 'sold', 'rented', 'booked', 'pending']
const PURPOSE_TYPES = ['sale', 'rent', 'lease', 'booking']

const AgentPropertyForm = ({ property, onPropertyCreated, isEditing = false }) => {
  const initialFormData = {
    title: '',
    category: '',
    type: '',
    price: '',
    location: '',
    latitude: '',
    longitude: '',
    description: '',
    beds: '',
    baths: '',
    sqft: '',
    phone: '',
    availability: 'available',
    purpose: 'sale',
    amenities: [],
    images: [],
    video: null
  };

  const [formData, setFormData] = useState(isEditing && property ? {
    title: property.title || '',
    category: property.category || '',
    type: property.type || '',
    price: property.price || '',
    location: property.location || '',
    latitude: property.latitude || '',
    longitude: property.longitude || '',
    description: property.description || '',
    beds: property.beds || '',
    baths: property.baths || '',
    sqft: property.sqft || '',
    phone: property.phone || '',
    availability: property.availability || 'available',
    purpose: property.purpose || 'sale',
    amenities: property.amenities || [],
    images: [],
    video: null
  } : initialFormData);

  const [previewUrls, setPreviewUrls] = useState(isEditing && property && property.image ? 
    property.image.map(img => img) : []);
  const [loading, setLoading] = useState(false);
  const [newAmenity, setNewAmenity] = useState('');
  
  useEffect(() => {
    if (isEditing && property) {
      setFormData({
        title: property.title || '',
        category: property.category || '',
        type: property.type || '',
        price: property.price || '',
        location: property.location || '',
        latitude: property.latitude || '',
        longitude: property.longitude || '',
        description: property.description || '',
        beds: property.beds || '',
        baths: property.baths || '',
        sqft: property.sqft || '',
        phone: property.phone || '',
        availability: property.availability || 'available',
        purpose: property.purpose || 'sale',
        amenities: property.amenities || [],
        images: [],
        video: null
      });
      
      setPreviewUrls(property.image || []);
    }
  }, [property, isEditing]);
  
  // Function to geocode location using Nominatim (OpenStreetMap)
  const handleGeocodeLocation = () => {
    if (!formData.location) {
      toast.error('Please enter a location first');
      return;
    }
    
    setLoading(true);
    // Use Nominatim API for geocoding (free, no API key required)
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(formData.location)}&limit=1&addressdetails=1`;
    
    fetch(geocodeUrl, {
      headers: {
        'Accept-Language': 'en',
        'User-Agent': 'RealEstateWebsite/1.0'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const latitude = parseFloat(data[0].lat);
          const longitude = parseFloat(data[0].lon);
          setFormData(prev => ({
            ...prev,
            latitude,
            longitude
          }));
          toast.success('Location coordinates found!');
        } else {
          toast.error('Could not find coordinates for this location');
        }
      })
      .catch(error => {
        console.error('Error getting coordinates:', error);
        toast.error('Error getting coordinates');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'category') {
      // Reset type when category changes
      setFormData(prev => ({
        ...prev,
        [name]: value,
        type: ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + previewUrls.length > 4) {
      toast.error('Maximum 4 images allowed');
      return;
    }

    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index) => {
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleAddAmenity = () => {
    if (newAmenity && !formData.amenities.includes(newAmenity)) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity]
      }));
      setNewAmenity('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {
      const formdata = new FormData();
      formdata.append('title', formData.title);
      formdata.append('category', formData.category);
      formdata.append('type', formData.type);
      formdata.append('price', formData.price);
      formdata.append('location', formData.location);
      formdata.append('latitude', formData.latitude);
      formdata.append('longitude', formData.longitude);
      formdata.append('description', formData.description);
      formdata.append('beds', formData.beds);
      formdata.append('baths', formData.baths);
      formdata.append('sqft', formData.sqft);
      formdata.append('phone', formData.phone);
      formdata.append('availability', formData.availability);
      formdata.append('purpose', formData.purpose);
      formdata.append('amenities', JSON.stringify(formData.amenities));
      
      // Append images
      formData.images.forEach((image, index) => {
        formdata.append(`image${index + 1}`, image);
      });
      
      // Append video if available
      if (formData.video) {
        formdata.append('video', formData.video);
      }

      const token = localStorage.getItem("token");
      let url = `${import.meta.env.VITE_BACKEND_URL}/api/agents/properties`;
      
      if (isEditing) {
        url = `${import.meta.env.VITE_BACKEND_URL}/api/agents/properties/${property._id}`;
      }
      
      // Use direct fetch to avoid CORS issues
      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type when sending FormData
        },
        body: formdata
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        toast.success(isEditing ? 'Property updated successfully' : 'Property created successfully');
        onPropertyCreated(data.property);
        
        if (!isEditing) {
          setFormData(initialFormData);
          setPreviewUrls([]);
        }
      } else {
        toast.error(data.message || 'Failed to save property');
      }
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error(isEditing ? 'Failed to update property' : 'Failed to create property');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6 dark:text-white">{isEditing ? 'Edit Property' : 'Add New Property'}</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Property Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Property Category
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm p-2"
              >
                <option value="">Select Category</option>
                {Object.keys(PROPERTY_CATEGORIES).map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Property Type
              </label>
              <select
                id="type"
                name="type"
                required
                value={formData.type}
                onChange={handleInputChange}
                disabled={!formData.category}
                className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm p-2 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
              >
                <option value="">Select Type</option>
                {formData.category && PROPERTY_CATEGORIES[formData.category].map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {!formData.category && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Select a category first</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="availability" className="block text-sm font-medium text-gray-700">
                Availability
              </label>
              <select
                id="availability"
                name="availability"
                required
                value={formData.availability}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2"
              >
                <option value="">Select Availability</option>
                {AVAILABILITY_TYPES.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">
                Purpose
              </label>
              <select
                id="purpose"
                name="purpose"
                required
                value={formData.purpose}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2"
              >
                <option value="">Select Purpose</option>
                {PURPOSE_TYPES.map(type => (
                  <option key={type} value={type}>
                    {type === 'sale' ? 'For Sale' :
                     type === 'rent' ? 'For Rent' :
                     type === 'lease' ? 'For Lease' :
                     'For Booking'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price (KSh)
              </label>
              <input
                type="number"
                id="price"
                name="price"
                required
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2"
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm pl-10 py-2.5"
                  placeholder="Enter detailed location (e.g. Kenya, Nairobi, Kamulu)"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <button
                type="button"
                onClick={handleGeocodeLocation}
                className="mt-1 sm:mt-1 px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-all shadow-sm whitespace-nowrap flex-shrink-0"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Loading</span>
                  </div>
                ) : 'Get Coordinates'}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Enter a detailed location and click "Get Coordinates" to pinpoint the exact location
            </p>
            {formData.latitude && formData.longitude && (
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                <p className="text-xs text-green-700">
                  ✓ Location coordinates captured: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
                </p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="beds" className="block text-sm font-medium text-gray-700">
                Bedrooms
              </label>
              <input
                type="number"
                id="beds"
                name="beds"
                required
                min="0"
                value={formData.beds}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2"
              />
            </div>

            <div>
              <label htmlFor="baths" className="block text-sm font-medium text-gray-700">
                Bathrooms
              </label>
              <input
                type="number"
                id="baths"
                name="baths"
                required
                min="0"
                value={formData.baths}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2"
              />
            </div>

            <div>
              <label htmlFor="sqft" className="block text-sm font-medium text-gray-700">
                Square Feet
              </label>
              <input
                type="number"
                id="sqft"
                name="sqft"
                required
                min="0"
                value={formData.sqft}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Contact Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              value={formData.phone}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2"
            />
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amenities
          </label>
          <div className="flex flex-wrap gap-2">
            {formData.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="checkbox"
                  id={`amenity-${index}`}
                  name="amenities"
                  value={amenity}
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label htmlFor={`amenity-${index}`} className="ml-2 block text-sm text-gray-700">
                  {amenity}
                </label>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center">
            <input
              type="text"
              value={newAmenity}
              onChange={(e) => setNewAmenity(e.target.value)}
              placeholder="Add new amenity"
              className="mt-1 block w-full rounded-md border border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm p-2"
            />
            <button
              type="button"
              onClick={handleAddAmenity}
              className="ml-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Images (Max 4)
          </label>
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-4 mb-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="h-32 sm:h-40 w-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
          {previewUrls.length < 4 && (
            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="images" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                    <span>Upload images</span>
                    <input
                      id="images"
                      name="images"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Video Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Video (Optional)
          </label>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Property Video (Optional)
              </label>
              <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="video" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                      <span>Upload video</span>
                      <input
                        id="video"
                        name="video"
                        type="file"
                        accept="video/mp4"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            // Check file size (limit to 5MB)
                            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
                            if (e.target.files[0].size > maxSize) {
                              toast.error("Video file size exceeds 5MB limit");
                              return;
                            }
                            
                            setFormData(prev => ({
                              ...prev,
                              video: e.target.files[0]
                            }));
                            toast.success("Video selected successfully");
                          }
                        }}
                        className="sr-only"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500">MP4 format only, max 5MB</p>
                  {formData.video && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                      <p className="text-sm text-green-600">
                        ✓ Video selected: {formData.video.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Size: {(formData.video.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            disabled={loading}
          >
            {loading ? 'Submitting...' : isEditing ? 'Update Property' : 'Submit Property'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgentPropertyForm;


