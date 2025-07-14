import News from '../models/newsmodel.js';
import transporter from '../config/nodemailer.js';
import { getCustomNewsletterTemplate } from '../email.js';

// Get all newsletter subscribers
export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await News.find({ optIn: true }).sort({ createdAt: -1 });
    res.json({
      success: true,
      subscribers,
      count: subscribers.length
    });
  } catch (error) {
    console.error('Error fetching subscribers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching subscribers'
    });
  }
};

// Send custom newsletter to all subscribers
export const sendNewsletter = async (req, res) => {
  try {
    const { subject, content } = req.body;
    
    if (!subject || !content) {
      return res.status(400).json({
        success: false,
        message: 'Subject and content are required'
      });
    }
    
    const subscribers = await News.find({ optIn: true });
    
    if (subscribers.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No subscribers found'
      });
    }
    
    // Send emails in batches to avoid overwhelming the email service
    const batchSize = 10;
    let successCount = 0;
    let failureCount = 0;
    
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      
      const emailPromises = batch.map(async (subscriber) => {
        try {
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: subscriber.email,
            subject: subject,
            html: getCustomNewsletterTemplate(subject, content)
          };
          
          await transporter.sendMail(mailOptions);
          successCount++;
        } catch (error) {
          console.error(`Failed to send newsletter to ${subscriber.email}:`, error);
          failureCount++;
        }
      });
      
      await Promise.allSettled(emailPromises);
      
      // Add delay between batches
      if (i + batchSize < subscribers.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    res.json({
      success: true,
      message: `Newsletter sent successfully`,
      stats: {
        total: subscribers.length,
        successful: successCount,
        failed: failureCount
      }
    });
  } catch (error) {
    console.error('Error sending newsletter:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending newsletter'
    });
  }
};

// Remove subscriber
export const removeSubscriber = async (req, res) => {
  try {
    const { subscriberId } = req.params;
    
    const subscriber = await News.findByIdAndDelete(subscriberId);
    
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Subscriber removed successfully'
    });
  } catch (error) {
    console.error('Error removing subscriber:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing subscriber'
    });
  }
};
