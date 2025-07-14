import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { File, Upload, Download, Trash2, Loader, AlertCircle, ArrowLeft } from 'lucide-react';
import { backendurl } from '../../App';

const TenantDocuments = () => {
  const { id } = useParams();
  const [tenant, setTenant] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // Fetch tenant details
        const tenantResponse = await axios.get(`${backendurl}/api/tenants/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setTenant(tenantResponse.data.tenant);
        
        // Fetch tenant documents
        try {
          const documentsResponse = await axios.get(`${backendurl}/api/documents`, {
            headers: { Authorization: `Bearer ${token}` },
            params: { tenantId: id }
          });
          
          console.log('Tenant documents response:', documentsResponse.data);
          
          // Handle the response data properly
          if (Array.isArray(documentsResponse.data)) {
            setDocuments(documentsResponse.data);
          } else if (documentsResponse.data && Array.isArray(documentsResponse.data.data)) {
            setDocuments(documentsResponse.data.data);
          } else {
            setDocuments([]);
          }
        } catch (docError) {
          console.error('Error fetching documents:', docError);
          setDocuments([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load tenant data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
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
    }
  };
  
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }
    
    if (!title) {
      toast.error('Please enter a document title');
      return;
    }
    
    setUploading(true);
    
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('tenantId', id);
      
      // Use the tenant document upload endpoint
      const response = await axios.post(`${backendurl}/api/documents/tenant`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log('Document upload response:', response.data);
      
      // Refresh documents list
      const documentsResponse = await axios.get(`${backendurl}/api/documents`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { tenantId: id }
      });
      
      // Handle the response data properly
      if (Array.isArray(documentsResponse.data)) {
        setDocuments(documentsResponse.data);
      } else if (documentsResponse.data && Array.isArray(documentsResponse.data.data)) {
        setDocuments(documentsResponse.data.data);
      } else {
        setDocuments([]);
      }
      
      // Reset form
      setFile(null);
      setTitle('');
      setDescription('');
      
      toast.success('Document uploaded successfully');
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error(error.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };
  
  const handleDownload = (documentUrl) => {
    if (documentUrl) {
      window.open(documentUrl, '_blank');
    } else {
      toast.error('Document URL not available');
    }
  };
  
  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      await axios.delete(`${backendurl}/api/documents/${documentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove the document from the list
      setDocuments(documents.filter(doc => doc._id !== documentId));
      
      toast.success('Document deleted successfully');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <Loader className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading tenant documents...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!tenant) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tenant Not Found
            </h3>
            <p className="text-gray-500 mb-4">The tenant you're looking for doesn't exist or you don't have permission to view it.</p>
            <Link
              to="/tenants"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                transition-colors duration-200 flex items-center gap-2 mx-auto inline-flex"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Tenants
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="mb-6">
        <Link to={`/tenants/${id}`} className="text-blue-600 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Back to Tenant Details
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Documents for {tenant.name || tenant.userId?.name || 'Tenant'}</h1>
          <p className="text-gray-600">Upload and manage documents for this tenant</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Upload New Document</h2>
            
            <form onSubmit={handleUpload}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document File *
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-xs text-gray-500">
                        {file ? file.name : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                      </p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </label>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#91BB3E]"
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
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#91BB3E]"
                  placeholder="Enter document description (optional)"
                  rows="3"
                ></textarea>
              </div>
              
              <button
                type="submit"
                disabled={uploading || !file}
                className="w-full px-4 py-2 bg-[#91BB3E] text-white rounded-md hover:bg-[#82a737] disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload Document
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
        
        {/* Documents List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Tenant Documents</h2>
            </div>
            
            {documents.length === 0 ? (
              <div className="p-8 text-center">
                <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Documents</h3>
                <p className="text-gray-500">Upload your first document for this tenant</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Document
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Uploaded
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents.map((doc) => (
                      <tr key={doc._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-md">
                              <File className="h-5 w-5 text-gray-500" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                              {doc.description && (
                                <div className="text-sm text-gray-500">{doc.description}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(doc.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleDownload(doc.fileUrl)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Download"
                            >
                              <Download className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(doc._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDocuments;