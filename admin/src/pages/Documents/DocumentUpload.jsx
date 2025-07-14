import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Upload, File, X, Check, Loader } from 'lucide-react';
import { backendurl } from '../../App';

const DocumentUpload = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingTenants, setFetchingTenants] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendurl}/api/tenants`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setTenants(response.data.tenants || []);
        setFetchingTenants(false);
      } catch (error) {
        console.error('Error fetching tenants:', error);
        setFetchingTenants(false);
      }
    };
    
    fetchTenants();
  }, []);
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      handleFileChange(droppedFile);
    }
  };
  
  const handleFileChange = (selectedFile) => {
    // Check file size (limit to 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds 10MB limit');
      return;
    }
    
    setFile(selectedFile);
    
    // Auto-fill title from filename if empty
    if (!title) {
      const fileName = selectedFile.name.split('.')[0];
      setTitle(fileName.replace(/[_-]/g, ' '));
    }
  };
  
  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };
  
  const removeFile = () => {
    setFile(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
    
    if (!title) {
      toast.error('Please enter a document title');
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description);
      
      if (tenantId) {
        formData.append('tenantId', tenantId);
      }
      
      // Add a flag to indicate this should use ImageKit
      formData.append('useImageKit', 'true');
      
      console.log('Uploading document with form data:', {
        title,
        description,
        tenantId: tenantId || 'none',
        fileName: file.name,
        useImageKit: true
      });
      
      const response = await axios.post(`${backendurl}/api/documents`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Document upload response:', response.data);
      
      // Verify the document was created by fetching it
      const verifyResponse = await axios.get(`${backendurl}/api/documents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Verification response:', verifyResponse.data);
      
      toast.success('Document uploaded successfully');
      
      // Force a delay before navigating to ensure the document is processed
      setTimeout(() => {
        navigate('/documents');
      }, 1000);
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error(error.response?.data?.message || 'Failed to upload document');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="mb-6">
        <Link to="/documents" className="text-blue-600 hover:underline flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Documents
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Upload Document</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document File *
            </label>
            
            {!file ? (
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input').click()}
              >
                <input
                  id="file-input"
                  type="file"
                  className="hidden"
                  onChange={handleFileInputChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-1">
                  Drag and drop your file here, or click to browse
                </p>
                <p className="text-xs text-gray-500">
                  Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG (Max 10MB)
                </p>
              </div>
            ) : (
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <File className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="p-1 rounded-full hover:bg-gray-100"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
              </div>
            )}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter document title"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter document description (optional)"
              rows="3"
            ></textarea>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign to Tenant (Optional)
            </label>
            {fetchingTenants ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader className="w-4 h-4 animate-spin" />
                Loading tenants...
              </div>
            ) : (
              <select
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- No tenant (general document) --</option>
                {tenants.map((tenant) => (
                  <option key={tenant._id} value={tenant._id}>
                    {tenant.userId?.name || tenant.name || 'Unnamed Tenant'} - {tenant.propertyId?.title || 'No property'}
                  </option>
                ))}
              </select>
            )}
            <p className="mt-1 text-xs text-gray-500">
              If assigned to a tenant, this document will appear in their dashboard
            </p>
          </div>
          
          <div className="flex justify-end">
            <Link
              to="/documents"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 mr-2"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading || !file}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Upload Document
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentUpload;