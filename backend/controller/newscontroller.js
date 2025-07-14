import News from '../models/newsmodel.js';
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import transporter from '../config/nodemailer.js';
import { getEmailTemplate, getNewsletterTemplate } from "../email.js";

const submitNewsletter = async (req, res) => {
  try {
    const { email, optIn } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    // Only proceed if user has opted in
    if (!optIn) {
      return res.status(400).json({ message: "User must opt-in to receive newsletters" });
    }

    // Check if email already exists
    const existingSubscription = await News.findOne({ email });
    if (existingSubscription) {
      return res.status(400).json({ message: "Email already subscribed to newsletter" });
    }

    const newNewsletter = new News({
      email,
      optIn: true,
    });

    const savedNewsletter = await newNewsletter.save();

    // Only send email if saving was successful
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER || process.env.EMAIL,
        to: email,
        subject: "Welcome to Anzia Electronics  Newsletter! 🏠",
        html: getNewsletterTemplate(email),
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error("Error sending welcome email:", emailError);
      // Don't fail the request if email sending fails
    }

    res.status(201).json({ message: "Newsletter submitted successfully" });
  } catch (error) {
    console.error("Error saving newsletter data:", error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already subscribed to newsletter" });
    }
    
    res.status(500).json({ message: "Server error" });
  }
};

export { submitNewsletter };
