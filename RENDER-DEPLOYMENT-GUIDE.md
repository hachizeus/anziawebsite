# Render Deployment Guide

This guide explains how to deploy the Anzia Electronics website components separately on Render.

## 1. Backend API Deployment

1. Go to your Render dashboard: https://dashboard.render.com/
2. Click "New" > "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: anzia-api
   - **Environment**: Node
   - **Root Directory**: backend
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: Free

5. Add the following environment variables:
   - `PORT`: 10000
   - `NODE_ENV`: production
   - `MONGODB_URI`: mongodb+srv://anziaelectronics:0a0b0c0d@anziaelectronics.vfsc5md.mongodb.net/?retryWrites=true&w=majority&appName=anziaelectronics
   - `MONGODB_DB_NAME`: anziaelectronics
   - `JWT_SECRET`: cd57c4c40415b68b920360bc1537f5d026ea58496733d8f37a948b12794e82c30e5b2a809f87a6c6ccc50f830aacedbe2b8922306ba90b322b17f41b3e03fc6c
   - `IMAGEKIT_PUBLIC_KEY`: public_ahoxvdF2fShMnKvheyP8TQrAKhE=
   - `IMAGEKIT_PRIVATE_KEY`: private_2giGXPBneW+SEkkpeZIG7djjhqw=
   - `IMAGEKIT_URL_ENDPOINT`: https://ik.imagekit.io/q5jukn457

6. Click "Create Web Service"
7. Wait for the deployment to complete and note the URL (e.g., https://anzia-api.onrender.com)

## 2. Frontend Deployment

1. Go to your Render dashboard
2. Click "New" > "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: anzia-frontend
   - **Environment**: Node
   - **Root Directory**: frontend
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview -- --port $PORT --host 0.0.0.0`
   - **Plan**: Free

5. Add the following environment variables:
   - `VITE_API_BASE_URL`: https://anzia-api.onrender.com/api (use your backend URL)
   - `VITE_IMAGEKIT_URL`: https://ik.imagekit.io/q5jukn457

6. Click "Create Web Service"
7. Wait for the deployment to complete

## 3. Admin Dashboard Deployment

1. Go to your Render dashboard
2. Click "New" > "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: anzia-admin
   - **Environment**: Node
   - **Root Directory**: admin
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview -- --port $PORT --host 0.0.0.0`
   - **Plan**: Free

5. Add the following environment variables:
   - `VITE_API_BASE_URL`: https://anzia-api.onrender.com/api (use your backend URL)
   - `VITE_IMAGEKIT_URL`: https://ik.imagekit.io/q5jukn457

6. Click "Create Web Service"
7. Wait for the deployment to complete

## Testing the Deployments

- Backend API: `https://anzia-api.onrender.com/health`
- Frontend: `https://anzia-frontend.onrender.com`
- Admin Dashboard: `https://anzia-admin.onrender.com`

## Troubleshooting

If you encounter any issues:

1. Check the logs in the Render dashboard
2. Make sure all environment variables are set correctly
3. Verify that the API URL in the frontend and admin environment variables matches your deployed backend URL