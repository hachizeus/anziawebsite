import { getImageKitAuth } from '../services/api';

// ImageKit URL endpoint
const IMAGEKIT_URL = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/q5jukn457';

// Get optimized image URL with transformations
export const getOptimizedImageUrl = (url, width = 400, height = 300, quality = 80) => {
  if (!url) return '';
  
  // If it's already an ImageKit URL, add transformations
  if (url.includes('ik.imagekit.io')) {
    // Parse the URL to extract the path
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      
      // Add transformations
      return `${IMAGEKIT_URL}${path}?tr=w-${width},h-${height},q-${quality}`;
    } catch (error) {
      console.error('Error parsing ImageKit URL:', error);
      return url;
    }
  }
  
  // If it's not an ImageKit URL, return as is
  return url;
};

// Get responsive image URLs for different screen sizes
export const getResponsiveImageUrls = (url) => {
  if (!url) return {};
  
  return {
    small: getOptimizedImageUrl(url, 400, 300),
    medium: getOptimizedImageUrl(url, 800, 600),
    large: getOptimizedImageUrl(url, 1200, 900)
  };
};

// Upload an image to ImageKit
export const uploadImage = async (file, folder = 'products') => {
  try {
    // Get authentication parameters
    const { authParams } = await getImageKitAuth();
    
    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('publicKey', authParams.publicKey);
    formData.append('signature', authParams.signature);
    formData.append('token', authParams.token);
    formData.append('expire', authParams.expire);
    formData.append('fileName', `${file.name.split('.')[0]}_${Date.now()}`);
    formData.append('folder', folder);
    
    // Upload to ImageKit
    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload image');
    }
    
    const data = await response.json();
    
    return {
      url: data.url,
      fileId: data.fileId,
      name: data.name
    };
  } catch (error) {
    console.error('Error uploading image to ImageKit:', error);
    throw error;
  }
};

// Extract image ID from ImageKit URL
export const getImageIdFromUrl = (url) => {
  if (!url || !url.includes('ik.imagekit.io')) return null;
  
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const parts = path.split('/');
    return parts[parts.length - 1];
  } catch (error) {
    console.error('Error extracting image ID:', error);
    return null;
  }
};