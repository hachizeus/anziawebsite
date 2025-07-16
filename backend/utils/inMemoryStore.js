import bcrypt from 'bcryptjs';
import { ObjectId } from 'mongodb';

// In-memory store for users when MongoDB is not available
const users = new Map();

// Add default users
const initializeStore = async () => {
  if (users.size === 0) {
    // Create admin user
    const adminSalt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', adminSalt);
    const adminId = new ObjectId();
    users.set('admin@example.com', {
      _id: adminId,
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    });

    // Create customer user
    const customerSalt = await bcrypt.genSalt(10);
    const customerPassword = await bcrypt.hash('customer123', customerSalt);
    const customerId = new ObjectId();
    users.set('customer@example.com', {
      _id: customerId,
      name: 'Customer User',
      email: 'customer@example.com',
      password: customerPassword,
      role: 'customer',
      created_at: new Date(),
      updated_at: new Date()
    });
    
    console.log('In-memory user store initialized with default users');
  }
};

// Initialize the store
initializeStore();

// User operations
export const findUserByEmail = async (email) => {
  return users.get(email) || null;
};

export const createUser = async (userData) => {
  const id = new ObjectId();
  const user = {
    _id: id,
    ...userData,
    created_at: new Date(),
    updated_at: new Date()
  };
  users.set(userData.email, user);
  return { ...user, _id: id };
};

export const findUserById = async (id) => {
  for (const user of users.values()) {
    if (user._id.toString() === id.toString()) {
      return user;
    }
  }
  return null;
};

export const getAllUsers = async () => {
  return Array.from(users.values());
};

export default {
  findUserByEmail,
  createUser,
  findUserById,
  getAllUsers,
  initializeStore
};