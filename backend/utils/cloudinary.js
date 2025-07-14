import fs from 'fs';
import ImageKit from 'imagekit';
import dotenv from 'dotenv';

dotenv.config();

// Initialize ImageKit (used as a Cloudinary alternative)
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Upload file to ImageKit
export const uploadToCloudinary = async (filePath) => {
  try {
    // Read file as buffer
    const fileBuffer = fs.readFileSync(filePath);
    
    // Upload to ImageKit
    const result = await imagekit.upload({
      file: fileBuffer,
      fileName: `blog-${Date.now()}`,
      folder: '/blogs'
    });
    
    // Delete local file after upload
    fs.unlinkSync(filePath);
    
    return {
      public_id: result.fileId,
      secure_url: result.url
    };
  } catch (error) {
    console.error('Error uploading to ImageKit:', error);
    throw new Error('Failed to upload image');
  }
};

// For development/mock mode, return a placeholder image
export const getMockImageUrl = () => {
  return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3';
};
