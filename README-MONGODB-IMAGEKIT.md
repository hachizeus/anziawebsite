# MongoDB and ImageKit Integration

This project has been migrated from Supabase to MongoDB and ImageKit. This document provides information on how to use these services in the project.

## MongoDB Configuration

MongoDB is used as the primary database for this project. The connection is configured in `backend/config/mongodb.js`.

### Connection String

```
mongodb+srv://anziaelectronics:0a0b0c0d@anziaelectronics.vfsc5md.mongodb.net/?retryWrites=true&w=majority&appName=anziaelectronics
```

### Environment Variables

The following environment variables are used for MongoDB configuration:

```
MONGODB_URI=mongodb+srv://anziaelectronics:0a0b0c0d@anziaelectronics.vfsc5md.mongodb.net/?retryWrites=true&w=majority&appName=anziaelectronics
MONGODB_DB_NAME=anziaelectronics
```

### Collections

The following collections are used in the project:

- `products`: Stores product information
- `users`: Stores user information
- `carts`: Stores cart information
- `cart_items`: Stores cart item information
- `orders`: Stores order information
- `order_items`: Stores order item information
- `user_actions`: Stores user action tracking information
- `product_views`: Stores product view tracking information

## ImageKit Configuration

ImageKit is used for image storage and optimization. The configuration is in `backend/config/imagekit.js`.

### Credentials

```
IMAGEKIT_PUBLIC_KEY=public_ahoxvdF2fShMnKvheyP8TQrAKhE=
IMAGEKIT_PRIVATE_KEY=private_2giGXPBneW+SEkkpeZIG7djjhqw=
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/q5jukn457
```

### Usage

#### Backend

To upload an image from the backend:

```javascript
import { uploadToStorage } from '../middleware/fileStorage.js';

// Upload a file
const imageUrl = await uploadToStorage(file, '/folder-name');
```

#### Frontend

To display an optimized image in the frontend:

```jsx
import ImageKitImage from '../components/common/ImageKitImage';

// Display an image with optimization
<ImageKitImage 
  src="https://ik.imagekit.io/q5jukn457/your-image.jpg" 
  alt="Description" 
  width={300} 
  height={200} 
/>
```

## Testing

To test the MongoDB and ImageKit integration:

```bash
npm run test-integration
```

This will verify that:
1. MongoDB connection is working
2. ImageKit configuration is correct
3. Image uploads to ImageKit are working

## Migration

If you need to migrate data from Supabase to MongoDB, you can use the migration script:

```bash
npm run migrate:complete
```

This will:
1. Move data from Supabase to MongoDB
2. Upload images from Supabase to ImageKit
3. Update references to use the new ImageKit URLs