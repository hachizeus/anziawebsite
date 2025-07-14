import Agent from '../models/agentModel.js';
import Property from '../models/propertymodel.js';
import User from '../models/Usermodel.js';
import transporter from '../config/nodemailer.js';
import mongoose from 'mongoose';
import { createNotification } from './adminNotificationController.js';

// Get agent profile
export const getAgentProfile = async (req, res) => {
  try {
    // Get user ID from token or use default
    const userId = req.user?._id || '6865cef8d1e288afd22fe6a4';
    
    let agent = await Agent.findOne({ userId })
      .populate('userId', 'name email profilePicture profileImage')
      .populate('properties');
    
    if (!agent) {
      // Create default agent if not found
      agent = {
        _id: 'default',
        userId: { _id: userId, name: 'Agent', email: 'agent@example.com' },
        bio: '',
        phone: '',
        whatsapp: '',
        email: 'agent@example.com',
        currency: 'KSH',
        subscription: 'basic',
        active: true,
        visible: true,
        properties: []
      };
    }
    
    console.log('Agent profile data:', {
      agentId: agent._id,
      agentProfilePicture: agent.profilePicture,
      userProfilePicture: agent.userId?.profilePicture,
      userProfileImage: agent.userId?.profileImage
    });
    
    res.json({
      success: true,
      agent
    });
  } catch (error) {
    console.error('Error fetching agent profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching agent profile'
    });
  }
};

// Update agent profile
export const updateAgentProfile = async (req, res) => {
  try {
    const { bio, phone, whatsapp, email, currency, profilePicture, profilePictureBase64 } = req.body;
    
    // Get user ID from token or use default
    const userId = req.user?._id || '6865cef8d1e288afd22fe6a4';
    
    let agent = await Agent.findOne({ userId });
    
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent profile not found'
      });
    }
    
    // Handle profile picture upload if base64 image is provided
    let profilePictureUrl = profilePicture;
    
    if (profilePictureBase64) {
      console.log('Profile picture upload requested');
      try {
        // Import imagekit
        const imagekit = (await import('../config/imagekit.js')).default;
        
        // Extract base64 data
        const base64Data = profilePictureBase64.split(',')[1];
        console.log('Base64 data extracted, length:', base64Data?.length);
        
        if (base64Data) {
          console.log('Uploading to ImageKit...');
          // Upload to ImageKit
          const uploadResult = await imagekit.upload({
            file: base64Data,
            fileName: `profile_${Date.now()}_${req.user._id}`,
            folder: '/profile-pictures',
            useUniqueFileName: true
          });
          
          console.log('ImageKit upload successful:', uploadResult.url);
          // Set the profile picture URL
          profilePictureUrl = uploadResult.url;
        }
      } catch (uploadError) {
        console.error('Error uploading profile picture to ImageKit:', uploadError);
        return res.status(500).json({
          success: false,
          message: 'Failed to upload profile picture: ' + uploadError.message
        });
      }
    }
    
    // Update fields
    if (bio !== undefined) agent.bio = bio;
    if (phone !== undefined) agent.phone = phone;
    if (whatsapp !== undefined) agent.whatsapp = whatsapp;
    if (email !== undefined) agent.email = email;
    if (currency !== undefined) agent.currency = currency;
    if (profilePictureUrl) agent.profilePicture = profilePictureUrl;
    
    await agent.save();
    
    // Update user data with profile picture
    if (profilePictureUrl) {
      const user = await User.findById(userId);
      if (user) {
        console.log('Updating user profile picture:', {
          userId: user._id,
          oldProfilePicture: user.profilePicture,
          newProfilePicture: profilePictureUrl
        });
        user.profilePicture = profilePictureUrl;
        user.profileImage = profilePictureUrl; // Also update profileImage for consistency
        await user.save();
        console.log('User profile picture updated successfully');
      }
    }
    
    res.json({
      success: true,
      message: 'Agent profile updated successfully',
      agent
    });
  } catch (error) {
    console.error('Error updating agent profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating agent profile'
    });
  }
};

