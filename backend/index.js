import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

// Get current file path (ES modules don't have __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: [
    'https://anziaelectronics.netlify.app',
    'https://anzia-electronics-frontend.onrender.com',
    'https://anzia-electronics-admin.onrender.com',
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/public', express.static(join(__dirname, 'public')));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is working' });
});

// Root route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Anzia Electronics API</title>
        <style>
          body { font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
          .container { background: #f9fafb; border-radius: 8px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
          h1 { color: #2563eb; }
          .status { color: #16a34a; font-weight: bold; }
          .info { margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
          .footer { margin-top: 30px; font-size: 0.9rem; color: #6b7280; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Anzia Electronics API</h1>
          <p>Status: <span class="status">Online</span></p>
          <p>Server Time: ${new Date().toLocaleString()}</p>
          
          <div class="info">
            <p>The Anzia Electronics API is running properly. This backend serves product listings, user authentication, 
            and e-commerce features for the Anzia Electronics platform.</p>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Anzia Electronics. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `);
});

// Status check endpoint
app.get('/status', (req, res) => {
  res.status(200).json({ status: 'OK', time: new Date().toISOString() });
});

// Simple product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  original_price: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  model: String,
  stock_quantity: {
    type: Number,
    required: true,
    min: 0
  },
  availability: {
    type: String,
    enum: ['in-stock', 'out-of-stock', 'pre-order'],
    default: 'in-stock'
  },
  features: [String],
  images: [{
    url: String,
    fileId: String,
    alt: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Simple user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create models
const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema);

// Products routes
app.get('/api/products', async (req, res) => {
  try {
    console.log('Fetching products from MongoDB...');
    const products = await Product.find().sort({ createdAt: -1 });
    console.log('Found products:', products.length);
    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Frontend products route
app.get('/api/frontend/products', async (req, res) => {
  try {
    console.log('Fetching frontend products from MongoDB...');
    const products = await Product.find().sort({ createdAt: -1 });
    console.log('Found frontend products:', products.length);
    res.json({
      success: true,
      message: "Products retrieved successfully",
      products
    });
  } catch (error) {
    console.error('Error fetching frontend products:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create product route (for testing)
app.post('/api/products', async (req, res) => {
  try {
    console.log('Creating product:', req.body);
    const product = await Product.create(req.body);
    console.log('Product created:', product._id);
    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin product add route
app.post('/api/legacy-products/add', async (req, res) => {
  try {
    // Check authentication
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin && decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }
    
    console.log('Admin adding product:', req.body);
    
    // Create product with the data from form
    const productData = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      category: req.body.category,
      brand: req.body.brand,
      model: req.body.model || '',
      stock_quantity: 1, // Default stock
      availability: req.body.availability || 'in-stock',
      features: req.body.features ? JSON.parse(req.body.features) : [],
      images: [] // Handle images later if needed
    };
    
    const product = await Product.create(productData);
    console.log('Admin product created:', product._id);
    
    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product
    });
  } catch (error) {
    console.error('Error adding product:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    }
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// User routes
app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log('Registration attempt:', { name, email });
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    // Create user - save password as plain text for now (in production, hash it)
    const user = await User.create({
      name,
      email,
      password
    });
    
    console.log('User created successfully:', user._id);
    
    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });
    
    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email });
    
    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    console.log('User found:', user.email);
    
    // Compare passwords (plain text for now)
    if (password !== user.password) {
      console.log('Password mismatch');
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    console.log('Login successful');
    
    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });
    
    // Remove password from response
    user.password = undefined;
    
    res.json({
      success: true,
      token,
      user
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin login route
app.post('/api/admin-auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Admin login attempt:', { email });
    
    // Check against environment variables first
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      console.log('Admin login successful (env credentials)');
      
      const token = jwt.sign({ 
        email: email,
        isAdmin: true,
        role: 'admin' 
      }, process.env.JWT_SECRET, {
        expiresIn: '7d'
      });
      
      return res.json({
        success: true,
        token,
        user: {
          email: email,
          role: 'admin',
          isAdmin: true
        }
      });
    }
    
    // Fallback to database lookup
    const user = await User.findOne({ email, role: 'admin' }).select('+password');
    
    if (!user) {
      console.log('Admin user not found:', email);
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }
    
    // Compare passwords
    if (password !== user.password) {
      console.log('Admin password mismatch');
      return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
    }
    
    console.log('Admin login successful (database)');
    
    const token = jwt.sign({ 
      id: user._id, 
      email: user.email,
      isAdmin: true,
      role: 'admin' 
    }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
    
    // Remove password from response
    user.password = undefined;
    
    res.json({
      success: true,
      token,
      user: {
        ...user.toObject(),
        isAdmin: true
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// ImageKit auth endpoint
app.get('/api/imagekit/auth', (req, res) => {
  try {
    // In a real app, you would generate proper ImageKit auth params
    const authParams = {
      token: 'sample-token',
      expire: Math.floor(Date.now() / 1000) + 3600,
      signature: 'sample-signature',
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY
    };
    
    res.json({ success: true, authParams });
  } catch (error) {
    console.error('ImageKit auth error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Connect to database and start server
const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

export default app;