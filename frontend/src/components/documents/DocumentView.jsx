import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaDownload, FaArrowLeft, FaTrash, FaEdit, FaSignature } from 'react-icons/fa';
import SignatureCanvas from './SignatureCanvas';
import { useAuth } from '../../context/AuthContext';

const DocumentView = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSignature, setShowSignature] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/documents/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setDocument(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load document. Please try again later.');
        setLoading(false);
        console.error('Error fetching document:', err);
      }
    };
    
    fetchDocument();
  }, [id, navigate]);
  
  const handleDelete = async () => {
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
      
      navigate('/documents');
    } catch (err) {
      setError('Failed to delete document. Please try again later.');
      console.error('Error deleting document:', err);
    }
  };
  
  const handleDownload = () => {
    if (document && document.fileUrl) {
      // Create a temporary anchor element to trigger download
      const anchor = document.createElement('a');
      anchor.href = document.fileUrl;
      anchor.download = document.title || 'document';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }
  };

  const handleSignatureSave = async (signatureData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/documents/${id}/sign`,
        { signatureData },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        setDocument(response.data.document);
        setShowSignature(false);
        alert('Document signed successfully!');
      }
    } catch (err) {
      setError('Failed to sign document. Please try again later.');
      console.error('Error signing document:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const getFilePreview = () => {
    if (!document || !document.fileType) return null;
    
    if (document.fileType.includes('pdf')) {
      return (
        <iframe 
          src={document.fileUrl} 
          className="w-full h-96 border-0 rounded-md"
          title={document.title}
        />
      );
    } else if (document.fileType.includes('image')) {
      return (
        <img 
          src={document.fileUrl} 
          alt={document.title} 
          className="max-w-full h-auto rounded-md"
        />
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center p-10 bg-gray-100 rounded-md">
          <svg className="w-16 h-16 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
          <p className="mt-4 text-gray-600">Preview not available. Click download to view this file.</p>
        </div>
      );
    }
  };
  
  // Check if user is a tenant and can sign this document
  const canSign = () => {
    if (!document || !user) return false;
    
    // Check if user is a tenant
    if (user.role !== 'tenant') return false;
    
    // Check if document is already signed
    if (document.signature && document.signature.hasSigned) return false;
    
    // Check if document is for this tenant
    return document.accessRoles.includes('tenant');
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
        <button 
          onClick={() => navigate('/documents')}
          className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" /> Back to Documents
        </button>
      </div>
    );
  }
  
  if (!document) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-10">
          <p className="text-gray-500">Document not found.</p>
        </div>
        <button 
          onClick={() => navigate('/documents')}
          className="mt-4 flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" /> Back to Documents
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button 
          onClick={() => navigate('/documents')}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FaArrowLeft className="mr-2" /> Back to Documents
        </button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">{document.title}</h2>
              {document.description && (
                <p className="text-gray-600 mt-2">{document.description}</p>
              )}
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={handleDownload}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center"
              >
                <FaDownload className="mr-2" /> Download
              </button>
              
              {canSign() && (
                <button 
                  onClick={() => setShowSignature(!showSignature)}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center"
                >
                  <FaSignature className="mr-2" /> {showSignature ? 'Cancel' : 'Sign Document'}
                </button>
              )}
              
              <button 
                onClick={() => navigate(`/documents/edit/${id}`)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center"
              >
                <FaEdit className="mr-2" /> Edit
              </button>
              
              <button 
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center"
              >
                <FaTrash className="mr-2" /> Delete
              </button>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-gray-500">Uploaded By</h3>
              <p className="mt-1 text-sm text-gray-900">{document.uploadedBy?.name || 'Unknown'}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-gray-500">Upload Date</h3>
              <p className="mt-1 text-sm text-gray-900">{new Date(document.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-gray-500">Access Level</h3>
              <p className="mt-1 text-sm text-gray-900">
                {document.isPublic ? 'Public' : `Restricted (${document.accessRoles.join(', ')})`}
              </p>
            </div>
          </div>
          
          {document.property && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-500">Related Property</h3>
              <p className="mt-1 text-sm text-gray-900">
                <a 
                  href={`/properties/${document.property._id}`} 
                  className="text-blue-600 hover:text-blue-800"
                >
                  {document.property.title} - {document.property.location}
                </a>
              </p>
            </div>
          )}
          
          {/* Signature Status */}
          {document.signature && document.signature.hasSigned && (
            <div className="mt-4 bg-green-50 p-4 rounded-md border border-green-200">
              <h3 className="text-sm font-medium text-green-700">Document Signed</h3>
              <p className="mt-1 text-sm text-green-600">
                Signed by {document.signature.signedBy?.name || 'Tenant'} on {new Date(document.signature.signedAt).toLocaleDateString()}
              </p>
              {document.signature.signatureData && (
                <div className="mt-2 border border-green-200 p-2 rounded bg-white">
                  <img 
                    src={document.signature.signatureData} 
                    alt="Signature" 
                    className="h-16 object-contain"
                  />
                </div>
              )}
              
              {/* Upload Signed Document Button */}
              {user && user.role === 'tenant' && (
                <div className="mt-4">
                  <button 
                    onClick={() => document.getElementById('signedDocUpload').click()}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center"
                  >
                    <FaDownload className="mr-2" /> Upload Signed Document
                  </button>
                  <input 
                    type="file" 
                    id="signedDocUpload" 
                    className="hidden" 
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={async (e) => {
                      if (!e.target.files || !e.target.files[0]) return;
                      
                      const file = e.target.files[0];
                      const formData = new FormData();
                      formData.append('file', file);
                      formData.append('title', `Signed: ${document.title}`);
                      formData.append('tenantId', document.tenantId?._id || '');
                      formData.append('description', `Signed version of document: ${document.title}`);
                      
                      try {
                        setLoading(true);
                        const token = localStorage.getItem('token');
                        const response = await axios.post(
                          `${import.meta.env.VITE_API_BASE_URL}/api/documents/signed`,
                          formData,
                          {
                            headers: {
                              Authorization: `Bearer ${token}`,
                              'Content-Type': 'multipart/form-data'
                            }
                          }
                        );
                        
                        if (response.data) {
                          alert('Signed document uploaded successfully!');
                          navigate('/documents');
                        }
                      } catch (err) {
                        console.error('Error uploading signed document:', err);
                        alert('Failed to upload signed document. Please try again.');
                      } finally {
                        setLoading(false);
                      }
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Please upload the signed version of this document from your device.
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Signature Canvas */}
          {showSignature && (
            <div className="mt-6 border border-gray-200 p-4 rounded-md bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Sign Document</h3>
              <p className="text-sm text-gray-600 mb-4">
                Please sign in the box below. Your signature will be saved with this document.
              </p>
              <SignatureCanvas onSave={handleSignatureSave} />
            </div>
          )}
          
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Document Preview</h3>
            {getFilePreview()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentView;