// Get agent properties
export const getAgentProperties = async (req, res) => {
  try {
    // Get user ID from token or use default
    const userId = req.user?._id || '6865cef8d1e288afd22fe6a4';
    
    let agent = await Agent.findOne({ userId });
    
    if (!agent) {
      // Return empty properties if no agent found
      return res.json({
        success: true,
        properties: [],
        currency: 'KSH'
      });
    }
    
    const properties = await Property.find({ agentId: agent._id });
    
    res.json({
      success: true,
      properties,
      currency: agent.currency || 'KSH'
    });
  } catch (error) {
    console.error('Error fetching agent properties:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching agent properties'
    });
  }
};

// Create product listing
export const createproduct = async (req, res) => {
  try {
    // Get user ID from token or use default
    const userId = req.user?._id || '6865cef8d1e288afd22fe6a4';
    
    const agent = await Agent.findOne({ userId });
    
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent profile not found'
      });
    }
    
    if (!agent.active) {
      return res.status(403).json({
        success: false,
        message: 'Your agent account is currently inactive. Please contact admin.'
      });
    }
    
    const { title, location, latitude, longitude, price, beds, baths, sqft, type, availability, description, phone, amenities, category } = req.body;
    const videoUrl = req.body.videoUrl || null;

    // Debug log
    console.log("Agent product creation - received coordinates:", latitude, longitude);
    console.log("Agent product creation - received files:", req.files);

    // Handle image uploads
    const imageUrls = [];
    if (req.files) {
      for (let i = 1; i <= 4; i++) {
        const fieldName = `image${i}`;
        if (req.files[fieldName] && req.files[fieldName][0]) {
          const file = req.files[fieldName][0];
          const encodedImage = file.buffer.toString('base64');
          
          try {
            // Import imagekit from config
            const imagekit = (await import('../config/imagekit.js')).default;
            
            const result = await imagekit.upload({
              file: encodedImage,
              fileName: `product_${Date.now()}_${i}`,
              folder: '/properties'
            });
            
            console.log(`Image ${i} uploaded:`, result.url);
            imageUrls.push(result.url);
          } catch (uploadError) {
            console.error(`Error uploading image ${i}:`, uploadError);
            // Use a placeholder if upload fails
            imageUrls.push(`https://via.placeholder.com/800x600?text=Image+${i}+Failed`);
          }
        }
      }
    }
    
    // If no images were uploaded, use a placeholder
    if (imageUrls.length === 0) {
      imageUrls.push('https://via.placeholder.com/800x600?text=No+Image');
    }

    // Handle video upload
    let videoLink = null;
    if (req.files && req.files.video && req.files.video[0]) {
      try {
        const videoFile = req.files.video[0];
        
        // Check file size (limit to 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (videoFile.size > maxSize) {
          console.error("Video file too large:", videoFile.size);
          throw new Error("Video file size exceeds 5MB limit");
        }
        
        // Import imagekit from config
        const imagekit = (await import('../config/imagekit.js')).default;
        
        // Simple base64 encoding
        const encodedVideo = videoFile.buffer.toString('base64');
        
        // Upload to ImageKit with simple settings
        const result = await imagekit.upload({
          file: encodedVideo,
          fileName: `product_video_${Date.now()}.mp4`,
          folder: '/product-videos'
        });
        
        console.log("Video uploaded successfully:", result.url);
        videoLink = result.url;
      } catch (videoError) {
        console.error("Error uploading video:", videoError);
      }
    }
    
    // Parse amenities
    let amenitiesArray = [];
    try {
      if (amenities) {
        amenitiesArray = JSON.parse(amenities);
      }
    } catch (e) {
      console.error("Error parsing amenities:", e);
      if (Array.isArray(amenities)) {
        amenitiesArray = amenities;
      }
    }
    
    // Create product with pending approval status
    const product = new Property({
      title,
      location,
      latitude: latitude || null,
      longitude: longitude || null,
      price: Number(price),
      image: imageUrls,
      video: videoLink,
      beds: Number(beds),
      baths: Number(baths),
      sqft: Number(sqft),
      type,
      category,
      availability,
      description,
      phone,
      amenities: amenitiesArray,
      agentId: agent._id,
      createdBy: 'agent',
      visible: false, // Initially hidden until approved
      isApproved: false,
      approvalStatus: 'pending',
      approvalNotes: '',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    await Property.save();
    
    // Add product to agent's properties array
    agent.properties.push(Property._id);
    await agent.save();
    
    res.status(201).json({
      success: true,
      message: 'product created successfully',
      product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// Update product listing
export const updateproduct = async (req, res) => {
  try {
    const { id } = req.params;
    // Get user ID from token or use default
    const userId = req.user?._id || '6865cef8d1e288afd22fe6a4';
    
    const agent = await Agent.findOne({ userId });
    
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent profile not found'
      });
    }
    
    // Check if product belongs to this agent
    const property = await Property.findOne({ 
      _id: id,
      agentId: agent._id
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'product not found or you do not have permission to edit it'
      });
    }
    
    const { title, location, latitude, longitude, price, beds, baths, sqft, type, availability, description, phone, amenities, category } = req.body;
    
    // Handle image uploads
    const imageUrls = [...Property.image]; // Start with existing images
    if (req.files) {
      for (let i = 1; i <= 4; i++) {
        const fieldName = `image${i}`;
        if (req.files[fieldName] && req.files[fieldName][0]) {
          const file = req.files[fieldName][0];
          const encodedImage = file.buffer.toString('base64');
          
          try {
            // Import imagekit from config
            const imagekit = (await import('../config/imagekit.js')).default;
            
            const result = await imagekit.upload({
              file: encodedImage,
              fileName: `product_${Date.now()}_${i}`,
              folder: '/properties'
            });
            
            console.log(`Updated image ${i}:`, result.url);
            
            // Replace or add image at index i-1
            if (imageUrls.length >= i) {
              imageUrls[i-1] = result.url;
            } else {
              imageUrls.push(result.url);
            }
          } catch (uploadError) {
            console.error(`Error uploading image ${i}:`, uploadError);
          }
        }
      }
      
      // Handle video upload
      if (req.files.video && req.files.video[0]) {
        try {
          const videoFile = req.files.video[0];
          
          // Check file size (limit to 5MB)
          const maxSize = 5 * 1024 * 1024; // 5MB in bytes
          if (videoFile.size > maxSize) {
            console.error("Video file too large:", videoFile.size);
            throw new Error("Video file size exceeds 5MB limit");
          }
          
          // Import imagekit from config
          const imagekit = (await import('../config/imagekit.js')).default;
          
          const encodedVideo = videoFile.buffer.toString('base64');
          
          const result = await imagekit.upload({
            file: encodedVideo,
            fileName: `product_video_${Date.now()}.mp4`,
            folder: '/product-videos',
            useUniqueFileName: true
          });
          
          console.log("Video updated successfully:", result.url);
          Property.video = result.url;
        } catch (videoError) {
          console.error("Error updating video:", videoError);
        }
      }
    }
    
    // Parse amenities
    let amenitiesArray = [];
    try {
      if (amenities) {
        amenitiesArray = JSON.parse(amenities);
      }
    } catch (e) {
      console.error("Error parsing amenities:", e);
      if (Array.isArray(amenities)) {
        amenitiesArray = amenities;
      }
    }
    
    // Update product fields and reset approval status to pending
    const updatedproduct = await Property.findByIdAndUpdate(
      id,
      {
        title,
        location,
        latitude: latitude || null,
        longitude: longitude || null,
        price: Number(price),
        image: imageUrls,
        video: Property.video, // Include the updated video URL
        beds: Number(beds),
        baths: Number(baths),
        sqft: Number(sqft),
        type,
        category,
        availability,
        description,
        amenities: amenitiesArray,
        phone,
        visible: false, // Hide when edited until re-approved
        isApproved: false,
        approvalStatus: 'pending',
        approvalNotes: Property.approvalNotes ? Property.approvalNotes + '\n[Edit: product has been modified and requires re-approval]' : '[Edit: product has been modified and requires re-approval]',
        updatedAt: new Date()
      },
      { new: true }
    );
    
    res.json({
      success: true,
      message: 'product updated successfully',
      product: updatedproduct
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// Toggle product visibility
export const toggleproductVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    // Get user ID from token or use default
    const userId = req.user?._id || '6865cef8d1e288afd22fe6a4';
    
    const agent = await Agent.findOne({ userId });
    
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent profile not found'
      });
    }
    
    // Check if product belongs to this agent
    const property = await Property.findOne({ 
      _id: id,
      agentId: agent._id
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'product not found or you do not have permission to edit it'
      });
    }
    
    // Toggle visibility
    Property.visible = !Property.visible;
    await Property.save();
    
    res.json({
      success: true,
      message: `product is now ${Property.visible ? 'visible' : 'hidden'}`,
      product
    });
  } catch (error) {
    console.error('Error toggling product visibility:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling product visibility'
    });
  }
};

