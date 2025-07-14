import express from 'express';
import { 
  getAllTenants, 
  getTenantById, 
  getTenantByUserId,
  getTenantByproductId,
  createTenant, 
  updateTenant, 
  recordPayment,
  deleteTenant 
} from '../controller/tenantController.js';
import Tenant from '../models/tenantModel.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly, tenantOnly, adminOrTenant } from '../middleware/roleMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Routes for tenants to access their own data
router.get('/user', tenantOnly, getTenantByUserId);
router.get('/properties', tenantOnly, async (req, res) => {
  try {
    // Find all tenant records for this user
    const tenants = await Tenant.find({ userId: req.user._id })
      .populate('productId', 'title location price image description');
    
    if (!tenants || tenants.length === 0) {
      return res.status(404).json({ success: false, message: 'No properties found for this tenant' });
    }
    
    // Extract properties from tenant records
    const properties = tenants.map(tenant => tenant.productId);
    
    res.json({ 
      success: true, 
      properties
    });
  } catch (error) {
    console.error('Error fetching tenant properties:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Routes accessible by any authenticated user
router.get('/', getAllTenants);
router.post('/', createTenant);
router.get('/product/:productId', getTenantByproductId);
router.get('/:id', getTenantById); // Removed adminOrTenant restriction
router.put('/:id', updateTenant);
router.post('/:id/payment', recordPayment);
router.delete('/:id', deleteTenant);

export default router;
