import express from 'express';
import { 
  getAdminStats,
  getAllAppointments,
  updateAppointmentStatus,
  getAllUsers,
  updateUserRole
} from '../controller/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { handleAgentRoleChanges } from '../middleware/agentMiddleware.js';

const router = express.Router();

// Add admin middleware to protect all admin routes
router.use(protect);
router.use(admin);

router.get('/stats', getAdminStats);
router.get('/appointments', getAllAppointments);
router.put('/appointments/status', updateAppointmentStatus);
router.get('/users', getAllUsers);
router.put('/users/role', handleAgentRoleChanges, updateUserRole);

export default router;
