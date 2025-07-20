import React, { useState, useEffect } from 'react';
import { getImageKitAuth } from '../../services/api';
import { getOptimizedImageUrl } from '../../utils/imagekitUtils';

const ImageUploader = ({ onUploadSuccess, onUploadError, folder = '/uploads', maxFiles = 5, allowMultiple = true }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [authParams, setAuthParams] = useState(null);
  const [error, setError] = useState(null);
  
  // Get ImageKit authentication parameters
  useEffect(() => {
    const fetchAuthParams = async () => {
      try {
        const { success, authParams } = await getImageKitAuth();
        if (success && authParams) {
          setAuthParams(authParams);
        }
      } catch (err) {
        console.error('Failed to get ImageKit auth:', err);
        setError('Failed to initialize uploader. Please try again later.');
      }
    };
    
    fetchAuthParams();
  }, []);
  
  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (selectedFiles.length > maxFiles) {
      setError(`You can only upload up to ${maxFiles} files at once.`);
      return;
    }
    
    // Validate file types and sizes
    const validFiles = selectedFiles.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      
      if (!isValidType) {
        setError('Only JPEG, PNG, GIF, and WebP images are allowed.');
        return false;
      }
      
      if (!isValidSize) {
        setError('Files must be less than 5MB.');
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length > 0) {
      setFiles(validFiles);
      setError(null);
    }
  };
  
  // Upload files to ImageKit
  const uploadFiles = async () => {
    if (!authParams || files.length === 0) {
      return;
    }
    
    setUploading(true);
    setProgress(0);
    setError(null);
    
    try {
      const uploadedUrls = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        
        // Add ImageKit authentication parameters
        formData.append('publicKey', authParams.publicKey);
        formData.append('signature', authParams.signature);
        formData.append('token', authParams.token);
        formData.append('expire', authParams.expire);
        formData.append('fileName', `${Date.now()}-${file.name}`);
        formData.append('folder', folder);
        formData.append('file', file);
        formData.append('useUniqueFileName', 'true');
        
        // Upload to ImageKit
        const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }
        
        const result = await response.json();
        uploadedUrls.push(result.url);
        
        // Update progress
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }
      
      // Call success callback with uploaded URLs
      if (onUploadSuccess) {
        onUploadSuccess(uploadedUrls);
      }
      
      // Reset state
      setFiles([]);
      setProgress(0);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload images. Please try again.');
      
      if (onUploadError) {
        onUploadError(err.message);
      }
    } finally {
      setUploading(false);
    }
  };
  
  // Cancel upload
  const cancelUpload = () => {
    setFiles([]);
    setProgress(0);
    setError(null);
  };
  
  return (
    <div className="image-uploader">
      {error && (
        <div className="error-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="upload-container">
        <input
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple={allowMultiple}
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
          id="file-input"
        />
        
        <label
          htmlFor="file-input"
          className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded inline-block"
        >
          Select Images
        </label>
        
        {files.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-600">{files.length} file(s) selected</p>
            
            <div className="flex mt-2 space-x-2">
              <button
                onClick={uploadFiles}
                disabled={uploading}
                className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
              
              <button
                onClick={cancelUpload}
                disabled={uploading}
                className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        {uploading && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">{progress}% complete</p>
          </div>
        )}
      </div>
      
      {/* Preview selected files */}
      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {Array.from(files).map((file, index) => (
            <div key={index} className="relative">
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${index + 1}`}
                className="w-full h-24 object-cover rounded"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
