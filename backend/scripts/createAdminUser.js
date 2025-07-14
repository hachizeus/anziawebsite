/**
 * Create admin user script
 * This script creates an admin user if one doesn't exist
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: path.join(__dirname, '..', envFile) });

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Create admin user
const createAdminUser = async () => {
  try {
    // Import User model
    const { default: User } = await import('../models/Usermodel.js');
    
    // Check if admin user exists
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: adminEmail },
        { role: 'admin' }
      ]
    });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      
      // Update admin role if needed
      if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        await existingAdmin.save();
        console.log('Updated user to admin role');
      }
      
      return existingAdmin;
    }
    
    // Create admin user
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);
    
    const adminUser = new User({
      name: 'Admin User',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
      isAdmin: true
    });
    
    await adminUser.save();
    console.log('Admin user created successfully:', adminUser.email);
    return adminUser;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
};

// Main function
const main = async () => {
  let connection;
  try {
    connection = await connectDB();
    await createAdminUser();
    console.log('Admin user setup complete');
  } catch (error) {
    console.error('Error in admin user setup:', error);
  } finally {
    if (connection) {
      await mongoose.disconnect();
      console.log('MongoDB disconnected');
    }
    process.exit(0);
  }
};

// Run the script
main();
