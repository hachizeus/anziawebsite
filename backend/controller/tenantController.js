import Tenant from '../models/tenantModel.js';
import User from '../models/Usermodel.js';
import Property from '../models/propertymodel.js';

// Get all tenants
export const getAllTenants = async (req, res) => {
  try {
    console.log('Fetching tenants for user:', req.user._id);
    
    // Find tenants
    const tenants = await Tenant.find()
      .populate('userId', 'name email phone address')
      .populate('productId', 'title location price');
    
    console.log(`Found ${tenants.length} tenants`);
    
    res.json({ 
      success: true, 
      tenants: tenants 
    });
  } catch (error) {
    console.error('Error fetching tenants:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get tenant by ID
export const getTenantById = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id)
      .populate('userId', 'name email phone address')
      .populate('productId', 'title location price image');
    
    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Tenant not found' });
    }
    
    // Allow any authenticated user to access tenant details
    res.json({ success: true, tenant });
  } catch (error) {
    console.error('Error fetching tenant:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get tenant by user ID (for tenant dashboard)
export const getTenantByUserId = async (req, res) => {
  try {
    console.log('Fetching tenant data for user:', req.user._id, 'with role:', req.user.role);
    
    // Find all tenant records for this user (to support multiple properties)
    const tenants = await Tenant.find({ userId: req.user._id })
      .populate('productId', 'title location price image description beds baths type');
    
    if (!tenants || tenants.length === 0) {
      console.log('No tenant profile found for user:', req.user._id);
      return res.status(404).json({ success: false, message: 'Tenant profile not found' });
    }
    
    console.log(`Found ${tenants.length} properties for tenant user:`, req.user._id);
    
    // If there's only one product
    if (tenants.length === 1) {
      res.json({ 
        success: true, 
        tenant: tenants[0],
        product: tenants[0].productId,
        payments: tenants[0].paymentHistory
      });
    } 
    // If there are multiple properties
    else {
      const properties = tenants.map(tenant => tenant.productId);
      res.json({ 
        success: true, 
        tenants,
        properties,
        // Include all payments across all properties
        payments: tenants.flatMap(tenant => tenant.paymentHistory)
      });
    }
  } catch (error) {
    console.error('Error fetching tenant by user ID:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get tenant by product ID
export const getTenantByproductId = async (req, res) => {
  try {
    const productId = req.params.productId;
    
    const tenant = await Tenant.findOne({ productId })
      .populate('userId', 'name email phone address')
      .populate('productId', 'title location price image');
    
    if (!tenant) {
      return res.status(404).json({ success: false, message: 'No tenant found for this product' });
    }
    
    res.json({ success: true, tenant });
  } catch (error) {
    console.error('Error fetching tenant by product ID:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create new tenant (admin only)
export const createTenant = async (req, res) => {
  try {
    console.log("Creating tenant with data:", req.body);
    const { email, name, phone, address, productId, leaseStart, leaseEnd, rentAmount, securityDeposit, notes, status, updateproductStatus, createNewUser, password } = req.body;
    
    // Validate required fields
    if (!email || !name || !productId || !leaseStart || !leaseEnd || !rentAmount) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided' });
    }
    
    // Check if product exists
    const property = await Property.findById(productId);
    if (!product) {
      console.log("product not found with ID:", productId);
      return res.status(404).json({ success: false, message: 'product not found' });
    }
    
    // Find or create user
    let user = await User.findOne({ email });
    
    if (!user) {
      // If createNewUser flag is true, use provided password, otherwise generate random password
      const userPassword = createNewUser && password ? password : Math.random().toString(36).slice(-8);
      
      user = new User({
        name,
        email,
        password: userPassword,
        phone,
        address,
        role: 'tenant'
      });
      
      await user.save();
      console.log("New user created:", user._id);
    }
    
    // Check if tenant already exists for this product
    const existingTenantForproduct = await Tenant.findOne({ 
      userId: user._id,
      productId: productId
    });
    
    if (existingTenantForproduct) {
      console.log("User is already a tenant for this product:", productId);
      return res.status(400).json({ success: false, message: 'User is already a tenant for this product' });
    }
    
    // Create new tenant
    const newTenant = new Tenant({
      userId: user._id,
      productId,
      leaseStart,
      leaseEnd,
      rentAmount,
      securityDeposit: securityDeposit || 0,
      notes,
      status: status || 'active',
      paymentHistory: []
    });
    
    // Add initial activity record for dashboard
    newTenant.createdAt = new Date();
    
    await newTenant.save();
    console.log("Tenant created:", newTenant);
    
    // Ensure user role is set to tenant
    if (user.role !== 'tenant') {
      const previousRole = user.role;
      user.role = 'tenant';
      await user.save();
      console.log(`User role updated from ${previousRole} to tenant for user:`, user._id);
    }
    
    // Update product availability if requested
    if (updateproductStatus) {
      Property.availability = 'rented';
      await Property.save();
      console.log("product marked as rented:", Property._id);
    }
    
    res.status(201).json({ 
      success: true, 
      message: 'Tenant created successfully',
      tenant: newTenant
    });
  } catch (error) {
    console.error('Error creating tenant:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};

// Update tenant (admin only)
export const updateTenant = async (req, res) => {
  try {
    const { email, name, phone, address, productId, leaseStart, leaseEnd, rentAmount, securityDeposit, notes, status } = req.body;
    
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Tenant not found' });
    }
    
    // Update tenant fields
    if (productId) tenant.productId = productId;
    if (leaseStart) tenant.leaseStart = leaseStart;
    if (leaseEnd) tenant.leaseEnd = leaseEnd;
    if (rentAmount) tenant.rentAmount = rentAmount;
    if (securityDeposit !== undefined) tenant.securityDeposit = securityDeposit;
    if (notes !== undefined) tenant.notes = notes;
    if (status) tenant.status = status;
    
    await tenant.save();
    
    // Update user information if provided
    if (email || name || phone || address) {
      const user = await User.findById(tenant.userId);
      if (user) {
        if (name) user.name = name;
        if (phone) user.phone = phone;
        if (address) user.address = address;
        
        await user.save();
      }
    }
    
    res.json({ 
      success: true, 
      message: 'Tenant updated successfully',
      tenant
    });
  } catch (error) {
    console.error('Error updating tenant:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Record payment (admin only)
export const recordPayment = async (req, res) => {
  try {
    const { amount, method, date, notes } = req.body;
    
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Tenant not found' });
    }
    
    // Add payment to history
    tenant.paymentHistory.push({
      amount,
      method: method || 'cash',
      date: date || new Date(),
      notes,
      status: 'completed'
    });
    
    await tenant.save();
    
    res.json({ 
      success: true, 
      message: 'Payment recorded successfully',
      payment: tenant.paymentHistory[tenant.paymentHistory.length - 1]
    });
  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete tenant (admin only)
export const deleteTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Tenant not found' });
    }
    
    // Update product availability
    const property = await Property.findById(tenant.productId);
    if (product) {
      Property.availability = 'available';
      await Property.save();
    }
    
    // Check if this is the user's only tenant record
    const tenantCount = await Tenant.countDocuments({ userId: tenant.userId });
    
    // If this is the only tenant record, update user role back to user
    if (tenantCount <= 1) {
      const user = await User.findById(tenant.userId);
      if (user) {
        user.role = 'user';
        await user.save();
        console.log(`User role updated to 'user' for user:`, user._id);
      }
    } else {
      console.log(`User still has ${tenantCount-1} other properties, keeping 'tenant' role`);
    }
    
    await Tenant.findByIdAndDelete(req.params.id);
    
    res.json({ 
      success: true, 
      message: 'Tenant deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting tenant:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
