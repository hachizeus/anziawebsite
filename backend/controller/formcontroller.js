import Form from '../models/formmodel.js';
import nodemailer from 'nodemailer';

// Email configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'victorgathecha@gmail.com',
    pass: process.env.EMAIL_PASS || 'your_app_password'
  }
});

// Email template
const createEmailTemplate = (formData) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc;">
      <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">New Contact Form Submission</h1>
        <p style="color: #e0e7ff; margin: 10px 0 0 0;">Anzia Electronics Website</p>
      </div>
      <div style="background: white; padding: 30px; margin: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="margin-bottom: 20px; padding: 15px; background: #eff6ff; border-left: 4px solid #3b82f6; border-radius: 4px;">
          <h3 style="color: #1e40af; margin: 0 0 10px 0;">Contact Details</h3>
          <p style="margin: 5px 0; color: #374151;"><strong>Name:</strong> ${formData.name}</p>
          <p style="margin: 5px 0; color: #374151;"><strong>Email:</strong> ${formData.email}</p>
          ${formData.phone ? `<p style="margin: 5px 0; color: #374151;"><strong>Phone:</strong> ${formData.phone}</p>` : ''}
        </div>
        <div style="margin-top: 20px; padding: 15px; background: #f8fafc; border-radius: 4px;">
          <h3 style="color: #1e40af; margin: 0 0 10px 0;">Message</h3>
          <p style="color: #374151; line-height: 1.6; margin: 0;">${formData.message}</p>
        </div>
      </div>
      <div style="text-align: center; padding: 20px; color: #6b7280; font-size: 14px;">
        <p>This email was sent from the Anzia Electronics contact form</p>
        <p>Date: ${new Date().toLocaleString()}</p>
      </div>
    </div>
  `;
};

// Submit form
const submitForm = async (req, res) => {
  try {
    const { name, email, phone, message, formType = 'contact' } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Save to database
    const formSubmission = new Form({
      name,
      email,
      phone,
      message,
      formType
    });

    await formSubmission.save();

    // Send email
    const emailTemplate = createEmailTemplate({ name, email, phone, message });
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'victorgathecha@gmail.com',
      to: 'victorgathecha@gmail.com',
      subject: `New Contact Form Submission from ${name} - Anzia Electronics`,
      html: emailTemplate
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Form submitted successfully! We will get back to you soon.'
    });

  } catch (error) {
    console.error('Form submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit form. Please try again.'
    });
  }
};

// Get all forms (admin)
const getAllForms = async (req, res) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      forms
    });
  } catch (error) {
    console.error('Error fetching forms:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch forms'
    });
  }
};

export {
  submitForm,
  getAllForms
};