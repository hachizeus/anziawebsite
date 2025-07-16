// API Test Script
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  apiUrl: process.env.API_URL || 'https://anzia-electronics-api.onrender.com/api',
  netlifyUrl: process.env.NETLIFY_URL || 'https://anzia-electronics-api.onrender.com',
  imagekitPublicKey: process.env.IMAGEKIT_PUBLIC_KEY || 'your_public_key',
  imagekitPrivateKey: process.env.IMAGEKIT_PRIVATE_KEY || 'your_private_key',
  imagekitUrlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/your_id'
};

// Test user credentials
const testUser = {
  name: 'Test User',
  email: `test${Date.now()}@example.com`,
  password: 'password123'
};

// Test product data
const testProduct = {
  name: 'Test Product',
  description: 'This is a test product',
  price: 999,
  original_price: 1299,
  category: 'Electronics',
  brand: 'Test Brand',
  model: 'Test Model',
  stock_quantity: 10,
  availability: 'in-stock',
  features: ['Feature 1', 'Feature 2', 'Feature 3'],
  specifications: [
    { label: 'Brand', value: 'Test Brand' },
    { label: 'Model', value: 'Test Model' },
    { label: 'Condition', value: 'New' },
    { label: 'Warranty', value: '1 Year' }
  ]
};

// Test image path
const testImagePath = path.join(__dirname, 'test-image.jpg');

