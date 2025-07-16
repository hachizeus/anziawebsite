import { getCollection } from '../config/mongodb.js';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

// Get users collection
const getUsersCollection = async () => {
  return await getCollection('users');
};

// Create a new user
export const createUser = async (userData) => {
  try {
    const usersCollection = await getUsersCollection();
    
    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: userData.email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);
    
    // Create user object
    const user = {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      role: 'customer', // Always set role to customer for new users
      created_at: new Date(),
      updated_at: new Date()
    };
    
    // Insert user
    const result = await usersCollection.insertOne(user);
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return { ...userWithoutPassword, _id: result.insertedId };
  } catch (error) {
    throw error;
  }
};

// Find user by ID
export const findUserById = async (id) => {
  try {
    const usersCollection = await getUsersCollection();
    
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      throw new Error('Invalid user ID format');
    }
    
    const user = await usersCollection.findOne({ _id: objectId });
    
    if (!user) {
      return null;
    }
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    throw error;
  }
};

// Find user by email
export const findUserByEmail = async (email) => {
  try {
    const usersCollection = await getUsersCollection();
    return await usersCollection.findOne({ email });
  } catch (error) {
    throw error;
  }
};

// Update user
export const updateUser = async (id, updateData) => {
  try {
    const usersCollection = await getUsersCollection();
    
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      throw new Error('Invalid user ID format');
    }
    
    // If updating password, hash it
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }
    
    // Add updated_at timestamp
    updateData.updated_at = new Date();
    
    const result = await usersCollection.updateOne(
      { _id: objectId },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      throw new Error('User not found');
    }
    
    // Return updated user
    const updatedUser = await usersCollection.findOne({ _id: objectId });
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  } catch (error) {
    throw error;
  }
};

// Delete user
export const deleteUser = async (id) => {
  try {
    const usersCollection = await getUsersCollection();
    
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      throw new Error('Invalid user ID format');
    }
    
    const result = await usersCollection.deleteOne({ _id: objectId });
    
    if (result.deletedCount === 0) {
      throw new Error('User not found');
    }
    
    return { success: true };
  } catch (error) {
    throw error;
  }
};

// Authenticate user
export const authenticateUser = async (email, password) => {
  try {
    const usersCollection = await getUsersCollection();
    const user = await usersCollection.findOne({ email });
    
    if (!user) {
      return null;
    }
    
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return null;
    }
    
    // Return user without password
    const { password: userPassword, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    throw error;
  }
};

export default {
  createUser,
  findUserById,
  findUserByEmail,
  updateUser,
  deleteUser,
  authenticateUser
};