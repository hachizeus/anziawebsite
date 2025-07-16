// Backend API URL
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

// Check if we're using Netlify functions
const isNetlify = API_URL.includes('netlify') || window.location.hostname.includes('netlify.app');
const NETLIFY_FUNCTION_URL = isNetlify ? '/.netlify/functions' : null;

console.log('Using API URL:', isNetlify ? NETLIFY_FUNCTION_URL : API_URL);

// ImageKit URL
const IMAGEKIT_URL = import.meta.env.VITE_IMAGEKIT_URL || 'https://ik.imagekit.io/q5jukn457';
console.log('Using ImageKit URL:', IMAGEKIT_URL);

// Check if we're in development mode on localhost
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Get all products
export const getProducts = async (filters = {}) => {
  try {
    console.log('Fetching products from API...');
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
    
    // Fetch products from API
    let url;
    if (isNetlify) {
      url = `${NETLIFY_FUNCTION_URL}/products${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    } else {
      url = `${API_URL}/frontend/products${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    }
    console.log('Fetching products from URL:', url);
    const response = await fetch(url);
    console.log('API response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('API result:', result);
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch products');
    }
    
    let products = result.products || [];
    console.log('Products count:', products.length);
    
    // Log the first product to see its structure
    if (products.length > 0) {
      console.log('First product structure:', products[0]);
    }
    
    return { success: true, products };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { success: false, products: [], error: error.message };
  }
};

// Get product by ID
export const getProductById = async (id) => {
  try {
    console.log('Fetching product by ID:', id);
    let url;
    if (isNetlify) {
      url = `${NETLIFY_FUNCTION_URL}/products/${id}`;
    } else {
      url = `${API_URL}/frontend/products/${id}`;
    }
    console.log('Fetching product from URL:', url);
    const response = await fetch(url);
    console.log('API response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('API result:', result);
    
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
    const response = await fetch(`${API_URL}/users/register`, {
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
    return { success: true, user: data.user };
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/users/login`, {
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
    return { 
      success: true, 
      user: data.user, 
      token: data.token,
      session: { access_token: data.token } // Add this for compatibility
    };
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include' // Important for cookies
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Logout failed');
    }
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// Get ImageKit authentication parameters for frontend uploads
export const getImageKitAuth = async () => {
  try {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/imagekit/auth`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
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