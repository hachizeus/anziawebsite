import express from 'express';
import { 
  getAllProperties, 
  getproductById, 
  createproduct, 
  updateproduct, 
  deleteproduct,
  markproductAsPaid,
  getAvailableProperties,
  toggleproductAvailability
} from '../controller/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/properties', getAllProperties);
router.get('/properties/available', getAvailableProperties);
router.get('/properties/:id', getproductById);

// Admin routes
router.post('/properties', protect, admin, createproduct);
router.put('/properties/:id', protect, admin, updateproduct);
router.delete('/properties/:id', protect, admin, deleteproduct);
router.post('/properties/mark-paid', protect, admin, markproductAsPaid);
router.post('/properties/toggle-availability', protect, admin, toggleproductAvailability);

export default router;
