import express from 'express';
import { 
  getAllDocuments, 
  getDocumentById, 
  uploadDocument, 
  updateDocument, 
  deleteDocument,
  uploadDocumentForTenant,
  signDocument,
  uploadSignedDocument
} from '../controller/documentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';
import upload from '../middleware/fileStorage.js';
import jwt from 'jsonwebtoken';
import User from '../models/Usermodel.js';

const router = express.Router();

// Create a custom middleware for form submissions with token in form data
const formProtect = async (req, res, next) => {
  try {
    // Check if token is in form data
    const token = req.body.token;
    
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from token
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }
    
    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Form protect error:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Apply auth middleware to all routes except the form submission route
router.use((req, res, next) => {
  if (req.path === '/signed-form' && req.method === 'POST') {
    return next();
  }
  protect(req, res, next);
});

// Comment out admin-only restriction to allow all authenticated users to upload documents
// router.use(adminOnly);

// Get all documents
router.get('/', getAllDocuments);

// Get document by ID
router.get('/:id', getDocumentById);

// Upload new document
router.post('/', upload.single('file'), uploadDocument);

// Upload document for tenant
router.post('/tenant', upload.single('file'), uploadDocumentForTenant);

// Update document
router.put('/:id', updateDocument);

// Sign document
router.post('/:id/sign', signDocument);

// Upload signed document (protected route)
router.post('/signed', upload.single('file'), uploadSignedDocument);

// Upload signed document via form submission
router.post('/signed-form', upload.single('file'), formProtect, uploadSignedDocument);

// Delete document
router.delete('/:id', deleteDocument);

export default router;
