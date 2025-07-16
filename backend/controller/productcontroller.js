import { getCollection } from '../config/mongodb.js';
import { ObjectId } from 'mongodb';
import { uploadToStorage } from '../middleware/fileStorage.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sortBy, featured } = req.query;
    
    // Build query filter
    const filter = {};

    // Category filter
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Price filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Featured filter
    if (featured === 'true') {
      filter.original_price = { $ne: null };
    }

    // Sort options
    const sortOptions = {};
    switch (sortBy) {
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

    // Get products collection
    const productsCollection = await getCollection('products');
    const products = await productsCollection.find(filter).sort(sortOptions).toArray();
    
    res.json({
      success: true,
      products: products || []
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products'
    });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const productsCollection = await getCollection('products');
    
    let productId;
    try {
      productId = new ObjectId(req.params.id);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }
    
    const product = await productsCollection.findOne({ _id: productId });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product'
    });
  }
};

// Add new product
export const addProduct = async (req, res) => {
  try {
    // Parse features properly
    let features = [];
    if (req.body.features) {
      if (typeof req.body.features === 'string') {
        if (req.body.features.startsWith('[')) {
          try {
            features = JSON.parse(req.body.features);
          } catch (e) {
            features = req.body.features.split(',').map(f => f.trim());
          }
        } else {
          features = req.body.features.split(',').map(f => f.trim());
        }
      } else {
        features = req.body.features;
      }
    }

    const productData = {
      ...req.body,
      price: parseFloat(req.body.price),
      original_price: req.body.originalPrice ? parseFloat(req.body.originalPrice) : null,
      stock_quantity: parseInt(req.body.stockQuantity) || 0,
      features: features,
      created_at: new Date(),
      updated_at: new Date()
    };

    // Handle image uploads
    const imageUrls = [];
    if (req.files) {
      for (let i = 1; i <= 4; i++) {
        const file = req.files[`image${i}`];
        if (file && file[0]) {
          try {
            const imageUrl = await uploadToStorage(file[0], '/product-images');
            imageUrls.push(imageUrl);
          } catch (uploadError) {
            console.error(`Error uploading image ${i}:`, uploadError);
          }
        }
      }
    }

    if (imageUrls.length > 0) {
      productData.images = imageUrls;
    }

    console.log('Product data being inserted:', productData);

    const productsCollection = await getCollection('products');
    const result = await productsCollection.insertOne(productData);
    
    if (!result.acknowledged) {
      throw new Error('Failed to insert product');
    }
    
    // Get the inserted product
    const product = await productsCollection.findOne({ _id: result.insertedId });
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    // Parse features properly
    let features = [];
    if (req.body.features) {
      if (typeof req.body.features === 'string') {
        if (req.body.features.startsWith('[')) {
          try {
            features = JSON.parse(req.body.features);
          } catch (e) {
            features = req.body.features.split(',').map(f => f.trim());
          }
        } else {
          features = req.body.features.split(',').map(f => f.trim());
        }
      } else {
        features = req.body.features;
      }
    }

    const productData = {
      ...req.body,
      price: parseFloat(req.body.price),
      original_price: req.body.originalPrice ? parseFloat(req.body.originalPrice) : null,
      stock_quantity: parseInt(req.body.stockQuantity) || 0,
      features: features,
      updated_at: new Date()
    };

    // Handle image uploads if there are any
    if (req.files && Object.keys(req.files).length > 0) {
      const imageUrls = [];
      for (let i = 1; i <= 4; i++) {
        const file = req.files[`image${i}`];
        if (file && file[0]) {
          try {
            const imageUrl = await uploadToStorage(file[0], '/product-images');
            imageUrls.push(imageUrl);
          } catch (uploadError) {
            console.error(`Error uploading image ${i}:`, uploadError);
          }
        }
      }

      if (imageUrls.length > 0) {
        productData.images = imageUrls;
      }
    }

    let productId;
    try {
      productId = new ObjectId(req.params.id);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    const productsCollection = await getCollection('products');
    const result = await productsCollection.updateOne(
      { _id: productId },
      { $set: productData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Get the updated product
    const product = await productsCollection.findOne({ _id: productId });
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product'
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    let productId;
    try {
      productId = new ObjectId(req.params.id);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    const productsCollection = await getCollection('products');
    const result = await productsCollection.deleteOne({ _id: productId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product'
    });
  }
};

// Toggle product availability
export const toggleProductAvailability = async (req, res) => {
  try {
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }
    
    let objectId;
    try {
      objectId = new ObjectId(productId);
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }
    
    const productsCollection = await getCollection('products');
    
    // First get the current product to check its availability
    const product = await productsCollection.findOne({ _id: objectId });
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Toggle the availability
    const newAvailability = product.availability === 'in-stock' ? 'out-of-stock' : 'in-stock';
    
    // Update the product
    const result = await productsCollection.updateOne(
      { _id: objectId },
      { $set: { availability: newAvailability, updated_at: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    // Get the updated product
    const updatedProduct = await productsCollection.findOne({ _id: objectId });
    
    res.json({
      success: true,
      message: `Product availability updated to ${newAvailability}`,
      product: updatedProduct
    });
  } catch (error) {
    console.error('Error toggling product availability:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product availability'
    });
  }
};

// Legacy exports for compatibility
export const createProduct = addProduct;
export const getAvailableProducts = getAllProducts;
export const getFeaturedProducts = getAllProducts;
export const getProductsByCategory = getAllProducts;