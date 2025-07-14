# Anzia Electronics - E-commerce Platform

A modern, full-stack e-commerce platform built with React, Node.js, and Supabase for electronics retail.

## 🚀 Features

- **Product Management**: Complete CRUD operations for electronics products
- **User Authentication**: Secure user registration and login with Supabase Auth
- **Admin Dashboard**: Comprehensive admin panel for managing products, orders, and users
- **Shopping Cart**: Add to cart and checkout functionality
- **Order Management**: Track orders and order history
- **Responsive Design**: Mobile-first responsive design
- **Image Storage**: Supabase storage for product images
- **Search & Filter**: Advanced product search and filtering

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **Supabase Client** - Database and auth integration

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Supabase** - Database, authentication, and storage
- **JWT** - JSON Web Tokens for authentication
- **Multer** - File upload handling
- **Helmet** - Security middleware

### Database
- **Supabase (PostgreSQL)** - Primary database
- **Row Level Security** - Database-level security
- **Real-time subscriptions** - Live data updates

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone the repository
```bash
git clone https://github.com/hachizeus/anziawebsite.git
cd anziawebsite
```

### 2. Install dependencies
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install

# Install admin dependencies
cd ../admin && npm install
```

### 3. Environment Setup

#### Backend (.env)
```env
PORT=4000
SUPABASE_URL=https://kasdvsdakhvfgynmjcxi.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
JWT_SECRET=your_jwt_secret
NODE_ENV=development
WEBSITE_URL=http://localhost:3000
ADMIN_EMAIL=admin@anziaelectronics.com
ADMIN_PASSWORD=admin123
```

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:4000
VITE_BACKEND_URL=http://localhost:4000
VITE_SUPABASE_URL=https://kasdvsdakhvfgynmjcxi.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup

1. Create a new Supabase project
2. Run the SQL schema from `supabase-schema-updated.sql` in your Supabase SQL editor
3. Enable Row Level Security on all tables
4. Create storage bucket for product images

### 5. Run the application

```bash
# Development mode (runs all services)
npm run dev

# Or run individually:
# Backend
cd backend && npm run dev

# Frontend  
cd frontend && npm run dev

# Admin
cd admin && npm run dev
```

## 🌐 Access Points

- **Frontend**: http://localhost:5173
- **Admin Panel**: http://localhost:5174  
- **Backend API**: http://localhost:4000

## 📱 Usage

### For Customers
1. Browse products by category
2. Search and filter products
3. Add products to cart
4. Register/Login to place orders
5. Track order history

### For Administrators
1. Access admin panel at `/admin`
2. Login with admin credentials
3. Add/Edit/Delete products
4. Manage orders and customers
5. View analytics and reports

## 🔧 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products/add` - Add new product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details

## 🚀 Deployment

### Backend (Render/Railway)
1. Connect your GitHub repository
2. Set environment variables
3. Deploy with build command: `npm install`
4. Start command: `npm start`

### Frontend (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

### Database
- Supabase handles hosting automatically
- Configure production environment variables
- Set up proper RLS policies

## 🔒 Security Features

- JWT-based authentication
- Row Level Security (RLS) in Supabase
- Input validation and sanitization
- CORS protection
- Helmet security headers
- Rate limiting
- Secure file uploads

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@anziaelectronics.com or create an issue on GitHub.

## 🔄 Updates

- **v1.0.0** - Initial release with core e-commerce functionality
- **v1.1.0** - Added admin dashboard and order management
- **v1.2.0** - Migrated to Supabase for improved scalability

---

Built with ❤️ by the Anzia Electronics Team