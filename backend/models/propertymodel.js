import mongoose from "mongoose";

// Generate a unique product code
function generateProductCode() {
  const prefix = 'AE'; // Anzia Electronics
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // 3-digit random number
  return `${prefix}-${timestamp}-${random}`;
}

// Check if model already exists to prevent overwrite error
const Product = mongoose.models.Product || mongoose.model("Product", new mongoose.Schema({
  productCode: {
    type: String,
    default: generateProductCode,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
    default: null
  },
  image: { 
    type: [String],
    required: true
  },
  video: {
    type: String,
    default: null
  },
  category: {
    type: String,
    enum: ['Power Tools & Workshop Gear', 'Generators & Power Equipment', 'Welding Machines & Accessories', 'Electronics & Appliances', 'Home & Office Gadgets'],
    required: true
  },
  subcategory: {
    type: String,
    default: ''
  },
  availability: {
    type: String,
    enum: ['in-stock', 'out-of-stock', 'pre-order', 'discontinued'],
    default: 'in-stock',
  },
  stockQuantity: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    required: true,
  },
  specifications: {
    type: Array,
    default: []
  },
  features: {
    type: Array,
    default: []
  },
  warranty: {
    type: String,
    default: '1 year'
  },
  weight: {
    type: String,
    default: ''
  },
  dimensions: {
    type: String,
    default: ''
  },
  powerRating: {
    type: String,
    default: ''
  },
  voltage: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    required: true,
    default: '+254 700 000 000'
  },
  visible: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  viewHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    ip: String
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
}));

export default Product;
