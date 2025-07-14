import MaintenanceRequest from '../models/maintenanceRequestModel.js';
import User from '../models/Usermodel.js';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';
import { createNotification } from './adminNotificationController.js';

// Create a new maintenance request
export const createMaintenanceRequest = async (req, res) => {
  try {
    const { 
      productId, 
      title, 
      description, 
      priority, 
      category,
      location,
      availableTimes,
      images 
    } = req.body;
    
    // Validate required fields
    if (!productId || !title || !description || !location) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }
    
    // Create new maintenance request
    const maintenanceRequest = new MaintenanceRequest({
      tenant: req.user._id,
      product: productId,
      title,
      description,
      priority: priority || 'medium',
      category: category || 'other',
      location,
      availableTimes,
      images: images || []
    });
    
    await maintenanceRequest.save();
    
    // Create admin notification
    await createNotification({
      title: 'New Maintenance Request',
      message: `${req.user.name} submitted a new maintenance request: "${title}"`,
      type: 'maintenance',
      relatedId: maintenanceRequest._id,
      relatedModel: 'MaintenanceRequest'
    });
    
    // Send notification email to admin
    try {
      // Find admin users
      const adminUsers = await User.find({ role: 'admin' }).select('email');
      
      if (adminUsers.length > 0) {
        // Create transporter
        const transporter = nodemailer.createTransport({
          host: 'smtp.zoho.com',
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
        
        // Get product details
        const property = await mongoose.model('product').findById(productId).select('title location');
        const productDetails = product ? `${product.title} - ${product.location}` : productId;
        
        // Send email to each admin
        for (const admin of adminUsers) {
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: admin.email,
            subject: `New Maintenance Request: ${title}`,
            html: `
              <h1>New Maintenance Request</h1>
              <p><strong>product:</strong> ${productDetails}</p>
              <p><strong>Title:</strong> ${title}</p>
              <p><strong>Description:</strong> ${description}</p>
              <p><strong>Priority:</strong> ${priority || 'medium'}</p>
              <p><strong>Category:</strong> ${category || 'other'}</p>
              <p><strong>Location:</strong> ${location}</p>
              <p><strong>Submitted by:</strong> ${req.user.name} (${req.user.email})</p>
              <p>Please log in to the admin dashboard to respond to this request.</p>
              <p><a href="${process.env.ADMIN_URL || 'http://localhost:5174'}/maintenance" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">View in Admin Dashboard</a></p>
            `
          };
          
          await transporter.sendMail(mailOptions);
          console.log(`Maintenance request notification sent to admin: ${admin.email}`);
        }
      }
    } catch (emailError) {
      console.error('Error sending maintenance request notification:', emailError);
      // Continue even if email fails
    }
    
    res.status(201).json({
      success: true,
      message: 'Maintenance request created successfully',
      maintenanceRequest
    });
  } catch (error) {
    console.error('Error creating maintenance request:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get all maintenance requests for a tenant
export const getTenantMaintenanceRequests = async (req, res) => {
  try {
    const maintenanceRequests = await MaintenanceRequest.find({ tenant: req.user._id })
      .sort({ createdAt: -1 })
      .populate('product', 'title location')
      .populate('assignedTo', 'name email');
    
    res.json({
      success: true,
      count: maintenanceRequests.length,
      maintenanceRequests
    });
  } catch (error) {
    console.error('Error fetching maintenance requests:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get all maintenance requests (admin only)
export const getAllMaintenanceRequests = async (req, res) => {
  try {
    const { status, priority, product } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (product) filter.product = product;
    
    const maintenanceRequests = await MaintenanceRequest.find(filter)
      .sort({ createdAt: -1 })
      .populate('tenant', 'name email')
      .populate('product', 'title location')
      .populate('assignedTo', 'name email');
    
    res.json({
      success: true,
      count: maintenanceRequests.length,
      maintenanceRequests
    });
  } catch (error) {
    console.error('Error fetching maintenance requests:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Get maintenance request by ID
export const getMaintenanceRequestById = async (req, res) => {
  try {
    const { requestId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid maintenance request ID'
      });
    }
    
    const maintenanceRequest = await MaintenanceRequest.findById(requestId)
      .populate('tenant', 'name email')
      .populate('product', 'title location')
      .populate('assignedTo', 'name email')
      .populate('comments.user', 'name email');
    
    if (!maintenanceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }
    
    // Check if user is authorized to view this request
    if (
      req.user.role !== 'admin' && 
      req.user.role !== 'agent' && 
      maintenanceRequest.tenant._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this maintenance request'
      });
    }
    
    res.json({
      success: true,
      maintenanceRequest
    });
  } catch (error) {
    console.error('Error fetching maintenance request:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Update maintenance request status (admin or assigned agent only)
export const updateMaintenanceRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status, assignedTo, estimatedCompletionDate, comment } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid maintenance request ID'
      });
    }
    
    const maintenanceRequest = await MaintenanceRequest.findById(requestId);
    
    if (!maintenanceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }
    
    // Check if user is authorized to update this request
    if (
      req.user.role !== 'admin' && 
      (maintenanceRequest.assignedTo && maintenanceRequest.assignedTo.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this maintenance request'
      });
    }
    
    // Update fields
    if (status) {
      maintenanceRequest.status = status;
      
      // If status is completed, set actual completion date
      if (status === 'completed') {
        maintenanceRequest.actualCompletionDate = new Date();
      }
    }
    
    if (assignedTo && mongoose.Types.ObjectId.isValid(assignedTo)) {
      maintenanceRequest.assignedTo = assignedTo;
    }
    
    if (estimatedCompletionDate) {
      maintenanceRequest.estimatedCompletionDate = new Date(estimatedCompletionDate);
    }
    
    // Add comment if provided
    if (comment) {
      maintenanceRequest.comments.push({
        user: req.user._id,
        text: comment
      });
    }
    
    await maintenanceRequest.save();
    
    // Send notification email to tenant
    try {
      const tenant = await User.findById(maintenanceRequest.tenant);
      
      if (tenant) {
        // Create transporter
        const transporter = nodemailer.createTransport({
          host: 'smtp.zoho.com',
          port: 465,
          secure: true,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
          }
        });
        
        // Send email to tenant
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: tenant.email,
          subject: `Maintenance Request Update: ${maintenanceRequest.title}`,
          html: `
            <h1>Maintenance Request Update</h1>
            <p>Your maintenance request "${maintenanceRequest.title}" has been updated.</p>
            <p><strong>Status:</strong> ${maintenanceRequest.status}</p>
            ${estimatedCompletionDate ? `<p><strong>Estimated Completion:</strong> ${new Date(estimatedCompletionDate).toLocaleDateString()}</p>` : ''}
            ${comment ? `<p><strong>Comment:</strong> ${comment}</p>` : ''}
            <p>Please log in to your tenant dashboard to view more details.</p>
            <p><a href="${process.env.WEBSITE_URL || 'http://localhost:5173'}/tenant/dashboard" style="background-color: #4CAF50; color: white; padding: 10px 15px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">View in Tenant Dashboard</a></p>
          `
        };
        
        await transporter.sendMail(mailOptions);
      }
    } catch (emailError) {
      console.error('Error sending maintenance update notification:', emailError);
      // Continue even if email fails
    }
    
    res.json({
      success: true,
      message: 'Maintenance request updated successfully',
      maintenanceRequest
    });
  } catch (error) {
    console.error('Error updating maintenance request:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Add comment to maintenance request
export const addMaintenanceRequestComment = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { text } = req.body;
    
    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required'
      });
    }
    
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid maintenance request ID'
      });
    }
    
    const maintenanceRequest = await MaintenanceRequest.findById(requestId);
    
    if (!maintenanceRequest) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance request not found'
      });
    }
    
    // Check if user is authorized to comment on this request
    if (
      req.user.role !== 'admin' && 
      req.user.role !== 'agent' && 
      maintenanceRequest.tenant.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to comment on this maintenance request'
      });
    }
    
    // Add comment
    maintenanceRequest.comments.push({
      user: req.user._id,
      text
    });
    
    await maintenanceRequest.save();
    
    // Populate user info in the new comment
    const updatedRequest = await MaintenanceRequest.findById(requestId)
      .populate('comments.user', 'name email');
    
    res.json({
      success: true,
      message: 'Comment added successfully',
      comment: updatedRequest.comments[updatedRequest.comments.length - 1]
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};
