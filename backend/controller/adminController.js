import Stats from '../models/statsModel.js';
import Property from '../models/propertymodel.js';
import Appointment from '../models/appointmentModel.js';
import User from '../models/Usermodel.js';
import Tenant from '../models/tenantModel.js';
import transporter from '../config/nodemailer.js';
import { getEmailTemplate } from "../email.js";
import { getRoleChangeEmailTemplate } from "../email-templates/roleChangeTemplate.js";
import mongoose from "mongoose";
import { createNotification } from './adminNotificationController.js';

const formatRecentProperties = (properties) => {
  return properties.map((product) => ({
    type: "product",
    description: `New product listed: ${product.title}`,
    timestamp: product.createdAt,
  }));
};

const formatRecentAppointments = (appointments) => {
  return appointments.map((appointment) => ({
    type: "appointment",
    description:
      appointment.userId && appointment.productId
        ? `${appointment.userId.name} scheduled viewing for ${appointment.productId.title}`
        : "Appointment scheduled",
    timestamp: appointment.createdAt,
  }));
};

const formatRecentTenants = (tenants) => {
  return tenants.map((tenant) => ({
    type: "tenant",
    description: tenant.userId && tenant.productId
      ? `${tenant.userId.name} added as tenant for ${tenant.productId.title}`
      : "New tenant added",
    timestamp: tenant.createdAt,
  }));
};

export const getAdminStats = async (req, res) => {
  try {
    // Check if Appointment collection exists and has documents
    let pendingAppointments = 0;
    try {
      pendingAppointments = await Appointment.countDocuments({ status: "pending" });
    } catch (appointmentError) {
      console.log("No appointments found or collection doesn't exist:", appointmentError.message);
      // Keep pendingAppointments as 0
    }

    const [
      totalProperties,
      activeListings,
      totalUsers,
      recentActivity,
      viewsData,
      totalViews,
      totalTenants,
    ] = await Promise.all([
      Property.countDocuments(),
      Property.countDocuments({ availability: "available" }),
      User.countDocuments(),
      getRecentActivity(),
      getViewsData(),
      Stats.countDocuments({
        endpoint: /^\/api\/properties\/[a-f\d]{24}$/,
        method: "GET"
      }),
      Tenant.countDocuments(),
    ]);

    res.json({
      success: true,
      stats: {
        totalProperties,
        activeListings,
        totalUsers,
        totalViews,
        pendingAppointments,
        recentActivity,
        viewsData,
        totalTenants,
      },
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching admin statistics",
    });
  }
};

const getRecentActivity = async () => {
  try {
    const recentProperties = await Property.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("title createdAt");

    // Handle appointments safely
    let recentAppointments = [];
    try {
      recentAppointments = await Appointment.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("productId", "title")
        .populate("userId", "name");
    } catch (appointmentError) {
      console.log("Error fetching appointments:", appointmentError.message);
      // Keep recentAppointments as empty array
    }

    // Handle tenants safely
    let recentTenants = [];
    try {
      recentTenants = await Tenant.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("productId", "title")
        .populate("userId", "name");
    } catch (tenantError) {
      console.log("Error fetching tenants:", tenantError.message);
      // Keep recentTenants as empty array
    }

    const validAppointments = recentAppointments.filter(
      (appointment) => appointment.userId && appointment.productId
    );

    const validTenants = recentTenants.filter(
      (tenant) => tenant.userId && tenant.productId
    );

    return [
      ...formatRecentProperties(recentProperties),
      ...formatRecentAppointments(validAppointments),
      ...formatRecentTenants(validTenants),
    ].sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error("Error getting recent activity:", error);
    return [];
  }
};

