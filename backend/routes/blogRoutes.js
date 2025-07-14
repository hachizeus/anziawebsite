import express from 'express';
import { 
  getAllBlogs, 
  getBlogById, 
  createBlog, 
  updateBlog, 
  deleteBlog,
  getBlogsByAuthor
} from '../controller/blogController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Route for getting blogs - handles both public and author-specific requests
router.get('/', (req, res, next) => {
  if (req.query.author === 'me') {
    // For author-specific requests, apply protection middleware first
    protect(req, res, () => getBlogsByAuthor(req, res));
  } else {
    // For public requests, get all published blogs
    getAllBlogs(req, res);
  }
});

// Get blog by ID
router.get('/:id', getBlogById);

// Protected routes
router.post('/', protect, upload.single('image'), createBlog);
router.put('/:id', protect, upload.single('image'), updateBlog);
router.delete('/:id', protect, deleteBlog);

export default router;
