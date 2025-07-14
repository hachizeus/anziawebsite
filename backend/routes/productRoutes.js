import express from 'express';
import { 
    getAllProducts, 
    getProductById 
} from '../controller/productcontroller.js';

const router = express.Router();

// Public routes for products
router.get('/', getAllProducts);
router.get('/:id', getProductById);

export default router;