const getViewsData = async () => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const stats = await Stats.aggregate([
      {
        $match: {
          endpoint: /^\/api\/properties\/[a-f\d]{24}$/,
          method: "GET",
          timestamp: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const labels = [];
    const data = [];
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split("T")[0];
      labels.push(dateString);

      const stat = stats.find((s) => s._id === dateString);
      data.push(stat ? stat.count : 0);
    }

    return {
      labels,
      datasets: [
        {
          label: "product Views",
          data,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  } catch (error) {
    console.error("Error generating chart data:", error);
    return {
      labels: [],
      datasets: [
        {
          label: "product Views",
          data: [],
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("productId", "title location")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching appointments",
    });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { status },
      { new: true }
    ).populate("productId userId");

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: appointment.userId.email,
      subject: `Viewing Appointment ${
        status.charAt(0).toUpperCase() + status.slice(1)
      } - Anzia Electronics `,
      html: getEmailTemplate(appointment, status),
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${appointment.userId.email}`);
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
    }

    res.json({
      success: true,
      message: `Appointment ${status} successfully`,
      appointment,
    });
  } catch (error) {
    console.error("Error updating appointment:", error);
    res.status(500).json({
      success: false,
      message: "Error updating appointment",
    });
  }
};

// Get all users for admin management
export const getAllUsers = async (req, res) => {
  try {
    console.log("Fetching all users...");
    // Find all users
    const users = await User.find({}).lean();
    
    // Format for response
    const formattedUsers = users.map(user => {
      // Don't send password
      delete user.password;
      delete user.resetToken;
      delete user.resetTokenExpire;
      
      return user;
    });
    
    console.log(`Found ${formattedUsers.length} users`);
    
    res.json({
      success: true,
      users: formattedUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
    });
  }
};

// Update user role (tenant or user)
// Get properties pending approval
export const getPendingProperties = async (req, res) => {
  try {
    const pendingProperties = await Property.find({
      createdBy: 'agent',
      approvalStatus: 'pending'
    }).populate({
      path: 'agentId',
      select: 'userId',
      populate: {
        path: 'userId',
        select: 'name email'
      }
    }).sort({ updatedAt: -1 });
    
    res.json({
      success: true,
      properties: pendingProperties
    });
  } catch (error) {
    console.error('Error fetching pending properties:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending properties'
    });
  }
};

// Approve or reject a product
export const updateproductApproval = async (req, res) => {
  try {
    const { productId, action, notes } = req.body;
    
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Must be either "approve" or "reject"'
      });
    }
    
    const property = await Property.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'product not found'
      });
    }
    
    // Update product approval status
    property.approvalStatus = action === 'approve' ? 'approved' : 'rejected';
    property.isApproved = action === 'approve';
    property.visible = action === 'approve'; // Only make visible if approved
    property.approvalNotes = notes || '';
    
    await property.save();
    
    // Create notification for product approval action
    await createNotification({
      title: `product ${action === 'approve' ? 'Approved' : 'Rejected'}`,
      message: `Property "${property.title}" has been ${action === 'approve' ? 'approved' : 'rejected'}.`,
      type: 'property_approval',
      relatedId: property._id,
      relatedModel: 'product'
    });
    
    // If there's an agent associated with this product, notify them
    if (property.agentId) {
      const agent = await mongoose.model('Agent').findById(property.agentId).populate('userId');
      
      if (agent && agent.userId && agent.userId.email) {
        try {
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: agent.userId.email,
            subject: `product Listing ${action === 'approve' ? 'Approved' : 'Rejected'} - Anzia Electronics `,
            html: `
              <div style="max-width: 600px; margin: 20px auto; font-family: 'Arial', sans-serif; line-height: 1.6;">
                <div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
                  <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">product Listing ${action === 'approve' ? 'Approved' : 'Rejected'}</h1>
                </div>
                <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
                  <p>Hello ${agent.userId.name},</p>
                  <p>Your property listing <strong>${property.title}</strong> has been ${action === 'approve' ? 'approved' : 'rejected'}.</p>
                  ${action === 'approve' ? 
                    '<p>Your product is now live on our website and visible to potential clients.</p>' : 
                    '<p>Please review the feedback below and make necessary changes before resubmitting.</p>'
                  }
                  ${notes ? `<div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;"><p><strong>Feedback:</strong> ${notes}</p></div>` : ''}
                  <p>Thank you,<br>Makini Realtors Team</p>
                </div>
              </div>
            `
          };
          
          await transporter.sendMail(mailOptions);
        } catch (emailError) {
          console.error('Failed to send product approval email:', emailError);
        }
      }
    }
    
    res.json({
      success: true,
      message: `product ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      product
    });
  } catch (error) {
    console.error(`Error ${req.body.action}ing product:`, error);
    res.status(500).json({
      success: false,
      message: `Error ${req.body.action}ing product`
    });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId, role, productId } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    if (!['tenant', 'user', 'agent'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role. Role must be 'tenant', 'user', or 'agent'",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if changing from user to tenant
    if (role === 'tenant' && user.role !== 'tenant') {
      // Check if there's already a tenant record for this user
      const existingTenant = await Tenant.findOne({ userId: user._id });
      
      if (!existingTenant) {
        // Check if a specific product was provided
        let selectedproduct;
        if (productId) {
          selectedProperty = await Property.findById(productId);
          if (!selectedproduct) {
            return res.status(404).json({
              success: false,
              message: "Selected product not found"
            });
          }
        } else {
          // Find an available product if none was specified
          selectedProperty = await Property.findOne({ availability: 'available' });
        }
        
        if (selectedProperty) {
          // Create a tenant record with the selected property
          const newTenant = new Tenant({
            userId: user._id,
            productId: selectedProperty._id,
            leaseStart: new Date(),
            leaseEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            rentAmount: selectedProperty.price || 1000,
            status: 'active',
            createdAt: new Date() // Ensure createdAt is set for activity feed
          });
          
          await newTenant.save();
          console.log(`Created tenant record for user ${userId} with property ${selectedProperty._id}`);
          
          // Update property availability
          selectedProperty.availability = 'rented';
          await selectedProperty.save();
        } else {
          console.log(`No available properties found for new tenant ${userId}`);
          // Create a tenant record with a temporary product ID
          // This ensures the user appears in the tenant list even without a product
          const newTenant = new Tenant({
            userId: user._id,
            productId: new mongoose.Types.ObjectId(), // Generate a valid ObjectId
            leaseStart: new Date(),
            leaseEnd: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            rentAmount: 0,
            status: 'pending',
            createdAt: new Date(), // Ensure createdAt is set for activity feed
            notes: 'Tenant created from user management. Please assign a product.'
          });
          
          await newTenant.save();
          console.log(`Created placeholder tenant record for user ${userId}`);
        }
      } else {
        console.log(`User ${userId} already has a tenant record`);
      }
    } 
    // Check if changing from tenant to user
    else if (role === 'user' && user.role === 'tenant') {
      // Find all tenant records for this user
      const tenantRecords = await Tenant.find({ userId: user._id });
      
      // Update all associated properties to available
      for (const tenant of tenantRecords) {
        if (tenant.productId) {
          const property = await Property.findById(tenant.productId);
          if (property) {
            property.availability = 'available';
            await property.save();
          }
        }
        
        // Delete the tenant record
        await Tenant.findByIdAndDelete(tenant._id);
      }
      
      console.log(`Removed tenant records for user ${userId}`);
    }

    // Update user role
    user.role = role;
    await user.save();

    // Send notification to the user about role change
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Your Account Role Has Been Updated - Anzia Electronics `,
        html: getRoleChangeEmailTemplate(user, role),
      };
      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Failed to send role update email:", emailError);
    }

    res.json({
      success: true,
      message: `User role updated to ${role} successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({
      success: false,
      message: "Error updating user role",
    });
  }
};
