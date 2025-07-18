import express from 'express';
import { 
    addProduct, 
    getAllProducts, 
    deleteProduct, 
    updateProduct, 
    getProductById,
    toggleProductAvailability 
} from '../controller/productcontroller.js';
import upload from '../middleware/multer.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const productRouter = express.Router();

productRouter.post('/add', async (req, res) => {
  try {
    console.log('=== PRODUCT ADD (SERVER.JS) ===');
    console.log('Body:', req.body);
    res.json({ success: true, message: 'Product added successfully (server.js)' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});


productRouter.get('/list', getAllProducts);
productRouter.delete('/remove/:id', protect, admin, deleteProduct);
productRouter.put('/update/:id', protect, admin, upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 }
]), updateProduct);
productRouter.get('/single/:id', getProductById);
productRouter.post('/toggle-availability', protect, admin, toggleProductAvailability);

export default productRouter;
