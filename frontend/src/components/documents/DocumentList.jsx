import  { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaFileAlt, FaDownload, FaTrash, FaEye, FaLock } from 'react-icons/fa';

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/documents`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setDocuments(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load documents. Please try again later.');
        setLoading(false);
        console.error('Error fetching documents:', err);
      }
    };
    
    fetchDocuments();
  }, [navigate]);
  
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/documents/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setDocuments(documents.filter(doc => doc._id !== id));
    } catch (err) {
      setError('Failed to delete document. Please try again later.');
      console.error('Error deleting document:', err);
    }
  };
  
  const handleDownload = (fileUrl, fileName) => {
    // Create a temporary anchor element
    const anchor = document.createElement('a');
    anchor.href = fileUrl;
    anchor.download = fileName || 'document';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };
  
  const handleView = (id) => {
    navigate(`/documents/${id}`);
  };
  
  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) {
      return <FaFileAlt className="text-red-500" />;
    } else if (fileType.includes('image')) {
      return <FaFileAlt className="text-blue-500" />;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return <FaFileAlt className="text-indigo-500" />;
    } else if (fileType.includes('sheet') || fileType.includes('excel')) {
      return <FaFileAlt className="text-green-500" />;
    } else {
      return <FaFileAlt className="text-gray-500" />;
    }
  };
  
  const filteredDocuments = filter === 'all' 
    ? documents 
    : documents.filter(doc => doc.accessRoles.includes(filter));
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Sent Documents</h1>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Document Management Portal</h2>
        <button 
          onClick={() => navigate('/documents/upload')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300"
        >
          Upload New Document
        </button>
      </div>
      
      <div className="mb-6">
        <div className="flex space-x-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('admin')}
            className={`px-4 py-2 rounded-md ${filter === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Admin
          </button>
          <button 
            onClick={() => setFilter('agent')}
            className={`px-4 py-2 rounded-md ${filter === 'agent' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Agent
          </button>
          <button 
            onClick={() => setFilter('landlord')}
            className={`px-4 py-2 rounded-md ${filter === 'landlord' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Landlord
          </button>
          <button 
            onClick={() => setFilter('tenant')}
            className={`px-4 py-2 rounded-md ${filter === 'tenant' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Tenant
          </button>
        </div>
      </div>
      
      {filteredDocuments.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No documents found.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((doc) => (
                <tr key={doc._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center">
                        {getFileIcon(doc.fileType)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                        <div className="text-sm text-gray-500">{doc.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{doc.uploadedBy?.name || 'Unknown'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {doc.isPublic ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Public
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          <FaLock className="mr-1" /> Restricted
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      onClick={() => handleView(doc._id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      <FaEye />
                    </button>
                    <button 
                      onClick={() => handleDownload(doc.fileUrl, doc.title)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="Download document"
                    >
                      <FaDownload />
                    </button>
                    <button 
                      onClick={() => handleDelete(doc._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DocumentList;

