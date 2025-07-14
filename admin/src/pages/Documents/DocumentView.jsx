import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Trash, Edit } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import ResponsiveCard from '../../components/ResponsiveCard';
import { responsivePadding, responsiveText } from '../../utils/responsiveUtils';

const backendurl = import.meta.env.VITE_BACKEND_URL || "https://real-estate-backend-vybd.onrender.com";

const DocumentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendurl}/api/documents/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setDocument(response.data);
      } catch (error) {
        console.error('Error fetching document:', error);
        setError('Failed to load document');
        toast.error('Failed to load document');
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${backendurl}/api/documents/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      toast.success('Document deleted successfully');
      navigate('/documents');
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  const handleDownload = () => {
    if (document && document.fileUrl) {
      window.open(document.fileUrl, '_blank');
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
          <div className="w-16 h-16 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="mt-4 text-gray-600">Preview not available. Click download to view this file.</p>
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className={responsivePadding.container}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !document) {
    return (
      <div className={responsivePadding.container}>
        <div className="mb-6">
          <Link to="/documents" className="flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Documents
          </Link>
        </div>
        
        <ResponsiveCard>
          <div className="text-center py-10">
            <p className="text-gray-500">{error || 'Document not found'}</p>
          </div>
        </ResponsiveCard>
      </div>
    );
  }

  return (
    <div className={responsivePadding.container}>
      <div className="mb-6">
        <Link to="/documents" className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to Documents
        </Link>
      </div>
      
      <ResponsiveCard>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className={responsiveText.heading}>{document.title}</h2>
            {document.description && (
              <p className="text-gray-600 mt-2">{document.description}</p>
            )}
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={handleDownload}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center"
            >
              <Download className="w-4 h-4 mr-2" /> Download
            </button>
            <Link 
              to={`/documents/edit/${id}`}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center"
            >
              <Edit className="w-4 h-4 mr-2" /> Edit
            </Link>
            <button 
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 flex items-center"
            >
              <Trash className="w-4 h-4 mr-2" /> Delete
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
        
        {document.tenantId && (
          <div className="mb-6 bg-blue-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-blue-700">Tenant Document</h3>
            <p className="mt-1 text-sm text-blue-600">
              This document is associated with tenant: {document.tenantId.userId?.name || 'Unknown'}
            </p>
          </div>
        )}
        
        {document.property && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500">Related Property</h3>
            <p className="mt-1 text-sm text-gray-900">
              <Link 
                to={`/property/${document.property._id}`} 
                className="text-blue-600 hover:text-blue-800"
              >
                {document.property.title} - {document.property.location}
              </Link>
            </p>
          </div>
        )}
        
        {/* Signature Status */}
        {document.signature && document.signature.hasSigned && (
          <div className="mb-6 bg-green-50 p-4 rounded-md border border-green-200">
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
          </div>
        )}
        
        <div>
          <h3 className={`${responsiveText.subheading} mb-4`}>Document Preview</h3>
          {getFilePreview()}
        </div>
      </ResponsiveCard>
    </div>
  );
};

export default DocumentView;