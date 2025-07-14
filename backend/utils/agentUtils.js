import Agent from '../models/agentModel.js';
import nodemailer from 'nodemailer';

/**
 * Creates an agent profile for a user
 * @param {Object} user - The user object
 * @returns {Promise<Object>} - The created agent object
 */
export const createAgentProfile = async (user) => {
  try {
    console.log('Creating agent profile for user:', user._id);
    
    // Check if agent profile already exists
    const existingAgent = await Agent.findOne({ userId: user._id });
    
    if (existingAgent) {
      console.log('Agent profile already exists for user:', user._id);
      return existingAgent;
    }
    
    // Create agent profile
    const newAgent = new Agent({
      userId: user._id,
      subscription: 'basic',
      email: user.email,
      active: true,
      visible: true,
      subscriptionExpiry: new Date(new Date().setMonth(new Date().getMonth() + 1)) // Default 1 month
    });
    
    const savedAgent = await newAgent.save();
    console.log('Agent profile created successfully:', savedAgent._id);
    
    // Send notification email
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.zoho.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      
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
              <p>Your subscription plan: <strong>${newAgent.subscription}</strong></p>
              <p>Subscription expiry: <strong>${new Date(newAgent.subscriptionExpiry).toLocaleDateString()}</strong></p>
              <p>If you have any questions, please contact our support team.</p>
              <p>Thank you,<br>Real Estate Team</p>
            </div>
          </div>
        `
      };
      
      await transporter.sendMail(mailOptions);
      console.log(`Agent approval email sent to ${user.email}`);
    } catch (emailError) {
      console.error('Error sending agent approval email:', emailError);
    }
    
    return savedAgent;
  } catch (error) {
    console.error('Error creating agent profile:', error);
    throw error;
  }
};
