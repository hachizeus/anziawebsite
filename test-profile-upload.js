// Test profile picture upload
const testProfileUpload = async () => {
  const token = 'your-token-here'; // Replace with actual token
  
  // Create a test base64 image (1x1 pixel PNG)
  const testImageBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  
  const testData = {
    bio: 'Test bio',
    phone: '+254712345678',
    whatsapp: '+254712345678',
    email: 'test@example.com',
    currency: 'KSH',
    profilePictureBase64: testImageBase64
  };
  
  try {
    const response = await fetch('http://localhost:4000/api/agents/profile', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    const result = await response.json();
    console.log('Response:', result);
    
    if (result.success) {
      console.log('✅ Profile picture upload successful');
      console.log('New profile picture URL:', result.agent.profilePicture);
    } else {
      console.log('❌ Profile picture upload failed:', result.message);
    }
  } catch (error) {
    console.error('❌ Error testing profile upload:', error);
  }
};

console.log('Profile picture upload test ready. Call testProfileUpload() with a valid token.');