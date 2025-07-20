import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import path from 'path';
import { connectToDatabase } from './config/mongodb.js';
import { trackAPIStats } from './middleware/statsMiddleware.js';
import { configureSecurityMiddleware } from './middleware/security.js';
import cspMiddleware from './middleware/cspMiddleware.js';
import { securityLogger } from './middleware/securityLogger.js';

import productRouter from './routes/ProductRouter.js';
import productRoutes from './routes/productRoutes.js';
import userrouter from './routes/UserRoute.js';
import adminUtilsRouter from './routes/adminRoutes.js';
import adminAuthRoutes from './routes/adminAuthRoutes.js';
import testProductRoute from './routes/testProductRoute.js';
import frontendProductRoutes from './routes/frontendProductRoutes.js';
import trackingRoutes from './routes/trackingRoutes.js';
import imagekitRoutes from './routes/imagekitRoutes.js';
import formRouter from './routes/formrouter.js';

// Load environment variables at the very beginning
try {
  const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
  dotenv.config({ path: envFile });
  console.log('Environment file loaded:', envFile);
} catch (error) {
  console.log('Using environment variables from process.env');
}

// Using MongoDB as primary database
console.log('Database: MongoDB configured');

console.log("Environment variables loaded:", {
  ADMIN_EMAIL_SET: !!process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD_SET: !!process.env.ADMIN_PASSWORD,
  JWT_SECRET_SET: !!process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV || 'development'
});

const app = express();



// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser()); // Add cookie parser middleware

// Serve static files from uploads and public directories
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/public', express.static(path.join(process.cwd(), 'public')));
app.use(express.static(path.join(process.cwd(), 'public')));

// Serve the authentication fix tool
app.get('/fix-auth', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'fix-auth-issues.html'));
});

// CORS Configuration - Allow specific origins and handle preflight requests properly
app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      process.env.WEBSITE_URL,
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5000',
      'http://localhost:8000',
      'http://localhost:8080',
      'https://anzia-electronics-frontend.vercel.app',
      'https://anzia-electronics-frontend.netlify.app'
    ].filter(Boolean);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(null, true); // Allow all origins for now to debug
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With', 'X-CSRF-Token', 'Cache-Control', 'Pragma']
}));

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Origin: ${req.get('origin') || 'unknown'}`);
  next();
});

// Add OPTIONS handling for preflight requests
app.options('*', cors({
  origin: true,
  credentials: true
}));

// Security middlewares - after CORS to avoid blocking CORS headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.jsdelivr.net", "https://unpkg.com", "https://www.google-analytics.com", "https://www.googletagmanager.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "https://ik.imagekit.io", "https://images.unsplash.com", "https://www.google-analytics.com"],
      connectSrc: ["'self'", "https://api.imagekit.io", "https://www.google-analytics.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      formAction: ["'self'"]
    }
  }
}));

// Add additional security headers
app.use((req, res, next) => {
  // Prevent clickjacking attacks
  res.setHeader('X-Frame-Options', 'DENY');
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  // Enable XSS protection in browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Disable caching for sensitive pages
  if (req.path.includes('/api/auth') || req.path.includes('/api/users')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
  }
  next();
});

app.use(compression());
// Apply comprehensive security middleware
configureSecurityMiddleware(app);

// Apply additional security middleware
// Import security middleware
import securityMiddleware from './middleware/securityMiddleware.js';
securityMiddleware.forEach(middleware => app.use(middleware));
app.use(cspMiddleware());
app.use(securityLogger);
app.use(trackAPIStats);

// Import MongoDB initialization
import { initializeMongoDB } from './config/initMongoDB.js';

// Import in-memory store for fallback
import * as inMemoryStore from './utils/inMemoryStore.js';

// Connect to MongoDB and initialize
connectToDatabase()
  .then(() => {
    console.log('MongoDB connected successfully');
    return initializeMongoDB();
  })
  .then(initialized => {
    if (initialized) {
      console.log('MongoDB initialized successfully');
    } else {
      console.warn('MongoDB initialization may have issues');
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Test routes removed

// Import DB check route
import dbCheckRoute from './routes/dbCheckRoute.js';

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/legacy-products', productRouter);
app.use('/api/users', userrouter);
app.use('/api/admin', adminUtilsRouter);
app.use('/api/admin-auth', adminAuthRoutes);
app.use('/api/test', testProductRoute);
app.use('/api/frontend/products', frontendProductRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/imagekit', imagekitRoutes);
app.use('/api/db', dbCheckRoute);
app.use('/api/forms', formRouter);

// Test routes removed

// Development middleware removed

// Import global error handler
import { globalErrorHandler, catchAllHandler } from './middleware/errorHandler.js';

// Handle all routes - NEVER FAIL
app.use('*', catchAllHandler);

// Global error handler - NEVER FAIL
app.use(globalErrorHandler);

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err);
  process.exit(1);
});

// Status check endpoint
app.get('/status', (req, res) => {
  res.status(200).json({ status: 'OK', time: new Date().toISOString() });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root endpoint - health check HTML
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Anzia Electronics API Status</title>
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

const port = process.env.PORT || 4000;

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
