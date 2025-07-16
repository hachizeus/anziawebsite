import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { getCollection } from '../config/mongodb.js';
import { ObjectId } from 'mongodb';
import * as inMemoryStore from '../utils/inMemoryStore.js';

// Register user
export const registerUser = async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { name, email, password } = req.body;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user object
    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: 'customer',
      created_at: new Date(),
      updated_at: new Date()
    };
    
    let result;
    let createdUser;
    
    try {
      // Try to use MongoDB
      console.log('Connecting to MongoDB users collection...');
      const usersCollection = await getCollection('users');
      
      // Check if user exists
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }
      
      // Insert user
      console.log('Inserting user into MongoDB:', { ...newUser, password: '[HIDDEN]' });
      result = await usersCollection.insertOne(newUser);
      console.log('MongoDB insert result:', result);
      
      if (result.acknowledged) {
        console.log('User inserted successfully with ID:', result.insertedId);
        createdUser = await usersCollection.findOne({ _id: result.insertedId });
        console.log('User found after insert:', createdUser ? 'Yes' : 'No');
      } else {
        console.error('MongoDB insert not acknowledged');
      }
    } catch (dbError) {
      console.error('MongoDB error:', dbError.message);
      
      // Use in-memory store
      const existingUser = await inMemoryStore.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }
      
      createdUser = await inMemoryStore.createUser(newUser);
      result = { insertedId: createdUser._id };
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: result.insertedId.toString(), email, role: 'customer' },
      process.env.JWT_SECRET || 'fallback_secret_key_for_development',
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: result.insertedId.toString(),
        email,
        name,
        role: 'customer'
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    console.log('Login request received:', { email: req.body.email });
    const { email, password } = req.body;

    // Find user
    console.log('Connecting to MongoDB users collection for login...');
    let user = null;
    
    try {
      const usersCollection = await getCollection('users');
      console.log('Searching for user with email:', email);
      user = await usersCollection.findOne({ email });
      console.log('User found in MongoDB:', user ? 'Yes' : 'No');
    } catch (dbError) {
      console.error('MongoDB error, falling back to in-memory store:', dbError.message);
      // Try in-memory store as fallback
      user = await inMemoryStore.findUserByEmail(email);
      console.log('User found in in-memory store:', user ? 'Yes' : 'No');
    }
    
    if (!user) {
      console.log('No user found with email:', email);
      // Create a temporary user if they don't exist in the database but credentials match hardcoded values
      // This is for debugging only and should be removed in production
      if (email === 'test@example.com' && password === 'password123') {
        console.log('Using test credentials - creating temporary user');
        const tempUser = {
          _id: new ObjectId(),
          name: 'Test User',
          email: 'test@example.com',
          role: 'customer',
          created_at: new Date()
        };
        
        // Try to insert this user into the database
        try {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          const userToInsert = { ...tempUser, password: hashedPassword };
          console.log('Inserting test user into database');
          await usersCollection.insertOne(userToInsert);
          console.log('Test user inserted successfully');
          return loginUser(req, res); // Retry login with the newly created user
        } catch (insertError) {
          console.error('Failed to insert test user:', insertError);
        }
      }
      
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    console.log('Comparing password...');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch ? 'Yes' : 'No');

    if (!isMatch) {
      console.log('Password does not match for user:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role || 'customer' },
      process.env.JWT_SECRET || 'fallback_secret_key_for_development',
      { expiresIn: '30d' }
    );

    // Update last login if using MongoDB
    try {
      const usersCollection = await getCollection('users');
      await usersCollection.updateOne(
        { _id: user._id },
        { $set: { last_login: new Date() } }
      );
    } catch (error) {
      console.log('Could not update last login time:', error.message);
    }

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role || 'customer'
      },
      token,
      session: {
        access_token: token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    const usersCollection = await getCollection('users');
    
    let userId;
    try {
      userId = new ObjectId(req.user.id);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    const user = await usersCollection.findOne(
      { _id: userId },
      { projection: { password: 0 } } // Exclude password
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    const usersCollection = await getCollection('users');
    
    let userId;
    try {
      userId = new ObjectId(req.user.id);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // Don't allow updating email or password through this endpoint
    const { email, password, role, ...updateData } = req.body;
    
    updateData.updated_at = new Date();

    const result = await usersCollection.updateOne(
      { _id: userId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get updated user
    const updatedUser = await usersCollection.findOne(
      { _id: userId },
      { projection: { password: 0 } } // Exclude password
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile'
    });
  }
};

// Logout user
export const logoutUser = async (req, res) => {
  try {
    // JWT is stateless, so we just return success
    // The frontend should remove the token from storage
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
};
