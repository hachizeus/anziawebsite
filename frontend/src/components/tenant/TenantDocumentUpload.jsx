import { useState } from 'react';
import { toast } from 'react-hot-toast';

const TenantDocumentUpload = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !file) {
      toast.error('Please provide a title and select a file.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('file', file);
      formData.append('accessRoles', JSON.stringify(['admin', 'tenant']));
      formData.append('isPublic', false);
      formData.append('uploadedBy', 'tenant');

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/documents`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload document');
      }

      toast.success('Document uploaded successfully');
      setTitle('');
      setDescription('');
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('file');
      if (fileInput) fileInput.value = '';
      
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Failed to upload document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Upload Document to Admin</h2>
      
      <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-md">
        <h3 className="text-lg font-medium text-blue-800">Share Documents</h3>
        <p className="text-blue-700 mt-1">
          Upload documents to share with the property management team.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Document Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter document title"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter document description"
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
            File *
          </label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Max file size: 10MB. Supported formats: PDF, Word, Excel, PowerPoint, images, and ZIP.
          </p>
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? 'Uploading...' : 'Upload Document'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TenantDocumentUpload;

