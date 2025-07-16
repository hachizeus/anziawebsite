# Migration Guide: Supabase to MongoDB and ImageKit

This guide provides instructions for migrating the Anzia Electronics website from Supabase to MongoDB for database storage and ImageKit for image storage.

## Prerequisites

1. MongoDB Atlas account with a cluster set up
2. ImageKit account with API credentials
3. Node.js and npm installed

## Step 1: Update Environment Variables

### Backend Environment Variables

Update your `.env` file in the backend directory with the following:

```
# MongoDB Configuration
MONGODB_URI=mongodb+srv://anziaelectronics:0a0b0c0d@anziaelectronics.vfsc5md.mongodb.net/?retryWrites=true&w=majority&appName=anziaelectronics
MONGODB_DB_NAME=anziaelectronics

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id

# Keep your existing JWT and other configuration
JWT_SECRET=your_existing_jwt_secret
```

### Frontend Environment Variables

Update your `.env` file in the frontend directory:

```
VITE_API_BASE_URL=http://localhost:4000
VITE_BACKEND_URL=http://localhost:4000
VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id
VITE_IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
VITE_GA_MEASUREMENT_ID=G-CTKG6N5Q2J
```

## Step 2: Install Dependencies

Install the required dependencies for MongoDB and ImageKit:

```bash
cd backend
npm install mongodb mongoose imagekit --save
```

## Step 3: Test MongoDB and ImageKit Integration

Run the test script to verify that MongoDB and ImageKit are properly configured:

```bash
npm run test-mongodb
```

This script will:
1. Test the MongoDB connection
2. Perform basic CRUD operations on MongoDB
3. Test the ImageKit configuration
4. Upload and delete a test image to ImageKit

Make sure all tests pass before proceeding.

## Step 4: Migrate Data from Supabase to MongoDB

Run the migration script to transfer data from Supabase to MongoDB:

```bash
npm run migrate
```

This script will:
1. Fetch all products from Supabase
2. Download product images from Supabase storage
3. Upload images to ImageKit
4. Store product data in MongoDB with updated image URLs
5. Migrate user data from Supabase Auth to MongoDB

## Step 5: Start the Application with MongoDB

Start the application with the new MongoDB and ImageKit configuration:

```bash
npm run dev
```

## Troubleshooting

### MongoDB Connection Issues

If you encounter MongoDB connection issues:

1. Verify that your MongoDB URI is correct
2. Check that your IP address is whitelisted in MongoDB Atlas
3. Ensure that your MongoDB user has the correct permissions

### ImageKit Issues

If you encounter ImageKit issues:

1. Verify that your ImageKit API keys are correct
2. Check that your ImageKit endpoint URL is correct
3. Ensure that you have sufficient storage and permissions in your ImageKit account

### Migration Issues

If the migration script fails:

1. Check the error messages for specific issues
2. Run the script with a smaller subset of data if needed
3. Manually verify and fix any problematic records

## Rollback Plan

If you need to roll back to Supabase:

1. Revert the environment variables to use Supabase
2. Revert the code changes that replaced Supabase with MongoDB
3. Restart the application

## Additional Notes

- The migration script preserves the original Supabase IDs as references in MongoDB
- User passwords are not migrated; users will need to reset their passwords
- Make sure to update any scheduled tasks or external integrations to use the new MongoDB database