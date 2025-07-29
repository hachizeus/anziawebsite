# Anzia Electronics E-commerce Platform

A modern, secure, full-stack e-commerce website for electronics products built with React, Node.js, Express, MongoDB, and ImageKit. Features enterprise-level security, responsive design, and comprehensive admin management.

## Project Structure

- **frontend**: React application for the customer-facing website
- **admin**: React application for the admin dashboard
- **backend**: Node.js/Express API server
- **test**: API test scripts

## Technologies Used

- **Frontend**: React, Vite, TailwindCSS
- **Backend**: Node.js, Express, MongoDB
- **Authentication**: JWT
- **Image Storage**: ImageKit
- **Deployment**: Netlify (Frontend), Netlify Functions (Backend)

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- ImageKit account

### Environment Variables

1. Create a `.env` file in the backend directory:
   ```
   PORT=4000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   ```

2. Create a `.env` file in the frontend directory:
   ```
   VITE_API_BASE_URL=/api
   VITE_BACKEND_URL=http://localhost:4000
   VITE_NETLIFY_API_URL=/.netlify/functions/api
   VITE_NETLIFY_BACKEND_URL=/.netlify/functions
   VITE_IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   VITE_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   VITE_GA_MEASUREMENT_ID=your_google_analytics_id
   ```

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/victorgathecha/anzia-electronics.git
   cd anzia-electronics
   ```

2. **Install all dependencies**:
   ```bash
   npm run setup
   ```
   Or manually:
   ```bash
   npm install
   cd frontend && npm install
   cd ../admin && npm install
   cd ../backend && npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.example` files in each directory
   - Fill in your MongoDB, ImageKit, and other credentials

4. **Start development servers**:
   ```bash
   # Start all services
   npm run dev
   
   # Or start individually
   npm run dev:backend   # Backend on port 4000
   npm run dev:frontend  # Frontend on port 5173
   npm run dev:admin     # Admin on port 5174
   ```

## ✨ Features

### 🛒 E-commerce Core
- **Product Catalog**: Browse and filter electronics products
- **Shopping Cart**: Add, remove, and manage cart items
- **User Authentication**: Secure signup, login, and logout
- **Wishlist**: Save favorite products for later
- **Responsive Design**: Optimized for mobile, tablet, and desktop

### 🔐 Security Features
- **Rate Limiting**: Prevents brute force attacks
- **CSRF Protection**: Cross-site request forgery prevention
- **Account Lockout**: Automatic lockout after failed attempts
- **Input Validation**: Server-side validation and sanitization
- **Security Logging**: Comprehensive security event tracking
- **Password Strength**: Real-time password strength validation
- **Enhanced Headers**: XSS, clickjacking, and MIME-type protection

### 👨‍💼 Admin Features
- **Product Management**: Add, edit, and delete products
- **User Management**: View and manage user accounts
- **Security Dashboard**: Monitor security events and logs
- **Image Management**: Upload and manage product images
- **Analytics**: Track user behavior and sales metrics

### 🎨 User Experience
- **Dark/Light Mode**: Theme switching capability
- **Real-time Updates**: Live cart and wishlist updates
- **Loading States**: Smooth loading animations
- **Error Handling**: Graceful error management
- **SEO Optimized**: Search engine friendly structure

## API Testing

To run the API tests:

```bash
cd test && npm test
```

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy
1. **Backend**: Deploy to Render with Node.js environment
2. **Frontend**: Deploy to Netlify with React build
3. **Admin**: Deploy admin panel to separate Netlify site
4. **Database**: MongoDB Atlas for data storage
5. **Images**: ImageKit for image management

## 🔒 Security

This application implements enterprise-level security features:

- **Security Score**: 9/10 (Enterprise-level)
- **Rate Limiting**: API and authentication endpoints protected
- **CSRF Protection**: All state-changing requests protected
- **Account Security**: Automatic lockout and monitoring
- **Data Validation**: Comprehensive input sanitization
- **Security Logging**: Full audit trail of security events

See [SECURITY_IMPROVEMENTS.md](./SECURITY_IMPROVEMENTS.md) for detailed security documentation.

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Victor Gathecha**
- GitHub: [@victorgathecha](https://github.com/victorgathecha)
- Email: victor@anziaelectronics.com

## 🙏 Acknowledgments

- React team for the amazing framework
- MongoDB team for the database solution
- ImageKit for image management
- All contributors and testers