// Delete product listing
export const deleteproduct = async (req, res) => {
  try {
    const { id } = req.params;
    // Get user ID from token or use default
    const userId = req.user?._id || '6865cef8d1e288afd22fe6a4';
    
    const agent = await Agent.findOne({ userId });
    
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent profile not found'
      });
    }
    
    // Check if product belongs to this agent
    const property = await Property.findOne({ 
      _id: id,
      agentId: agent._id
    });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'product not found or you do not have permission to delete it'
      });
    }
    
    // Remove product from agent's properties array
    agent.properties = agent.properties.filter(
      propId => propId.toString() !== id
    );
    await agent.save();
    
    // Delete the product
    await Property.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: 'product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product'
    });
  }
};

// Request to become an agent
export const requestAgentRole = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    
    console.log('Received agent request:', { name, email, phone, message });
    
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and phone are required fields'
      });
    }
    
    // Send email to admin
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'management@Anzia Electronics .co.ke',
        subject: 'New Agent Registration Request - Real Estate Website',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #333;">New Agent Registration Request</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Message:</strong> ${message || 'No additional message'}</p>
            <p>Please review this request in the admin dashboard.</p>
          </div>
        `
      };
      
      await transporter.sendMail(mailOptions);
      
      // Create admin notification with more detailed logging
      console.log('Creating agent request notification');
      try {
        const notification = await createNotification({
          title: 'New Agent Request',
          message: `${name} (${email}) has requested to become an agent.`,
          type: 'agent_request'
        });
        console.log('Agent request notification created:', notification ? notification._id : 'Failed');
      } catch (notificationError) {
        console.error('Error creating agent request notification:', notificationError);
      }
      
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Continue even if email fails
    }
    
    res.json({
      success: true,
      message: 'Your request has been submitted and is under review'
    });
  } catch (error) {
    console.error('Error submitting agent request:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting agent request'
    });
  }
};

// Admin functions for agent management

// Get all agents (admin only)
export const getAllAgents = async (req, res) => {
  try {
    const agents = await Agent.find()
      .populate('userId', 'name email')
      .populate('properties');
    
    res.json({
      success: true,
      agents
    });
  } catch (error) {
    console.error('Error fetching agents:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching agents'
    });
  }
};

// Toggle agent visibility (admin only)
export const toggleAgentVisibility = async (req, res) => {
  try {
    const { agentId } = req.body;
    
    const agent = await Agent.findById(agentId);
    
    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }
    
    // Toggle visibility
    agent.visible = !agent.visible;
    await agent.save();
    
    // Update visibility of all agent's properties
    await Property.updateMany(
      { agentId: agent._id },
      { visible: agent.visible }
    );
    
    res.json({
      success: true,
      message: `Agent and their properties are now ${agent.visible ? 'visible' : 'hidden'}`,
      agent
    });
  } catch (error) {
    console.error('Error toggling agent visibility:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling agent visibility'
    });
  }
};

// Create agent profile (admin only)
export const createAgentProfile = async (req, res) => {
  try {
    const { userId, subscription } = req.body;
    
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if agent profile already exists
    let agent = await Agent.findOne({ userId });
    if (agent) {
      return res.status(400).json({
        success: false,
        message: 'Agent profile already exists for this user'
      });
    }
    
    // Update user role to agent - this should trigger the automatic agent profile creation
    user.role = 'agent';
    await user.save();
    
    // Verify the agent profile was created
    agent = await Agent.findOne({ userId });
    if (!agent) {
      // If not created automatically, create it manually using the utility
      try {
        // Import the agent profile creation utility
        const { createAgentProfileForUser } = await import('../utils/createAgentProfile.js');
        
        // Create agent profile
        agent = await createAgentProfileForUser(userId, user.email);
      } catch (err) {
        console.error('Error using utility to create agent profile:', err);
        
        // Fallback to direct creation
        agent = new Agent({
          userId,
          subscription: subscription || 'basic',
          email: user.email,
          active: true,
          visible: true,
          subscriptionExpiry: new Date(new Date().setMonth(new Date().getMonth() + 1)) // Default 1 month
        });
        
        await agent.save();
      }
    }
    
    // Update subscription if needed
    if (subscription && agent.subscription !== subscription) {
      agent.subscription = subscription;
      await agent.save();
    }
    
    console.log('Agent profile created/updated successfully:', agent._id);
    
    // Send notification to the user
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your Agent Account is Active - Real Estate Website',
      html: `
        <div style="max-width: 600px; margin: 20px auto; font-family: 'Arial', sans-serif; line-height: 1.6;">
          <div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Welcome to Real Estate Agent Program!</h1>
          </div>
          <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
            <p>Hello ${user.name},</p>
            <p>Your request to become an agent has been approved. You now have access to the Agent Dashboard where you can create and manage product listings.</p>
            <p>Your subscription plan: <strong>${agent.subscription}</strong></p>
            <p>Subscription expiry: <strong>${new Date(agent.subscriptionExpiry).toLocaleDateString()}</strong></p>
            <p>If you have any questions, please contact our support team.</p>
            <p>Thank you,<br>Real Estate Team</p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    
    res.status(201).json({
      success: true,
      message: 'Agent profile created successfully',
      agent
    });
  } catch (error) {
    console.error('Error creating agent profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating agent profile'
    });
  }
};

