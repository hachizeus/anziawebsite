import express from 'express';
import { 
  generateFinancialReport,
  getFinancialReports,
  getFinancialReportById,
  deleteFinancialReport,
  createInvoice,
  getInvoices,
  getInvoiceById,
  updateInvoiceStatus,
  deleteInvoice,
  sendInvoiceEmail
} from '../controller/financialController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All routes are protected and admin-only
router.use(protect);
router.use(adminOnly);

// Financial reports routes
router.post('/reports', generateFinancialReport);
router.get('/reports', getFinancialReports);
router.get('/reports/:id', getFinancialReportById);
router.delete('/reports/:id', deleteFinancialReport);

// Invoice routes
router.post('/invoices', createInvoice);
router.get('/invoices', getInvoices);
router.get('/invoices/:id', getInvoiceById);
router.put('/invoices/:id/status', updateInvoiceStatus);
router.delete('/invoices/:id', deleteInvoice);
router.post('/invoices/:id/send', sendInvoiceEmail);

export default router;
