import nodemailer from 'nodemailer';

// Create a direct transporter for Zoho
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // Use password as is for Zoho
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Log configuration on startup
console.log(`Email configuration: Using ${process.env.EMAIL_USER || 'undefined'} for sending emails`);

// Test the connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP connection error:', error);
  } else {
    console.log('SMTP server is ready to send emails');
  }
});

export default transporter;
