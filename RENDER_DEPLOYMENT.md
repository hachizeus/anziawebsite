# Deploying to Render

This guide will walk you through deploying the Anzia Electronics API to Render.

## Prerequisites

1. A [Render](https://render.com) account
2. Your GitHub repository connected to Render
3. MongoDB Atlas database set up

## Option 1: Deploy via Web Interface

1. **Create a new Web Service**
   - Log in to your Render dashboard
   - Click "New" and select "Web Service"

2. **Connect your repository**
   - Select your GitHub repository
   - Choose the branch you want to deploy (usually `main` or `master`)

3. **Configure the service**
   - **Name**: anzia-electronics-api
   - **Environment**: Node
   - **Region**: Choose the closest to your users
   - **Branch**: main (or master)
   - **Root Directory**: backend
   - **Build Command**: npm install
   - **Start Command**: npm start
   - **Instance Type**: Free (for testing) or Basic (for production)

4. **Set environment variables**
   - Click "Advanced" and add the following environment variables:
     ```
     NODE_ENV=production
     PORT=10000
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     JWT_EXPIRE=30d
     IMAGEKIT_PUBLIC_KEY=public_ahoxvdF2fShMnKvheyP8TQrAKhE=
     IMAGEKIT_PRIVATE_KEY=your_private_key
     IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/q5jukn457
     ```

5. **Create Web Service**
   - Click "Create Web Service"
   - Wait for the deployment to complete

## Option 2: Deploy via render.yaml (Blueprint)

1. **Push the render.yaml file**
   - Make sure the render.yaml file is in the root of your repository
   - Push the changes to GitHub

2. **Create a new Blueprint**
   - In your Render dashboard, click "New" and select "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the render.yaml file
   - Review the configuration and click "Apply"

3. **Set secret environment variables**
   - After the Blueprint is created, you'll need to set the secret environment variables:
     - MONGODB_URI
     - JWT_SECRET
     - IMAGEKIT_PRIVATE_KEY

## Verifying the Deployment

1. Once deployed, Render will provide a URL for your service (e.g., https://anzia-electronics-api.onrender.com)
2. Test the API by visiting https://anzia-electronics-api.onrender.com/api/health
3. You should see a response like: `{"status":"ok","message":"API is working"}`

## Troubleshooting

If you encounter any issues:

1. **Check the logs**
   - In your Render dashboard, click on your service
   - Go to the "Logs" tab to see what's happening

2. **Common issues**
   - **MongoDB connection**: Make sure your MongoDB URI is correct and that your IP is whitelisted in MongoDB Atlas
   - **Environment variables**: Verify all environment variables are set correctly
   - **Build errors**: Check that all dependencies are properly listed in package.json

3. **Restart the service**
   - If needed, you can manually restart the service from the Render dashboard

## Updating the Deployment

Render automatically deploys when you push changes to your repository. To update:

1. Make your changes locally
2. Commit and push to GitHub
3. Render will automatically rebuild and deploy the updated code