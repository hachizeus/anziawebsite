import multer from 'multer';
import path from 'path';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// Create the multer instance with memory storage
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Reduce to 5MB file size limit
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types - we'll handle specific validation in the controller
    return cb(null, true);
  }
});

export default upload;
