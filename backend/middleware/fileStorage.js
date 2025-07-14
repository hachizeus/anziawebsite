import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import ImageKit from 'imagekit';

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
    // Others
    'application/zip',
    'application/x-zip-compressed'
  ];
  
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only documents, images, and zip files are allowed.'), false);
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

// Upload file to storage and return URL
export const uploadToStorage = async (file) => {
  try {
    console.log('ImageKit config:', {
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY ? 'exists' : 'missing',
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY ? 'exists' : 'missing',
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT ? 'exists' : 'missing'
    });
    
    if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
      throw new Error('ImageKit configuration missing');
    }
    
    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
    });
    
    // Use base64 encoding like in product controller
    const encodedFile = file.buffer.toString('base64');
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    
    console.log('Uploading to ImageKit:', {
      fileName: uniqueFilename,
      bufferSize: encodedFile.length
    });
    
    const result = await imagekit.upload({
      file: encodedFile,
      fileName: uniqueFilename,
      folder: '/documents'
    });
    
    console.log('ImageKit upload success:', result.url);
    return result.url;
  } catch (error) {
    console.error('Error uploading to ImageKit:', error);
    
    // Create a directory for uploads if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'uploads', 'documents');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    // Generate a unique filename
    const uniqueFilename = `${uuidv4()}-${file.originalname}`;
    const filePath = path.join(uploadDir, uniqueFilename);
    
    // Write the file to disk
    fs.writeFileSync(filePath, file.buffer);
    
    // Return a local URL
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const localUrl = `${baseUrl}/uploads/documents/${uniqueFilename}`;
    
    console.log('Fallback to local storage:', localUrl);
    return localUrl;
  }
};

// Delete file from storage
export const deleteFromStorage = async (fileUrl) => {
  try {
    // Check if it's an ImageKit URL
    if (fileUrl.includes('imagekit.io')) {
      const imagekit = new ImageKit({
        publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
        privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
        urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
      });
      
      // Extract file ID from URL
      const fileId = fileUrl.split('/').pop().split('.')[0];
      
      // Delete from ImageKit
      await imagekit.deleteFile(fileId);
    } else {
      // Local file deletion as fallback
      const filename = fileUrl.split('/').pop();
      const filePath = path.join(process.cwd(), 'uploads/documents', filename);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
};

export default upload;
