import Property from '../models/propertymodel.js';
import News from '../models/newsmodel.js';
import transporter from '../config/nodemailer.js';
import { createNotification } from './adminNotificationController.js';
import { getproductNotificationTemplate } from '../email.js';

// Get all properties
export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      properties
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching properties'
    });
  }
};

// Get product by ID
export const getproductById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'product not found'
      });
    }
    
    // Track view
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // Increment view count
    Property.views += 1;
    
    // Add to view history
    Property.viewHistory.push({
      date: new Date(),
      ip: clientIp
    });
    
    // Limit history to last 1000 views to prevent document size issues
    if (Property.viewHistory.length > 1000) {
      Property.viewHistory = Property.viewHistory.slice(-1000);
    }
    
    // Save asynchronously without waiting
    Property.save().catch(err => console.error('Error saving view stats:', err));
    
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

// Create new product
export const createproduct = async (req, res) => {
  try {
    const product = new Property(req.body);
    await Property.save();
    
    // Create admin notification for new product
    await createNotification({
      title: 'New product Added',
      message: `A new product "${Property.title}" has been added.`,
      type: 'product_approval',
      relatedId: Property._id,
      relatedModel: 'product'
    });
    
    // Send newsletter to all subscribers
    await sendproductNotification(product);
    
    res.status(201).json({
      success: true,
      message: 'product created successfully',
      product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product'
    });
  }
};


// Update product
export const updateproduct = async (req, res) => {
  try {
    // Extract latitude and longitude from request body
    const { latitude, longitude, ...otherFields } = req.body;
    
    // Create update object with all fields
    const updateData = {
      ...otherFields,
      latitude: latitude || null,
      longitude: longitude || null
    };
    
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'product not found'
      });
    }
    
    res.json({
      success: true,
      message: 'product updated successfully',
      product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product'
    });
  }
};

// Delete product
export const deleteproduct = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'product not found'
      });
    }
    
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

// Mark product as paid
export const markproductAsPaid = async (req, res) => {
  try {
    const { productId } = req.body;
    
    const property = await Property.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'product not found'
      });
    }
    
    // Update product status
    Property.paymentStatus = 'paid';
    Property.availability = 'sold';
    await Property.save();
    
    // Send notification email if user email is provided
    if (req.body.userEmail) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: req.body.userEmail,
        cc: 'management@Anzia Electronics .co.ke', // Add management email in CC
        subject: "product Payment Confirmation - Anzia Electronics ",
        html: `
          <div style="max-width: 600px; margin: 20px auto; font-family: 'Arial', sans-serif; line-height: 1.6;">
            <div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Payment Confirmation</h1>
            </div>
            <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
              <p>Thank you for your payment for <strong>${Property.title}</strong>.</p>
              <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p><strong>product:</strong> ${Property.title}</p>
                <p><strong>Location:</strong> ${Property.location}</p>
                <p><strong>Amount:</strong> $${Property.price.toLocaleString()}</p>
                <p><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">PAID</span></p>
              </div>
              <p>Our team will contact you shortly with next steps.</p>
              <p>If you have any questions, please contact our support team.</p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
    }
    
    res.json({
      success: true,
      message: 'product marked as paid successfully',
      product
    });
  } catch (error) {
    console.error('Error marking product as paid:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking product as paid'
    });
  }
};

// Get available properties
export const getAvailableProperties = async (req, res) => {
  try {
    const properties = await Property.find({ availability: 'available' }).sort({ createdAt: -1 });
    res.json({
      success: true,
      properties
    });
  } catch (error) {
    console.error('Error fetching available properties:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching available properties'
    });
  }
};

// Toggle product availability
export const toggleproductAvailability = async (req, res) => {
  try {
    const { productId } = req.body;
    
    const property = await Property.findById(productId);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'product not found'
      });
    }
    
    // Toggle availability between 'available' and 'unavailable'
    Property.availability = Property.availability === 'available' ? 'unavailable' : 'available';
    await Property.save();
    
    res.json({
      success: true,
      message: `product marked as ${Property.availability} successfully`,
      product
    });
  } catch (error) {
    console.error('Error toggling product availability:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product availability'
    });
  }
};

// Send product notification to subscribers
const sendproductNotification = async (product) => {
  try {
    const subscribers = await News.find({ optIn: true });
    
    if (subscribers.length === 0) {
      console.log('No subscribers found for product notification');
      return;
    }
    
    const emailPromises = subscribers.map(subscriber => {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: subscriber.email,
        subject: `New product Alert: ${Property.title} - Makini Realtors`,
        html: getproductNotificationTemplate(product)
      };
      
      return transporter.sendMail(mailOptions).catch(error => {
        console.error(`Failed to send product notification to ${subscriber.email}:`, error);
      });
    });
    
    await Promise.allSettled(emailPromises);
    console.log(`product notification sent to ${subscribers.length} subscribers`);
  } catch (error) {
    console.error('Error sending product notifications:', error);
  }
};

// Add new product
export const addproduct = async (req, res) => {
    try {
        const { title, location, price, beds, baths, sqft, type, availability, description, phone, mapLocation } = req.body;

        const product = new Property({
            title,
            location,
            price,
            beds,
            baths,
            sqft,
            type,
            availability,
            description,
            phone,
            mapLocation: mapLocation || "",
            createdAt: new Date(),
            updatedAt: new Date()
        });
        await Property.save();
        
        // Send newsletter to all subscribers
        await sendproductNotification(product);
        
        res.status(201).json({
            success: true,
            message: 'product added successfully',
            product
        });
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding product'
        });
    }
};
