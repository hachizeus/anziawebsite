# How to Deploy Frontend and Admin to Render

## Method 1: Using Blueprint (Recommended)

### Step 1: Push Changes to GitHub
```bash
git add .
git commit -m "Add Render deployment configuration"
git push origin master
```

### Step 2: Create Blueprint in Render
1. Go to [render.com](https://render.com) and log in
2. Click **"New"** → **"Blueprint"**
3. Connect your GitHub repository
4. Select your repository: `anziawebsite`
5. Render will detect the `render.yaml` file automatically
6. Click **"Apply"**

### Step 3: Set Secret Environment Variables
After Blueprint creation, set these secret variables:

**For Backend Service (anzia-electronics-api):**
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Your JWT secret key
- `IMAGEKIT_PRIVATE_KEY`: Your ImageKit private key

**How to set:**
1. Go to your Render dashboard
2. Click on **"anzia-electronics-api"** service
3. Go to **"Environment"** tab
4. Add the secret variables

## Method 2: Manual Setup (Alternative)

### Backend Service
1. **Create Web Service**
   - Name: `anzia-electronics-api`
   - Environment: `Node`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Root Directory: Leave empty

2. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   IMAGEKIT_PUBLIC_KEY=public_ahoxvdF2fShMnKvheyP8TQrAKhE=
   IMAGEKIT_PRIVATE_KEY=your_private_key
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/q5jukn457
   ```

### Frontend Service
1. **Create Static Site**
   - Name: `anzia-electronics-frontend`
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`
   - Root Directory: Leave empty

2. **Environment Variables:**
   ```
   VITE_API_BASE_URL=https://anzia-electronics-api.onrender.com/api
   VITE_BACKEND_URL=https://anzia-electronics-api.onrender.com
   VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/q5jukn457
   VITE_IMAGEKIT_PUBLIC_KEY=public_ahoxvdF2fShMnKvheyP8TQrAKhE=
   VITE_GA_MEASUREMENT_ID=G-CTKG6N5Q2J
   ```

3. **Redirects/Rewrites:**
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite`

### Admin Service
1. **Create Static Site**
   - Name: `anzia-electronics-admin`
   - Build Command: `cd admin && npm install && npm run build`
   - Publish Directory: `admin/dist`
   - Root Directory: Leave empty

2. **Environment Variables:**
   ```
   VITE_API_BASE_URL=https://anzia-electronics-api.onrender.com/api
   VITE_BACKEND_URL=https://anzia-electronics-api.onrender.com
   VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/q5jukn457
   VITE_IMAGEKIT_PUBLIC_KEY=public_ahoxvdF2fShMnKvheyP8TQrAKhE=
   ```

3. **Redirects/Rewrites:**
   - Source: `/*`
   - Destination: `/index.html`
   - Action: `Rewrite`

## Final URLs
After deployment, you'll get these URLs:
- **Backend API**: `https://anzia-electronics-api.onrender.com`
- **Frontend**: `https://anzia-electronics-frontend.onrender.com`
- **Admin Panel**: `https://anzia-electronics-admin.onrender.com`

## Verification Steps
1. **Test Backend**: Visit `https://anzia-electronics-api.onrender.com/api/health`
2. **Test Frontend**: Visit your frontend URL and check if it loads
3. **Test Admin**: Visit your admin URL and check if it loads
4. **Test API Connection**: Try logging in or viewing products

## Troubleshooting
- **Build Fails**: Check build logs in Render dashboard
- **Environment Variables**: Ensure all variables are set correctly
- **CORS Issues**: Backend CORS is configured for your frontend domains
- **404 Errors**: Make sure redirects/rewrites are configured for SPAs