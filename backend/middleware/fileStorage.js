import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import imagekit from '../config/imagekit.js';

// Configure storage - ensure we're using memory storage only
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  // Define allowed file types
  const allowedFileTypes = [
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    // Others
    'application/zip',
    'application/x-zip-compressed'
  ];
  
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only documents, images, and zip files are allowed.`), false);
  }
};

// Configure multer - memory storage only
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Upload file to ImageKit and return URL
export const uploadToStorage = async (file, folder = '/documents') => {
  try {
    // Use base64 encoding for the file
    const encodedFile = file.buffer.toString('base64');
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    
    console.log('Uploading to ImageKit:', {
      fileName: uniqueFilename,
      folder: folder,
      bufferSize: encodedFile.length
    });
    
    const result = await imagekit.upload({
      file: encodedFile,
      fileName: uniqueFilename,
      folder: folder,
      useUniqueFileName: true,
      tags: ['api-upload']
    });
    
    console.log('ImageKit upload success:', result.url);
    return result.url;
  } catch (error) {
    console.error('Error uploading to ImageKit:', error);
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

// Delete file from ImageKit
export const deleteFromStorage = async (fileUrl) => {
  try {
    if (!fileUrl || !fileUrl.includes('ik.imagekit.io')) {
      console.warn('Not an ImageKit URL, skipping delete:', fileUrl);
      return false;
    }
    
    // Extract file ID from URL
    const urlParts = fileUrl.split('/');
    const fileIdWithExt = urlParts[urlParts.length - 1];
    const fileId = fileIdWithExt.split('.')[0];
    
    if (!fileId) {
      console.warn('Could not extract file ID from URL:', fileUrl);
      return false;
    }
    
    // Delete from ImageKit
    await imagekit.deleteFile(fileId);
    console.log('File deleted successfully from ImageKit:', fileId);
    
    return true;
  } catch (error) {
    console.error('Error deleting file from ImageKit:', error);
    return false;
  }
};

// Upload multiple files to ImageKit
export const uploadMultipleFiles = async (files, folder = '/documents') => {
  try {
    const uploadPromises = files.map(file => uploadToStorage(file, folder));
    const urls = await Promise.all(uploadPromises);
    return urls;
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    throw new Error(`Failed to upload multiple files: ${error.message}`);
  }
};

// Get ImageKit authentication parameters for frontend uploads
export const getAuthenticationParameters = () => {
  return imagekit.getAuthenticationParameters();
};

export default upload;
