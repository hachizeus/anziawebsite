import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { File, Download, Trash2, Loader, AlertCircle, RefreshCw } from 'lucide-react';
import { backendurl } from '../../App';

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${backendurl}/api/documents`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Documents response:', response.data);
      setDocuments(Array.isArray(response.data) ? response.data : response.data.documents || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setError('Failed to load documents');
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchDocuments();
  }, []);
  
  const handleDownload = async (documentId, fileName) => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.get(`${backendurl}/api/documents/${documentId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName || 'document');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading document:', error);
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
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24 flex justify-center items-center h-64">
        <div className="text-center">
          <Loader className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading documents...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24 flex justify-center items-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Error Loading Documents
          </h3>
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={fetchDocuments}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
              transition-colors duration-200 flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Document Management</h1>
        <div className="flex gap-2">
          <button
            onClick={fetchDocuments}
            className="px-2 py-1 sm:px-3 sm:py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center gap-1 text-xs sm:text-sm"
          >
            <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4" />
            Refresh
          </button>
          <Link
            to="/documents/upload"
            className="bg-[#91BB3E] hover:bg-[#82a737] text-white font-medium py-1 px-2 sm:py-2 sm:px-4 rounded-md flex items-center gap-1 sm:gap-2 text-xs sm:text-sm whitespace-nowrap"
          >
            <File className="w-3 h-3 sm:w-4 sm:h-4" />
            Upload Doc
          </Link>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {documents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenant</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Uploaded</th>
                  <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {documents.map((doc) => (
                  <tr key={doc._id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-md">
                          <File className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{doc.title}</div>
                          {doc.description && (
                            <div className="text-sm text-gray-500">{doc.description}</div>
                          )}
                          {doc.fileUrl && (
                            <div className="text-xs text-gray-400 mt-1">
                              {doc.fileUrl.includes('imagekit') ? 'Stored on ImageKit' : 'Stored locally'}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {doc.tenantId ? (
                        <Link 
                          to={`/tenants/${doc.tenantId._id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {doc.tenantId.name || doc.tenantId.userId?.name || 'Unnamed Tenant'}
                        </Link>
                      ) : (
                        'No tenant assigned'
                      )}
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-500">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDownload(doc._id, doc.fileName || `${doc.title}.pdf`)}
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
        ) : (
          <div className="p-8 text-center">
            <File className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Documents</h3>
            <p className="text-gray-500 mb-4">Upload your first document to get started</p>
            <Link
              to="/documents/upload"
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              <File className="w-4 h-4 mr-2" />
              Upload Document
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentList;