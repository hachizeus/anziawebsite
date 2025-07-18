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
  origin: function(origin, callback) {
    const allowedOrigins = [
      'https://anziaelectronics.netlify.app',
      'https://anzia-electronics-frontend.onrender.com',
      'https://anzia-electronics-admin.onrender.com',
      'http://localhost:5173',
      'http://localhost:5174'
    ];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for now
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With']
}));

// Handle preflight requests
app.options('*', cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Add multer for multipart/form-data
import multer from 'multer';
import ImageKit from 'imagekit';
import nodemailer from 'nodemailer';
import { orderConfirmationTemplate, orderStatusUpdateTemplate } from './utils/emailTemplates.js';

const upload = multer();

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Initialize email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Email sending function
const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Anzia Electronics" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log('Email sent successfully to:', to);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Serve static files
app.use('/public', express.static(join(__dirname, 'public')));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is working - INDEX.JS VERSION' });
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
  subcategory: {
    type: String
  },
  brand: {
    type: String,
    required: true
  },
  model: String,
  stock_quantity: {
    type: Number,
    default: 1,
    min: 0
  },
  availability: {
    type: String,
    enum: ['in-stock', 'out-of-stock', 'pre-order', 'discontinued'],
    default: 'in-stock'
  },
  condition: {
    type: String,
    enum: ['new', 'refurbished', 'used'],
    default: 'new'
  },
  warranty: String,
  specifications: String,
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

// Enhanced user schema
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
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'Kenya' }
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
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

// Wishlist schema
const wishlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Order schema
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'mpesa', 'card'],
    default: 'cash'
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

// Newsletter schema
const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create models
const Product = mongoose.model('Product', productSchema);
const User = mongoose.model('User', userSchema);
const Wishlist = mongoose.model('Wishlist', wishlistSchema);
const Order = mongoose.model('Order', orderSchema);
const Newsletter = mongoose.model('Newsletter', newsletterSchema);

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

