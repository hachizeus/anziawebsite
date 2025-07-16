import { getCollection } from '../config/mongodb.js';
import { ObjectId } from 'mongodb';

// Get products collection
const getProductsCollection = async () => {
  return await getCollection('products');
};

// Create a new product
export const createProduct = async (productData) => {
  try {
    const productsCollection = await getProductsCollection();
    
    // Add timestamps
    const product = {
      ...productData,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    // Insert product
    const result = await productsCollection.insertOne(product);
    
    // Return product with ID
    return { ...product, _id: result.insertedId };
  } catch (error) {
    throw error;
  }
};

// Find product by ID
export const findProductById = async (id) => {
  try {
    const productsCollection = await getProductsCollection();
    
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      throw new Error('Invalid product ID format');
    }
    
    return await productsCollection.findOne({ _id: objectId });
  } catch (error) {
    throw error;
  }
};

// Get all products with optional filters
export const findProducts = async (filters = {}) => {
  try {
    const productsCollection = await getProductsCollection();
    
    // Build query filter
    const query = {};
    
    // Category filter
    if (filters.category && filters.category !== 'all') {
      query.category = filters.category;
    }
    
    // Search filter
    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { brand: { $regex: filters.search, $options: 'i' } },
        { category: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } }
      ];
    }
    
    // Price filter
    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = parseFloat(filters.minPrice);
      if (filters.maxPrice) query.price.$lte = parseFloat(filters.maxPrice);
    }
    
    // Featured filter
    if (filters.featured === true) {
      query.original_price = { $ne: null };
    }
    
    // Availability filter
    if (filters.availability) {
      query.availability = filters.availability;
    }
    
    // Sort options
    const sortOptions = {};
    switch (filters.sortBy) {
      case 'price-low':
        sortOptions.price = 1;
        break;
      case 'price-high':
        sortOptions.price = -1;
        break;
      case 'name':
        sortOptions.name = 1;
        break;
      case 'rating':
        sortOptions.rating = -1;
        break;
      default:
        sortOptions.created_at = -1;
    }
    
    // Pagination
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Execute query
    const products = await productsCollection
      .find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .toArray();
    
    // Get total count for pagination
    const total = await productsCollection.countDocuments(query);
    
    return {
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw error;
  }
};

// Update product
export const updateProduct = async (id, updateData) => {
  try {
    const productsCollection = await getProductsCollection();
    
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      throw new Error('Invalid product ID format');
    }
    
    // Add updated_at timestamp
    updateData.updated_at = new Date();
    
    const result = await productsCollection.updateOne(
      { _id: objectId },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      throw new Error('Product not found');
    }
    
    // Return updated product
    return await productsCollection.findOne({ _id: objectId });
  } catch (error) {
    throw error;
  }
};

// Delete product
export const deleteProduct = async (id) => {
  try {
    const productsCollection = await getProductsCollection();
    
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (error) {
      throw new Error('Invalid product ID format');
    }
    
    const result = await productsCollection.deleteOne({ _id: objectId });
    
    if (result.deletedCount === 0) {
      throw new Error('Product not found');
    }
    
    return { success: true };
  } catch (error) {
    throw error;
  }
};

// Get product categories
export const getCategories = async () => {
  try {
    const productsCollection = await getProductsCollection();
    return await productsCollection.distinct('category');
  } catch (error) {
    throw error;
  }
};

export default {
  createProduct,
  findProductById,
  findProducts,
  updateProduct,
  deleteProduct,
  getCategories
};