# Electronics E-commerce Website

A full-stack e-commerce website for electronics products built with React, Node.js, Express, MongoDB, and ImageKit.

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

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd frontend && npm install
   cd admin && npm install
   cd backend && npm install
   ```

3. Start the development servers:
   ```bash
   # Start backend server
   cd backend && npm run dev
   
   # Start frontend server
   cd frontend && npm run dev
   
   # Start admin server
   cd admin && npm run dev
   ```

## Features

- User authentication (signup, login, logout)
- Product browsing and filtering
- Shopping cart functionality
- Admin dashboard for product management
- Image upload and management with ImageKit
- Responsive design for mobile and desktop

## API Testing

To run the API tests:

```bash
cd test && npm test
```

## Deployment

### Backend (Render)

Deploy the backend to Render:

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Set the following configuration:
   - **Name**: anzia-electronics-api
   - **Environment**: Node
   - **Build Command**: npm install
   - **Start Command**: npm start
   - **Root Directory**: backend
4. Add the environment variables from the backend `.env` file

### Frontend (Netlify)

Deploy the frontend to Netlify:

1. Connect your GitHub repository to Netlify
2. Set the build command to `cd frontend && npm run build`
3. Set the publish directory to `frontend/dist`
4. Add the environment variables from the frontend `.env` file
5. Add the following to your `netlify.toml` file:
   ```toml
   [build]
     base = "frontend"
     publish = "dist"
     command = "npm run build"

   [[redirects]]
     from = "/api/*"
     to = "https://anzia-electronics-api.onrender.com/api/:splat"
     status = 200
     force = true

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```