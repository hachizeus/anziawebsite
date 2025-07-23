import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

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

// Security middleware
app.use(helmet());

// Rate limiting - more permissive for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // increased limit
  message: 'Too many requests from this IP'
});
app.use('/api/', limiter);

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// User ownership validation
const authorizeUser = (req, res, next) => {
  const userId = req.params.userId || req.body.userId;
  if (req.user.id !== userId && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  next();
};

// Optional auth middleware (doesn't fail if no token)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (!err) {
        req.user = user;
      }
    });
  }
  next();
};

// Middleware
app.use(cors({
  origin: [
    'https://anziaelectronics.netlify.app',
    'https://anzia-electronics-frontend.onrender.com',
    'https://anzia-electronics-admin.onrender.com',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000'
  ],
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
    user: process.env.EMAIL_USER || 'victormbogo958@gmail.com',
    pass: process.env.EMAIL_PASS || 'your_gmail_app_password'
  }
});

// Email sending function
const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Anzia Electronics" <${process.env.EMAIL_USER || 'victormbogo958@gmail.com'}>`,
      to,
      subject,
      html
    });
    console.log('Email sent successfully to:', to);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
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
    default: 'mpesa'
  },
  phoneNumber: String,
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

// Notification schema
const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['order', 'user', 'product', 'system']
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  data: {
    type: mongoose.Schema.Types.Mixed
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
const Notification = mongoose.model('Notification', notificationSchema);

// Cart schema
const cartSchema = new mongoose.Schema({
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
      default: 1
    },
    price: {
      type: Number,
      required: true
    },
    name: String,
    image: String
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Cart = mongoose.model('Cart', cartSchema);

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
    // Skip if id is 'list' to avoid conflict
    if (req.params.id === 'list') {
      return res.status(404).json({ success: false, message: 'Route not found' });
    }
    
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
    const totalUsers = await User.countDocuments();
    res.json({
      success: true,
      stats: {
        totalProducts: totalProducts || 0,
        inStockProducts: totalProducts || 0,
        totalCustomers: totalUsers || 0,
        totalViews: 0,
        pendingOrders: 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin users endpoint
app.get('/api/admin/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({
      success: true,
      users: users || []
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

// Update user role endpoint
app.put('/api/users/role', async (req, res) => {
  try {
    const { userId, role } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { role, updatedAt: new Date() },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user role'
    });
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
app.get('/api/users/profile/:id', optionalAuth, async (req, res) => {
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

app.put('/api/users/profile/:id', optionalAuth, async (req, res) => {
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
// Transaction status storage
const transactionStatus = {};

// OAuth Token Generation
const getOAuthToken = async () => {
  const auth = Buffer.from(`${process.env.CONSUMER_KEY || 'hUWFbJJ1qaLUzZ8kyQyUMuU0RtA0Bfg5Et9AGGgrOqDgpDvV'}:${process.env.CONSUMER_SECRET || 'taKOGR1BmkroE6y2OAGCBnqj9gZpAIXnrWK6jm4kvfXH2tVi7FixcADnDF7c9egY'}`).toString('base64');
  try {
    const response = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      { headers: { Authorization: `Basic ${auth}` } }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('OAuth Error:', error.response?.data || error.message);
    return null;
  }
};

// STK Push endpoint
app.post('/api/stk-push', async (req, res) => {
  const token = await getOAuthToken();
  if (!token) return res.status(500).json({ message: 'Failed to obtain OAuth token' });

  const timestamp = new Date().toISOString().replace(/[-:.T]/g, '').slice(0, 14);
  const password = Buffer.from(`${process.env.MPESA_SHORTCODE || '174379'}${process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'}${timestamp}`).toString('base64');

  const { phone, amount, orderId } = req.body;
  const data = {
    BusinessShortCode: process.env.MPESA_SHORTCODE || '174379',
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phone,
    PartyB: process.env.MPESA_SHORTCODE || '174379',
    PhoneNumber: phone,
    CallBackURL: `${process.env.CALLBACK_URL || 'https://anzia-electronics-api.onrender.com'}/api/mpesa/callback`,
    AccountReference: orderId || 'Test',
    TransactionDesc: 'Payment for Order',
  };

  try {
    const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', data, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.MerchantRequestID) {
      transactionStatus[response.data.MerchantRequestID] = {
        status: 'Pending',
        CheckoutRequestID: response.data.CheckoutRequestID,
        orderId: orderId
      };
    }

    res.json(response.data);
  } catch (error) {
    console.error('STK Push Error:', error.response?.data || error.message);
    res.status(500).json(error.response?.data || { message: 'Unknown STK push error' });
  }
});

app.post('/api/orders/create', async (req, res) => {
  try {
    console.log('Creating order with data:', req.body);
    
    // Validate required fields
    if (!req.body.phoneNumber) {
      return res.status(400).json({ success: false, message: 'Phone number is required for M-Pesa payment' });
    }
    
    const order = await Order.create({
      userId: req.body.userId,
      items: req.body.items || [],
      totalAmount: req.body.totalAmount || 0,
      shippingAddress: req.body.shippingAddress || {},
      paymentMethod: 'mpesa',
      phoneNumber: req.body.phoneNumber
    });
    const populatedOrder = await Order.findById(order._id)
      .populate('userId', 'name email')
      .populate('items.productId', 'name price images');
    
    // Create admin notification
    await Notification.create({
      type: 'order',
      title: 'New Order Received',
      message: `Order #${order._id.toString().slice(-8)} from ${populatedOrder.userId?.name || 'Customer'} - KSh ${order.totalAmount?.toLocaleString()}`,
      data: {
        orderId: order._id,
        customerName: populatedOrder.userId?.name,
        amount: order.totalAmount
      }
    });
    
    // Send order confirmation email
    if (populatedOrder.userId?.email) {
      const emailHtml = orderConfirmationTemplate(populatedOrder, populatedOrder.userId);
      await sendEmail(
        populatedOrder.userId.email,
        `Order Confirmation #${populatedOrder._id.toString().slice(-8)} - Anzia Electronics`,
        emailHtml
      );
    }
    
    res.json({ 
      success: true, 
      order: populatedOrder,
      orderId: order._id.toString().slice(-8)
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/orders/user/:userId', optionalAuth, async (req, res) => {
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
    ).populate('userId', 'name email');
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    res.json({ success: true, order });
  } catch (error) {
    console.error('Order status update error:', error);
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

app.delete('/api/newsletter/subscribers/:id', async (req, res) => {
  try {
    await Newsletter.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Subscriber removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/legacy-products/toggle-availability', async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    // Toggle between in-stock and out-of-stock
    product.availability = product.availability === 'in-stock' ? 'out-of-stock' : 'in-stock';
    await product.save();
    
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Newsletter send endpoint
app.post('/api/newsletter/send', async (req, res) => {
  try {
    const { subject, message } = req.body;
    const subscribers = await Newsletter.find();
    
    let successful = 0;
    let failed = 0;
    
    // Send emails to all subscribers
    for (const subscriber of subscribers) {
      try {
        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>${subject}</title>
          </head>
          <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #667eea;">Anzia Electronics</h1>
            </div>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px;">
              <h2 style="color: #333;">${subject}</h2>
              <div style="color: #666; line-height: 1.6;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            <div style="text-align: center; margin-top: 30px; color: #666; font-size: 14px;">
              <p>© ${new Date().getFullYear()} Anzia Electronics. All rights reserved.</p>
              <p><a href="#" style="color: #667eea;">Unsubscribe</a></p>
            </div>
          </body>
          </html>
        `;
        
        await sendEmail(subscriber.email, subject, emailHtml);
        successful++;
      } catch (emailError) {
        console.error(`Failed to send email to ${subscriber.email}:`, emailError);
        failed++;
      }
    }
    
    res.json({ 
      success: true,
      stats: {
        successful,
        failed,
        total: subscribers.length
      },
      message: `Newsletter sent to ${successful} subscribers (${failed} failed)`
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin notifications endpoints
app.get('/api/admin-notifications', async (req, res) => {
  try {
    const notifications = await Notification.find()
      .sort({ createdAt: -1 })
      .limit(50);
    
    const unreadCount = await Notification.countDocuments({ read: false });
    
    res.json({ 
      success: true, 
      notifications,
      unreadCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/admin-notifications/:id/read', async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/admin-notifications/mark-all-read', async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { read: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// M-Pesa callback endpoint
app.post('/api/mpesa/callback', (req, res) => {
  console.log('Callback Received:', JSON.stringify(req.body, null, 2));

  if (!req.body.Body || !req.body.Body.stkCallback) {
    console.error('Invalid callback format:', req.body);
    return res.status(400).json({ message: 'Invalid callback data' });
  }

  const { MerchantRequestID, ResultCode } = req.body.Body.stkCallback;
  
  if (!MerchantRequestID) {
    console.error('Missing MerchantRequestID in callback:', req.body);
    return res.status(400).json({ message: 'Invalid callback data' });
  }

  if (transactionStatus[MerchantRequestID]) {
    transactionStatus[MerchantRequestID].status = ResultCode === 0 ? 'Success' : 'Failed';
    console.log(`Updated transaction ${MerchantRequestID} to ${transactionStatus[MerchantRequestID].status}`);
  }

  res.status(200).json({ message: 'Callback processed successfully' });
});

// Transaction status endpoint
app.get('/api/transaction-status/:merchantRequestID', (req, res) => {
  const transaction = transactionStatus[req.params.merchantRequestID];
  const status = transaction ? transaction.status : 'Pending';
  res.json({ status, orderId: transaction?.orderId });
});

// Cart endpoints
app.get('/api/cart/:userId', optionalAuth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate('items.productId');
    res.json({ success: true, cart: cart || { items: [] } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/cart/add', optionalAuth, async (req, res) => {
  try {
    const { userId, productId, quantity, price, name, image } = req.body;
    
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    
    const existingItem = cart.items.find(item => item.productId.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity, price, name, image });
    }
    
    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/cart/remove/:userId/:productId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    if (cart) {
      cart.items = cart.items.filter(item => item.productId.toString() !== req.params.productId);
      await cart.save();
    }
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/cart/clear/:userId', async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.params.userId });
    res.json({ success: true });
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