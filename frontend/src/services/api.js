// Backend API URL (using original electronics backend)
const API_URL = 'https://anzia-electronics-api.onrender.com/api';

// We're using the same backend URL for both local and Netlify
const isNetlify = window.location.hostname.includes('netlify.app');
const NETLIFY_API_URL = 'https://anzia-electronics-api.onrender.com/api';

// ImageKit URL
const IMAGEKIT_URL = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/q5jukn457';
console.log('Using ImageKit URL:', IMAGEKIT_URL);

// Check if we're in development mode on localhost
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Check if an API endpoint is available
const checkApiAvailability = async (url) => {
  try {
    const response = await fetch(`${url}/health`, { 
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      mode: 'cors',
      timeout: 3000 // 3 second timeout
    });
    return response.ok;
  } catch (error) {
    console.log('API availability check failed:', error);
    return false;
  }
};

// Get all products
export const getProducts = async (filters = {}) => {
  try {
    console.log('Fetching products from API...');
    
    // Determine which API endpoint to use
    let url = isNetlify ? NETLIFY_API_URL : API_URL;
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (filters.category && filters.category !== 'all') {
      queryParams.append('category', filters.category);
    }
    if (filters.search) {
      queryParams.append('search', filters.search);
    }
    if (filters.minPrice) {
      queryParams.append('minPrice', filters.minPrice);
    }
    if (filters.maxPrice) {
      queryParams.append('maxPrice', filters.maxPrice);
    }
    if (filters.sortBy) {
      queryParams.append('sortBy', filters.sortBy);
    }
    if (filters.page) {
      queryParams.append('page', filters.page);
    }
    if (filters.limit) {
      queryParams.append('limit', filters.limit);
    }
    
    // Add query parameters to URL
    const fullUrl = `${url}/products${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
    console.log('Fetching products from URL:', fullUrl);
    
    const response = await fetch(fullUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch products');
    }
    
    return { 
      success: true, 
      products: result.products,
      pagination: {
        page: result.page,
        pages: result.pages,
        total: result.total
      }
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { success: false, products: [], error: error.message };
  }
};

// Get product by ID
export const getProductById = async (id) => {
  try {
    console.log('Fetching product by ID:', id);
    
    // Determine which API endpoint to use
    let url = isNetlify ? NETLIFY_API_URL : API_URL;
    
    const response = await fetch(`${url}/products/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch product');
    }
    
    return { success: true, product: result.product };
  } catch (error) {
    console.error('Error fetching product:', error);
    return { success: false, product: null, error: error.message };
  }
};

// User authentication functions
export const registerUser = async (userData) => {
  try {
    // Determine which API endpoint to use
    let url = isNetlify ? NETLIFY_API_URL : API_URL;
    
    const response = await fetch(`${url}/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }
    
    const data = await response.json();
    
    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return { success: true, user: data.user, token: data.token };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    // Determine which API endpoint to use
    let url = isNetlify ? NETLIFY_API_URL : API_URL;
    
    const response = await fetch(`${url}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include' // Important for cookies
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Login failed');
    }
    
    const data = await response.json();
    
    // Store token in localStorage
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return { 
      success: true, 
      user: data.user, 
      token: data.token
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    // Determine which API endpoint to use
    let url = isNetlify ? NETLIFY_API_URL : API_URL;
    
    const response = await fetch(`${url}/auth/logout`, {
      method: 'POST',
      credentials: 'include' // Important for cookies
    });
    
    // Remove token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Logout failed');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    
    // Even if the API call fails, we still want to remove the token
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    throw error;
  }
};

// Get ImageKit authentication parameters for frontend uploads
export const getImageKitAuth = async () => {
  try {
    // Determine which API endpoint to use
    let url = isNetlify ? NETLIFY_API_URL : API_URL;
    
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${url}/imagekit/auth`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get ImageKit authentication');
    }
    
    const data = await response.json();
    return { success: true, authParams: data.authParams };
  } catch (error) {
    console.error('ImageKit auth error:', error);
    throw error;
  }
};

// Product management functions (admin only)
export const createProduct = async (productData) => {
  try {
    // Determine which API endpoint to use
    let url = isNetlify ? '/.netlify/functions/product-management' : '/api/product-management';
    
    const token = localStorage.getItem('token');
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create product');
    }
    
    const data = await response.json();
    return { success: true, product: data.product };
  } catch (error) {
    console.error('Create product error:', error);
    throw error;
  }
};

export const updateProduct = async (id, productData) => {
  try {
    // Determine which API endpoint to use
    let url = isNetlify ? '/.netlify/functions/product-management' : '/api/product-management';
    
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${url}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update product');
    }
    
    const data = await response.json();
    return { success: true, product: data.product };
  } catch (error) {
    console.error('Update product error:', error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    // Determine which API endpoint to use
    let url = isNetlify ? '/.netlify/functions/product-management' : '/api/product-management';
    
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${url}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete product');
    }
    
    const data = await response.json();
    return { success: true, message: data.message };
  } catch (error) {
    console.error('Delete product error:', error);
    throw error;
  }
};

export const uploadProductImage = async (id, imageFile) => {
  try {
    // Get ImageKit auth params
    const { authParams } = await getImageKitAuth();
    
    // Create form data
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('publicKey', authParams.publicKey);
    formData.append('signature', authParams.signature);
    formData.append('token', authParams.token);
    formData.append('expire', authParams.expire);
    formData.append('fileName', `product_${id}_${Date.now()}`);
    formData.append('folder', 'products');
    
    // Upload to ImageKit directly
    const response = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to upload image');
    }
    
    const data = await response.json();
    
    // Now update the product with the new image
    // Determine which API endpoint to use
    let url = isNetlify ? '/.netlify/functions/product-management' : '/api/product-management';
    
    const token = localStorage.getItem('token');
    
    const updateResponse = await fetch(`${url}/upload/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        image: data.url,
        fileName: data.name,
        fileId: data.fileId
      })
    });
    
    if (!updateResponse.ok) {
      const errorData = await updateResponse.json();
      throw new Error(errorData.message || 'Failed to update product with image');
    }
    
    const updateData = await updateResponse.json();
    return { success: true, image: updateData.image };
  } catch (error) {
    console.error('Upload product image error:', error);
    throw error;
  }
};