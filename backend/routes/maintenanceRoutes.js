import express from 'express';
import { 
  createMaintenanceRequest,
  getTenantMaintenanceRequests,
  getAllMaintenanceRequests,
  getMaintenanceRequestById,
  updateMaintenanceRequestStatus,
  addMaintenanceRequestComment
} from '../controller/maintenanceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOrAgent, tenantOnly } from '../middleware/roleMiddleware.js';
import { csrfProtection } from '../middleware/csrfMiddleware.js';

const router = express.Router();

// Tenant routes
router.post('/', protect, tenantOnly, createMaintenanceRequest); // Removed CSRF protection for now
router.get('/tenant', protect, tenantOnly, getTenantMaintenanceRequests);

// Admin/Agent routes
router.get('/', protect, adminOrAgent, getAllMaintenanceRequests);
router.get('/:requestId', protect, getMaintenanceRequestById);
router.put('/:requestId/status', protect, adminOrAgent, csrfProtection, updateMaintenanceRequestStatus);

// Comment routes
router.post('/:requestId/comments', protect, addMaintenanceRequestComment); // Removed CSRF protection for now

export default router;