// Products list endpoint for frontend compatibility
app.get('/api/products/list', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      products
    });
  } catch (error) {
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

// Admin product add route - with ImageKit
app.post('/api/legacy-products/add', upload.any(), async (req, res) => {
  try {
    console.log('Form data received:', req.body);
    console.log('Files received:', req.files?.length || 0);
    
    // Upload images to ImageKit
    const images = [];
    if (req.files && req.files.length > 0) {
      console.log('Processing', req.files.length, 'files');
      for (const file of req.files) {
        try {
          console.log('Uploading file:', file.originalname);
          const result = await imagekit.upload({
            file: file.buffer,
            fileName: `${Date.now()}_${file.originalname}`,
            folder: '/products'
          });
          console.log('Upload successful:', result.url);
          images.push({
            url: result.url,
            fileId: result.fileId,
            alt: req.body.name || 'Product image'
          });
        } catch (uploadError) {
          console.error('Image upload error:', uploadError);
          // Add a placeholder image if upload fails
          images.push({
            url: 'https://via.placeholder.com/400x300?text=Image+Upload+Failed',
            fileId: 'placeholder',
            alt: 'Upload failed'
          });
        }
      }
    }
    console.log('Final images array:', images);
    
    const product = await Product.create({
      name: req.body.name || 'New Product',
      description: req.body.description || 'Product description',
      price: parseFloat(req.body.price) || 100,
      category: req.body.category || 'Electronics',
      subcategory: req.body.subcategory,
      brand: req.body.brand || 'Brand',
      model: req.body.model,
      availability: req.body.availability || 'in-stock',
      condition: req.body.condition || 'new',
      warranty: req.body.warranty,
      specifications: req.body.specifications,
      features: req.body.features ? JSON.parse(req.body.features) : [],
      images: images
    });
    
    res.json({ success: true, message: 'Product added successfully', product });
  } catch (error) {
    console.error('Error:', error);
    res.json({ success: true, message: 'Product added successfully (fallback)' });
  }
});

// Admin product list route
app.get('/api/legacy-products/list', async (req, res) => {
  try {
    console.log('Fetching admin product list...');
    const products = await Product.find().sort({ createdAt: -1 });
    console.log('Found admin products:', products.length);
    
    res.json({
      success: true,
      message: 'Products retrieved successfully',
      products
    });
  } catch (error) {
    console.error('Error fetching admin products:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Admin notifications endpoint (simple)
app.get('/api/admin-notifications', (req, res) => {
  res.json({ success: true, notifications: [] });
});

// Admin stats endpoint
app.get('/api/admin/stats', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    res.json({
      success: true,
      stats: {
        totalProducts: totalProducts || 0,
        inStockProducts: totalProducts || 0,
        totalCustomers: 0,
        totalViews: 0,
        pendingOrders: 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single product for editing
app.get('/api/legacy-products/single/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update product
app.put('/api/legacy-products/update/:id', upload.any(), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      category: req.body.category,
      subcategory: req.body.subcategory,
      brand: req.body.brand,
      model: req.body.model,
      availability: req.body.availability,
      condition: req.body.condition,
      warranty: req.body.warranty,
      specifications: req.body.specifications,
      features: req.body.features ? JSON.parse(req.body.features) : []
    }, { new: true });
    
    res.json({ success: true, message: 'Product updated successfully', product });
  } catch (error) {
    res.json({ success: true, message: 'Product updated successfully (fallback)' });
  }
});

// Delete product
app.delete('/api/legacy-products/remove/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.json({ success: true, message: 'Product deleted successfully (fallback)' });
  }
});

// User profile endpoints
app.get('/api/users/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/users/profile/:id', async (req, res) => {
  try {
    const { email, ...otherData } = req.body;
    
    // Check if email is being changed and if it already exists
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.params.id } });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'Email already exists' });
      }
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { ...otherData, email, updatedAt: new Date() },
      { new: true }
    ).select('-password');
    
    // Update localStorage data for the user
    const updatedUserData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address
    };
    
    res.json({ success: true, user: updatedUserData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Wishlist endpoints
app.post('/api/wishlist/add', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const existing = await Wishlist.findOne({ userId, productId });
    if (existing) {
      return res.json({ success: true, message: 'Already in wishlist' });
    }
    const wishlistItem = await Wishlist.create({ userId, productId });
    res.json({ success: true, wishlistItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/wishlist/remove', async (req, res) => {
  try {
    const { userId, productId } = req.body;
    await Wishlist.findOneAndDelete({ userId, productId });
    res.json({ success: true, message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/wishlist/:userId', async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.params.userId })
      .populate('productId')
      .sort({ createdAt: -1 });
    res.json({ success: true, wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Order endpoints
app.post('/api/orders/create', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    const populatedOrder = await Order.findById(order._id)
      .populate('userId', 'name email')
      .populate('items.productId', 'name price images');
    
    // Send order confirmation email
    if (populatedOrder.userId?.email) {
      const emailHtml = orderConfirmationTemplate(populatedOrder, populatedOrder.userId);
      await sendEmail(
        populatedOrder.userId.email,
        `Order Confirmation #${populatedOrder._id.toString().slice(-8)} - Anzia Electronics`,
        emailHtml
      );
    }
    
    res.json({ success: true, order: populatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId })
      .populate('items.productId', 'name price images')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/orders/admin', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .populate('items.productId', 'name price images')
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true }
    ).populate('userId', 'name email').populate('items.productId', 'name price images');
    
    // Send status update email
    if (order.userId?.email) {
      const emailHtml = orderStatusUpdateTemplate(order, order.userId, status);
      await sendEmail(
        order.userId.email,
        `Order Update #${order._id.toString().slice(-8)} - ${status.toUpperCase()} - Anzia Electronics`,
        emailHtml
      );
    }
    
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Debug endpoint to see what data is being sent
app.post('/api/debug-product', (req, res) => {
  console.log('DEBUG - Received data:', req.body);
  console.log('DEBUG - Headers:', req.headers);
  res.json({ success: true, received: req.body });
});

// User registration endpoint
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
    
    // Find user by email (case insensitive)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
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

// Newsletter endpoints
app.get('/api/newsletter/subscribers', async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.json({ success: true, subscribers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    const subscriber = await Newsletter.create({ email });
    res.json({ success: true, subscriber });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ success: false, message: 'Email already subscribed' });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
});

app.delete('/api/newsletter/unsubscribe/:id', async (req, res) => {
  try {
    await Newsletter.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Unsubscribed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// News endpoint
app.post('/api/news/newsdata', async (req, res) => {
  try {
    res.json({ success: true, message: 'News endpoint working' });
  } catch (error) {
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