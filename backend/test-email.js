import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function sendTestEmail() {
  try {
    console.log('Starting test email...');
    console.log('Email user:', process.env.EMAIL_USER);
    
    // Create a test transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    
    console.log('Transporter created');
    
    // Send a test email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'inquiries@Anzia Electronics .co.ke',
      subject: 'Test Email from Makini Realtors',
      text: 'This is a test email to verify that the email system is working correctly.'
    });
    
    console.log('Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('Error sending test email:', error);
  }
}

// Run the test
sendTestEmail();