// Create HTTP client
const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Create Netlify HTTP client
const netlifyApi = axios.create({
  baseURL: config.netlifyUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Store auth token
let authToken = '';
let userId = '';
let productId = '';
let imageFileId = '';

// Helper function to log test results
const logTest = (name, success, error = null) => {
  if (success) {
    console.log(`✅ ${name}: PASSED`);
  } else {
    console.error(`❌ ${name}: FAILED`);
    if (error) {
      console.error(`   Error: ${error.message || error}`);
    }
  }
};

// Test user registration
const testRegistration = async () => {
  try {
    const response = await api.post('/users/register', testUser);
    
    if (response.data.success && response.data.token && response.data.user) {
      authToken = response.data.token;
      userId = response.data.user._id || response.data.user.id;
      logTest('User Registration', true);
      return true;
    } else {
      logTest('User Registration', false, 'Invalid response format');
      return false;
    }
  } catch (error) {
    logTest('User Registration', false, error);
    return false;
  }
};

// Test user login
const testLogin = async () => {
  try {
    const response = await api.post('/users/login', {
      email: testUser.email,
      password: testUser.password
    });
    
    if (response.data.success && response.data.token && response.data.user) {
      authToken = response.data.token;
      userId = response.data.user._id || response.data.user.id;
      logTest('User Login', true);
      return true;
    } else {
      logTest('User Login', false, 'Invalid response format');
      return false;
    }
  } catch (error) {
    logTest('User Login', false, error);
    return false;
  }
};

// Test product creation
const testCreateProduct = async () => {
  try {
    // Set auth header
    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    
    const response = await api.post('/product-management', testProduct);
    
    if (response.data.success && response.data.product) {
      productId = response.data.product._id || response.data.product.id;
      logTest('Product Creation', true);
      return true;
    } else {
      logTest('Product Creation', false, 'Invalid response format');
      return false;
    }
  } catch (error) {
    logTest('Product Creation', false, error);
    return false;
  }
};

// Test product retrieval
const testGetProducts = async () => {
  try {
    const response = await api.get('/products');
    
    if (response.data.success && Array.isArray(response.data.products)) {
      logTest('Get Products', true);
      return true;
    } else {
      logTest('Get Products', false, 'Invalid response format');
      return false;
    }
  } catch (error) {
    logTest('Get Products', false, error);
    return false;
  }
};

// Test product detail retrieval
const testGetProductDetail = async () => {
  try {
    const response = await api.get(`/products/${productId}`);
    
    if (response.data.success && response.data.product) {
      logTest('Get Product Detail', true);
      return true;
    } else {
      logTest('Get Product Detail', false, 'Invalid response format');
      return false;
    }
  } catch (error) {
    logTest('Get Product Detail', false, error);
    return false;
  }
};

// Test ImageKit auth
const testImageKitAuth = async () => {
  try {
    // Set auth header
    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    
    const response = await api.get('/imagekit/auth');
    
    if (response.data.success && response.data.authParams) {
      logTest('ImageKit Auth', true);
      return response.data.authParams;
    } else {
      logTest('ImageKit Auth', false, 'Invalid response format');
      return null;
    }
  } catch (error) {
    logTest('ImageKit Auth', false, error);
    return null;
  }
};

// Test image upload
const testImageUpload = async (authParams) => {
  try {
    if (!fs.existsSync(testImagePath)) {
      logTest('Image Upload', false, 'Test image not found');
      return false;
    }
    
    const formData = new FormData();
    formData.append('file', fs.createReadStream(testImagePath));
    formData.append('publicKey', authParams.publicKey);
    formData.append('signature', authParams.signature);
    formData.append('token', authParams.token);
    formData.append('expire', authParams.expire);
    formData.append('fileName', `test_${Date.now()}`);
    formData.append('folder', 'products');
    
    const response = await axios.post('https://upload.imagekit.io/api/v1/files/upload', formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
    
    if (response.data && response.data.url && response.data.fileId) {
      imageFileId = response.data.fileId;
      
      // Now update the product with the new image
      const updateResponse = await api.post(`/product-management/upload/${productId}`, {
        image: response.data.url,
        fileName: response.data.name,
        fileId: response.data.fileId
      });
      
      if (updateResponse.data.success && updateResponse.data.image) {
        logTest('Image Upload', true);
        return true;
      } else {
        logTest('Image Upload', false, 'Failed to update product with image');
        return false;
      }
    } else {
      logTest('Image Upload', false, 'Invalid response format');
      return false;
    }
  } catch (error) {
    logTest('Image Upload', false, error);
    return false;
  }
};

// Test product update
const testUpdateProduct = async () => {
  try {
    // Set auth header
    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    
    const updatedProduct = {
      ...testProduct,
      name: 'Updated Test Product',
      price: 1099
    };
    
    const response = await api.put(`/product-management/${productId}`, updatedProduct);
    
    if (response.data.success && response.data.product) {
      logTest('Product Update', true);
      return true;
    } else {
      logTest('Product Update', false, 'Invalid response format');
      return false;
    }
  } catch (error) {
    logTest('Product Update', false, error);
    return false;
  }
};

// Test product deletion
const testDeleteProduct = async () => {
  try {
    // Set auth header
    api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
    
    const response = await api.delete(`/product-management/${productId}`);
    
    if (response.data.success) {
      logTest('Product Deletion', true);
      return true;
    } else {
      logTest('Product Deletion', false, 'Invalid response format');
      return false;
    }
  } catch (error) {
    logTest('Product Deletion', false, error);
    return false;
  }
};

// Test user logout
const testLogout = async () => {
  try {
    const response = await api.post('/auth/logout');
    
    if (response.data.success) {
      logTest('User Logout', true);
      return true;
    } else {
      logTest('User Logout', false, 'Invalid response format');
      return false;
    }
  } catch (error) {
    logTest('User Logout', false, error);
    return false;
  }
};

// Test Netlify functions
const testNetlifyFunctions = async () => {
  try {
    const response = await netlifyApi.get('/api');
    
    if (response.data && response.data.status === 'ok') {
      logTest('Netlify Functions', true);
      return true;
    } else {
      logTest('Netlify Functions', false, 'Invalid response format');
      return false;
    }
  } catch (error) {
    logTest('Netlify Functions', false, error);
    return false;
  }
};

// Run all tests
const runTests = async () => {
  console.log('🧪 Starting API Tests...');
  console.log('=======================');
  
  // Test Netlify functions
  await testNetlifyFunctions();
  
  // Test user registration
  const registrationSuccess = await testRegistration();
  
  if (!registrationSuccess) {
    // Try login instead
    await testLogin();
  }
  
  // Test product creation
  await testCreateProduct();
  
  // Test product retrieval
  await testGetProducts();
  
  // Test product detail retrieval
  await testGetProductDetail();
  
  // Test ImageKit auth
  const authParams = await testImageKitAuth();
  
  if (authParams) {
    // Test image upload
    await testImageUpload(authParams);
  }
  
  // Test product update
  await testUpdateProduct();
  
  // Test product deletion
  await testDeleteProduct();
  
  // Test user logout
  await testLogout();
  
  console.log('=======================');
  console.log('🏁 API Tests Completed');
};

// Run the tests
runTests().catch(error => {
  console.error('Test runner error:', error);
});