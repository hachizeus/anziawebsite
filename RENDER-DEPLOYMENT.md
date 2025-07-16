# Deploying to Render

This guide explains how to deploy the Anzia Electronics website to Render.

## Prerequisites

1. A Render account (https://render.com)
2. Your GitHub repository connected to Render

## Deployment Steps

### Option 1: Using the Blueprint (Recommended)

1. Log in to your Render account
2. Go to the Dashboard and click "New" > "Blueprint"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file and create the services

### Option 2: Manual Setup

#### Backend API

1. Create a new Web Service in Render
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: anzia-electronics-api
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm run start:render`
   - **Environment Variables**: Add all variables from your `.env` file

#### Frontend

1. Create a new Web Service in Render
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: anzia-electronics-frontend
   - **Environment**: Node
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Start Command**: `cd frontend && npm run preview -- --port $PORT --host 0.0.0.0`
   - **Environment Variables**:
     - `VITE_API_BASE_URL`: URL of your backend API (e.g., https://anzia-electronics-api.onrender.com/api)
     - `VITE_IMAGEKIT_URL`: Your ImageKit URL

#### Admin Dashboard

1. Create a new Web Service in Render
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: anzia-electronics-admin
   - **Environment**: Node
   - **Build Command**: `cd admin && npm install && npm run build`
   - **Start Command**: `cd admin && npm run preview -- --port $PORT --host 0.0.0.0`
   - **Environment Variables**:
     - `VITE_API_BASE_URL`: URL of your backend API
     - `VITE_IMAGEKIT_URL`: Your ImageKit URL

## Environment Variables

Make sure to set these environment variables in Render:

### Backend API
- `PORT`: Automatically set by Render
- `NODE_ENV`: production
- `MONGODB_URI`: Your MongoDB connection string
- `MONGODB_DB_NAME`: Your MongoDB database name
- `JWT_SECRET`: Your JWT secret key
- `IMAGEKIT_PUBLIC_KEY`: Your ImageKit public key
- `IMAGEKIT_PRIVATE_KEY`: Your ImageKit private key
- `IMAGEKIT_URL_ENDPOINT`: Your ImageKit URL endpoint

### Frontend and Admin
- `VITE_API_BASE_URL`: URL of your backend API
- `VITE_IMAGEKIT_URL`: Your ImageKit URL

## After Deployment

1. Test your application by visiting the URLs provided by Render
2. Check the logs for any errors
3. Update your frontend and admin environment variables if needed