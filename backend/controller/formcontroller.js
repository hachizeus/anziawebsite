import Form from '../models/formmodel.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { createNotification } from './adminNotificationController.js';

// Reload environment variables to ensure they're available
dotenv.config();

export const submitForm = async (req, res) => {
  try {
    console.log('=== FORM SUBMISSION START ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Request headers:', req.headers);
    
    const { name, email, phone, message, formType, productTitle } = req.body;
    
    // Validate required fields
    if (!name || !email || !message) {
      console.log('Validation failed - missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }

    console.log('Creating form document...');
    const newForm = new Form({
      name,
      email,
      phone: phone || '',
      message,
      formType: formType || 'contact',
      productTitle: productTitle || ''
    });

    console.log('Saving to database...');
    const savedForm = await newForm.save();
    console.log('✅ Form saved successfully with ID:', savedForm._id);
    
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
    
    // Determine if this is an agent request
    const isAgentRequest = formType === 'agent-request';
    
    // Set email subject and content based on form type
    const emailSubject = isAgentRequest 
      ? 'New Agent Application - Real Estate Website'
      : `New Inquiry: ${productTitle || 'product'}`;
    
    // Generate email HTML
    const emailHtml = isAgentRequest
      ? getAgentRequestTemplate(name, email, phone, message)
      : getInquiryTemplate(name, email, phone, message, productTitle);
    
    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'support@Anzia Electronics .co.ke',
      subject: emailSubject,
      html: emailHtml
    };
    
    console.log('Sending email with subject:', emailSubject);
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    
    // Create notification - same pattern as product controller
    console.log('Creating notification...');
    
    await createNotification({
      title: isAgentRequest ? 'New Agent Request' : 'New Contact Message',
      message: isAgentRequest 
        ? `${name} (${email}) has requested to become an agent.`
        : `${name} (${email}) sent a message${productTitle ? ` about ${productTitle}` : ''}.`,
      type: isAgentRequest ? 'agent_request' : 'contact_message',
      relatedId: savedForm._id,
      relatedModel: 'Form'
    });
    
    console.log('✅ Notification created successfully');
    console.log('Form submission completed successfully');
    
    res.json({ 
      success: true,
      message: 'Form submitted successfully',
      formId: savedForm._id
    });
  } catch (error) {
    console.error('❌ ERROR in form submission:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  } finally {
    console.log('=== FORM SUBMISSION END ===');
  }
};

// Agent request email template
const getAgentRequestTemplate = (name, email, phone, message) => `
  <div style="max-width: 600px; margin: 20px auto; font-family: 'Arial', sans-serif; line-height: 1.6;">
    <!-- Header with Background -->
    <div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">New Agent Application</h1>
      <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Real Estate Website</p>
    </div>

    <!-- Main Content -->
    <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
      <!-- Application Details -->
      <div style="background: #f0f7ff; border-left: 4px solid #2563eb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 20px;">Applicant Details</h2>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Name:</strong> ${name}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Email:</strong> ${email}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Phone:</strong> ${phone || 'Not provided'}
        </p>
        ${message ? `
        <p style="margin: 8px 0; color: #374151;">
          <strong>Additional Information:</strong> ${message}
        </p>
        ` : ''}
        <p style="margin: 8px 0; color: #374151;">
          <strong>Status:</strong> <span style="display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 14px; background: #fef3c7; color: #854d0e;">Pending Review</span>
        </p>
      </div>

      <!-- Next Steps -->
      <div style="margin-top: 30px;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Next Steps</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #fef3c7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #854d0e;">1</span>
            Review applicant information
          </li>
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #fef3c7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #854d0e;">2</span>
            Contact applicant for interview
          </li>
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #fef3c7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #854d0e;">3</span>
            Approve or reject application
          </li>
        </ul>
      </div>

      <!-- Admin Actions -->
      <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Admin Actions</h3>
        <p style="margin: 0; color: #4b5563;">
          To approve this agent, log in to the admin dashboard and create an agent profile for this user.
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px;">
      <p style="color: #6b7280; font-size: 14px;">
        © ${new Date().getFullYear()} Real Estate Website. All rights reserved.
      </p>
    </div>
  </div>
`;

// product inquiry email template
const getInquiryTemplate = (name, email, phone, message, productTitle) => `
  <div style="max-width: 600px; margin: 20px auto; font-family: 'Arial', sans-serif; line-height: 1.6;">
    <!-- Header with Background -->
    <div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">New product Inquiry</h1>
      <p style="color: #ffffff; opacity: 0.9; margin: 10px 0 0 0; font-size: 16px;">Real Estate Website</p>
    </div>

    <!-- Main Content -->
    <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
      <!-- Inquiry Details -->
      <div style="background: #f0f7ff; border-left: 4px solid #2563eb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 20px;">Inquiry Details</h2>
        ${productTitle ? `
        <p style="margin: 8px 0; color: #374151;">
          <strong>product:</strong> ${productTitle}
        </p>
        ` : ''}
        <p style="margin: 8px 0; color: #374151;">
          <strong>Name:</strong> ${name}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Email:</strong> ${email}
        </p>
        <p style="margin: 8px 0; color: #374151;">
          <strong>Phone:</strong> ${phone || 'Not provided'}
        </p>
        ${message ? `
        <p style="margin: 8px 0; color: #374151;">
          <strong>Message:</strong> ${message}
        </p>
        ` : ''}
        <p style="margin: 8px 0; color: #374151;">
          <strong>Status:</strong> <span style="display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 14px; background: #fef3c7; color: #854d0e;">New Inquiry</span>
        </p>
      </div>

      <!-- Next Steps -->
      <div style="margin-top: 30px;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Next Steps</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #fef3c7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #854d0e;">1</span>
            Review inquiry details
          </li>
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #fef3c7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #854d0e;">2</span>
            Contact the client
          </li>
          <li style="margin-bottom: 10px; display: flex; align-items: center;">
            <span style="display: inline-block; width: 24px; height: 24px; background: #fef3c7; border-radius: 50%; margin-right: 10px; text-align: center; line-height: 24px; color: #854d0e;">3</span>
            Schedule a viewing or provide more information
          </li>
        </ul>
      </div>

      <!-- Support Info -->
      <div style="margin-top: 30px; padding: 20px; background: #f8fafc; border-radius: 8px;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">Need Help?</h3>
        <p style="margin: 0; color: #4b5563;">
          Our support team is available 24/7 to assist you:
          <br>
          📧 <a href="mailto:support@Anzia Electronics .co.ke" style="color: #2563eb; text-decoration: none;">support@Anzia Electronics .co.ke</a>
          <br>
          📞 <a href="tel:+254726171515" style="color: #2563eb; text-decoration: none;">+254 726171515</a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 30px;">
      <p style="color: #6b7280; font-size: 14px;">
        © ${new Date().getFullYear()} Real Estate Website. All rights reserved.
      </p>
    </div>
  </div>
`;
