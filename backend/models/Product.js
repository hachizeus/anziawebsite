const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price must be a positive number']
  },
  original_price: {
    type: Number,
    min: [0, 'Original price must be a positive number']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: ['Electronics', 'Audio', 'Accessories', 'Power Tools & Workshop Gear', 'Generators & Power Equipment', 'Electronics & Appliances']
  },
  brand: {
    type: String,
    required: [true, 'Please add a brand']
  },
  model: {
    type: String
  },
  stock_quantity: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    min: [0, 'Stock quantity must be a positive number']
  },
  availability: {
    type: String,
    enum: ['in-stock', 'out-of-stock', 'pre-order'],
    default: 'in-stock'
  },
  features: {
    type: [String]
  },
  specifications: [{
    label: String,
    value: String
  }],
  warranty: {
    type: String
  },
  images: [{
    url: String,
    fileId: String,
    alt: String
  }],
  rating: {
    type: Number,
    min: [0, 'Rating must be at least 0'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
ProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);