import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import imagekit from '../config/imagekit.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

const router = express.Router();

// Upload profile image to ImageKit
router.post('/profile-image', protect, async (req, res) => {
  try {
    const { image, fileName } = req.body;
    
    if (!image || !fileName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Image and file name are required' 
      });
    }
    
    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: image, // base64 encoded image
      fileName: fileName,
      folder: '/profile-pictures',
      useUniqueFileName: true,
      tags: ['profile', 'agent']
    });
    
    return res.status(200).json({
      success: true,
      url: uploadResponse.url,
      fileId: uploadResponse.fileId
    });
  } catch (error) {
    console.error('Error uploading to ImageKit:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error.message
    });
  }
});

// Upload multiple images
router.post('/images', protect, upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No images uploaded' 
      });
    }
    
    // Get server URL
    const protocol = req.protocol;
    const host = req.get('host');
    const baseUrl = `${protocol}://${host}`;
    
    // Create URLs for uploaded files
    const imageUrls = req.files.map(file => `${baseUrl}/uploads/${file.filename}`);
    
    return res.status(200).json({
      success: true,
      imageUrls: imageUrls,
      message: `${req.files.length} images uploaded successfully`
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload images',
      error: error.message
    });
  }
});

export default router;