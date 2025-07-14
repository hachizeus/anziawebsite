import transporter from '../config/nodemailer.js';
import { getInquiryEmailTemplate } from '../email-templates/inquiryTemplate.js';
import { createNotification } from './adminNotificationController.js';

export const submitInquiry = async (req, res) => {
  try {
    const inquiryData = req.body;
    const { 
      name, 
      email, 
      phone, 
      message, 
      formType, 
      productId, 
      productTitle 
    } = inquiryData;

    // Use the same approach as in user registration
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'inquiries@Anzia Electronics .co.ke',
      subject: formType === 'rental' ? `New Rental Inquiry: ${productTitle}` : `New product Inquiry: ${productTitle}`,
      html: getInquiryEmailTemplate(inquiryData)
    };

    console.log('Sending inquiry email with options:', {
      from: process.env.EMAIL_USER,
      to: 'inquiries@Anzia Electronics .co.ke',
      subject: mailOptions.subject
    });

    await transporter.sendMail(mailOptions);
    console.log('Inquiry email sent successfully');
    
    // Create admin notification for product inquiry
    await createNotification({
      title: `New ${formType === 'rental' ? 'Rental' : 'product'} Inquiry`,
      message: `${name} (${email}) has submitted an inquiry about ${productTitle}`,
      type: 'inquiry',
      relatedId: productId || null,
      relatedModel: productId ? 'product' : null
    });
    
    res.status(200).json({ success: true, message: 'Inquiry submitted successfully' });
  } catch (error) {
    console.error('Error submitting inquiry:', error);
    res.status(200).json({ success: true, message: 'Inquiry submitted successfully' });
  }
};
