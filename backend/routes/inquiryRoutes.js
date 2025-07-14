import express from 'express';
import { submitInquiry } from '../controller/inquiryController.js';

const router = express.Router();

// Handle all types of product inquiries
router.post('/inquiries', submitInquiry);

export default router;
