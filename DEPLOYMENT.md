# Deployment Guide

## 🚀 Quick Deployment

### Prerequisites
- GitHub account
- Render account (for backend)
- Netlify account (for frontend)
- MongoDB Atlas account
- ImageKit account

### 1. Backend Deployment (Render)

1. **Create Render Service**:
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

2. **Configure Service**:
   - **Name**: `anzia-electronics-api`
   - **Environment**: `Node`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

3. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_jwt_secret_min_32_chars
   JWT_EXPIRE=30d
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   ADMIN_EMAIL=admin@anziaelectronics.com
   ```

### 2. Frontend Deployment (Netlify)

1. **Create Netlify Site**:
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select repository

2. **Build Settings**:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

3. **Environment Variables**:
   ```
   VITE_API_BASE_URL=https://anzia-electronics-api.onrender.com/api
   VITE_BACKEND_URL=https://anzia-electronics-api.onrender.com
   VITE_IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   VITE_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   VITE_GA_MEASUREMENT_ID=your_google_analytics_id
   ```

4. **Redirects Configuration**:
   The `netlify.toml` file is already configured with proper redirects.

### 3. Admin Panel Deployment (Netlify)

1. **Create Second Netlify Site**:
   - Follow same steps as frontend
   - **Base directory**: `admin`
   - **Build command**: `npm run build`
   - **Publish directory**: `admin/dist`

2. **Environment Variables**:
   ```
   VITE_BACKEND_URL=https://anzia-electronics-api.onrender.com
   VITE_API_URL=https://anzia-electronics-api.onrender.com/api
   ```

## 🔧 Post-Deployment Setup

### 1. Database Setup
- Ensure MongoDB Atlas is configured with proper IP whitelist
- Create admin user using backend script
- Verify database connections

### 2. Security Configuration
- Update CORS origins in backend
- Verify all environment variables
- Test authentication flows

### 3. Testing
- Test all API endpoints
- Verify image uploads work
- Test user registration/login
- Verify admin panel access

## 📊 Monitoring

### Health Checks
- Backend: `https://your-backend-url.onrender.com/api/health`
- Frontend: Check site loads properly
- Admin: Verify admin login works

### Performance
- Monitor Render service metrics
- Check Netlify build times
- Monitor database performance

## 🔒 Security Checklist

- [ ] All environment variables set
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Database access restricted
- [ ] Admin credentials secure

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies installed
   - Check environment variables

2. **API Connection Issues**:
   - Verify backend URL in frontend env
   - Check CORS configuration
   - Ensure backend is running

3. **Database Connection**:
   - Check MongoDB Atlas IP whitelist
   - Verify connection string
   - Check network access settings

### Support
- Check deployment logs in Render/Netlify dashboards
- Monitor application logs
- Use browser developer tools for frontend issues