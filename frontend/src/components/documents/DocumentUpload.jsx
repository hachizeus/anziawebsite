import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DocumentUpload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [accessRoles, setAccessRoles] = useState(['admin']);
  const [isPublic, setIsPublic] = useState(false);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/properties`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setProperties(response.data);
      } catch (err) {
        console.error('Error fetching properties:', err);
      }
    };
    
    fetchProperties();
  }, [navigate]);
  
  const handleRoleToggle = (role) => {
    if (accessRoles.includes(role)) {
      setAccessRoles(accessRoles.filter(r => r !== role));
    } else {
      setAccessRoles([...accessRoles, role]);
    }
  };
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    if (!title || !file) {
      setError('Please provide a title and select a file.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('file', file);
      formData.append('accessRoles', JSON.stringify(accessRoles));
      formData.append('isPublic', isPublic);

      if (selectedProperty) {
        formData.append('property', selectedProperty);
      }

      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      navigate('/documents');
    } catch (err) {
      setError('Failed to upload document. Please try again later.');
      console.error('Error uploading document:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upload New Document</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Document Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter document title"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter document description"
              rows="3"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
              File *
            </label>
            <input
              id="file"
              type="file"
              onChange={handleFileChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Max file size: 10MB. Supported formats: PDF, Word, Excel, PowerPoint, images, and ZIP.
            </p>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Related Property (Optional)
            </label>
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">None</option>
              {properties.map((property) => (
                <option key={property._id} value={property._id}>
                  {property.title} - {property.location}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Access Permissions
            </label>
            <div className="flex flex-wrap gap-3">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={accessRoles.includes('admin')}
                  onChange={() => handleRoleToggle('admin')}
                  className="form-checkbox h-5 w-5 text-blue-600"
                  disabled
                />
                <span className="ml-2 text-gray-700">Admin (Always)</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={accessRoles.includes('agent')}
                  onChange={() => handleRoleToggle('agent')}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Agent</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={accessRoles.includes('landlord')}
                  onChange={() => handleRoleToggle('landlord')}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Landlord</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  checked={accessRoles.includes('tenant')}
                  onChange={() => handleRoleToggle('tenant')}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="ml-2 text-gray-700">Tenant</span>
              </label>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={() => setIsPublic(!isPublic)}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-gray-700">Make document public (accessible to all users)</span>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/documents')}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentUpload;

