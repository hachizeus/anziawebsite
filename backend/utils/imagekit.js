const ImageKit = require('imagekit');

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Upload an image to ImageKit
const uploadImage = async (file, fileName, folder = 'products') => {
  try {
    const result = await imagekit.upload({
      file,
      fileName,
      folder: folder
    });
    
    return {
      url: result.url,
      fileId: result.fileId,
      name: result.name
    };
  } catch (error) {
    console.error('ImageKit upload error:', error);
    throw new Error('Image upload failed');
  }
};

// Delete an image from ImageKit
const deleteImage = async (fileId) => {
  try {
    await imagekit.deleteFile(fileId);
    return true;
  } catch (error) {
    console.error('ImageKit delete error:', error);
    throw new Error('Image deletion failed');
  }
};

// Get authentication parameters for client-side uploads
const getAuthParams = () => {
  return imagekit.getAuthenticationParameters();
};

module.exports = {
  imagekit,
  uploadImage,
  deleteImage,
  getAuthParams
};