// Get all properties for explore page
export const getExploreProperties = async (req, res) => {
  try {
    // Get all visible and approved properties (both admin and agent properties)
    const properties = await Property.find({ 
      visible: true,
      $or: [
        { createdBy: 'admin' }, // Admin properties don't need approval
        { isApproved: true }     // Agent properties must be approved
      ]
    })
    .populate({
      path: 'agentId',
      select: 'userId bio phone whatsapp email profilePicture',
      populate: {
        path: 'userId',
        select: 'name email profilePicture profileImage'
      }
    })
    .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      properties
    });
  } catch (error) {
    console.error('Error fetching explore properties:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching explore properties'
    });
  }
};

// Get product by ID for explore page
export const getExploreproductById = async (req, res) => {
  try {
    const property = await Property.findOne({ 
      _id: req.params.id,
      visible: true,
      $or: [
        { createdBy: 'admin' }, // Admin properties don't need approval
        { isApproved: true }     // Agent properties must be approved
      ]
    })
    .populate({
      path: 'agentId',
      select: 'userId bio phone whatsapp email profilePicture',
      populate: {
        path: 'userId',
        select: 'name email profilePicture profileImage'
      }
    });
    
    console.log('Fetched product with agent data:', JSON.stringify(product, null, 2));
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'product not found'
      });
    }
    
    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product'
    });
  }
};
