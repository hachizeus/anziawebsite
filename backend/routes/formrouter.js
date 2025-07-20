import express from 'express';
import { submitForm, getAllForms } from '../controller/formcontroller.js';

const router = express.Router();

// Submit contact form
router.post('/submit', submitForm);

// Get all forms (admin only)
router.get('/all', getAllForms);

export default router;