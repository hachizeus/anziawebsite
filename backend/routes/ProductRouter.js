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

productRouter.post('/add', upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 }
]), addProduct);


productRouter.get('/list', getAllProducts);
productRouter.delete('/remove/:id', deleteProduct);
productRouter.put('/update/:id', upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 }
]), updateProduct);
productRouter.get('/single/:id', getProductById);
productRouter.post('/toggle-availability', toggleProductAvailability);

export default productRouter;
