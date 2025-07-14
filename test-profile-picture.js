// Test script to check profile picture functionality
const testProfilePicture = async () => {
  const imageKitUrl = 'https://ik.imagekit.io/ezuymndjw/profile-pictures/profile_1751643596449_6865cef8d1e288afd22fe6a4_luUOSP8_s';
  
  console.log('Testing ImageKit URL:', imageKitUrl);
  
  try {
    const response = await fetch(imageKitUrl, {
      method: 'HEAD',
      mode: 'cors'
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', [...response.headers.entries()]);
    
    if (response.ok) {
      console.log('✅ Image is accessible');
    } else {
      console.log('❌ Image is not accessible');
    }
  } catch (error) {
    console.error('❌ Error accessing image:', error);
  }
};

// Test CORS and image accessibility
testProfilePicture();

// Test if the image loads in an img element
const testImageLoad = () => {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  
  img.onload = () => {
    console.log('✅ Image loaded successfully in img element');
  };
  
  img.onerror = (error) => {
    console.error('❌ Image failed to load in img element:', error);
  };
  
  img.src = 'https://ik.imagekit.io/ezuymndjw/profile-pictures/profile_1751643596449_6865cef8d1e288afd22fe6a4_luUOSP8_s';
};

testImageLoad();