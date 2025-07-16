// Backend API URL
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

// Check if we're using Netlify functions
const isNetlify = window.location.hostname.includes('netlify.app');
const NETLIFY_FUNCTION_URL = '/.netlify/functions';

// Netlify API URL from environment variables
const NETLIFY_API_URL = import.meta.env.VITE_NETLIFY_API_URL || '/.netlify/functions/api';

// Use this as fallback when localhost backend is unavailable
const FALLBACK_URL = 'https://real-estate-backend-vybd.onrender.com';

console.log('Using API URL:', isNetlify ? NETLIFY_FUNCTION_URL : API_URL);

// ImageKit URL
const IMAGEKIT_URL = import.meta.env.VITE_IMAGEKIT_URL || 'https://ik.imagekit.io/q5jukn457';
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
    let url;
    if (isNetlify) {
      // On Netlify, use the Netlify Functions
      url = `${NETLIFY_API_URL}/products`;
      console.log('Using Netlify Functions for products');
    } else if (isLocalhost) {
      // On localhost, try local API first, then fallback
      const isLocalApiAvailable = await checkApiAvailability(API_URL);
      if (!isLocalApiAvailable) {
        console.log('Local API not available, using fallback API');
        url = `${FALLBACK_URL}/frontend/products`;
      } else {
        url = `${API_URL}/frontend/products`;
      }
    } else {
      // Default case
      url = `${API_URL}/frontend/products`;
    }
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
    
    // Add query parameters to URL
    url = `${url}${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
    
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
      url = `${NETLIFY_API_URL}/products/${id}`;
      console.log('Using Netlify Functions for product details');
    } else if (isLocalhost) {
      const isLocalApiAvailable = await checkApiAvailability(API_URL);
      if (!isLocalApiAvailable) {
        console.log('Local API not available, using fallback API');
        url = `${FALLBACK_URL}/frontend/products/${id}`;
      } else {
        url = `${API_URL}/frontend/products/${id}`;
      }
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
    let registerUrl;
    
    if (isNetlify) {
      registerUrl = `${NETLIFY_API_URL}/users/register`;
      console.log('Using Netlify Functions for registration');
    } else if (isLocalhost) {
      const isLocalApiAvailable = await checkApiAvailability(API_URL);
      if (!isLocalApiAvailable) {
        console.log('Local API not available, using fallback API for registration');
        registerUrl = `${FALLBACK_URL}/users/register`;
      } else {
        registerUrl = `${API_URL}/users/register`;
      }
    } else {
      registerUrl = `${API_URL}/users/register`;
    }
    
    console.log('Register URL:', registerUrl);
    
    const response = await fetch(registerUrl, {
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
    let loginUrl;
    
    if (isNetlify) {
      loginUrl = `${NETLIFY_API_URL}/users/login`;
      console.log('Using Netlify Functions for login');
    } else if (isLocalhost) {
      const isLocalApiAvailable = await checkApiAvailability(API_URL);
      if (!isLocalApiAvailable) {
        console.log('Local API not available, using fallback API for login');
        loginUrl = `${FALLBACK_URL}/users/login`;
      } else {
        loginUrl = `${API_URL}/users/login`;
      }
    } else {
      loginUrl = `${API_URL}/users/login`;
    }
    
    console.log('Login URL:', loginUrl);
    
    const response = await fetch(loginUrl, {
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
    let logoutUrl;
    
    if (isNetlify) {
      logoutUrl = `${NETLIFY_API_URL}/auth/logout`;
      console.log('Using Netlify Functions for logout');
    } else if (isLocalhost) {
      const isLocalApiAvailable = await checkApiAvailability(API_URL);
      if (!isLocalApiAvailable) {
        console.log('Local API not available, using fallback API for logout');
        logoutUrl = `${FALLBACK_URL}/auth/logout`;
      } else {
        logoutUrl = `${API_URL}/auth/logout`;
      }
    } else {
      logoutUrl = `${API_URL}/auth/logout`;
    }
    
    console.log('Logout URL:', logoutUrl);
    
    const response = await fetch(logoutUrl, {
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
    let imageKitUrl;
    
    if (isNetlify) {
      imageKitUrl = `${NETLIFY_API_URL}/imagekit/auth`;
      console.log('Using Netlify Functions for ImageKit auth');
    } else if (isLocalhost) {
      const isLocalApiAvailable = await checkApiAvailability(API_URL);
      if (!isLocalApiAvailable) {
        console.log('Local API not available, using fallback API for ImageKit auth');
        imageKitUrl = `${FALLBACK_URL}/imagekit/auth`;
      } else {
        imageKitUrl = `${API_URL}/imagekit/auth`;
      }
    } else {
      imageKitUrl = `${API_URL}/imagekit/auth`;
    }
    
    console.log('ImageKit Auth URL:', imageKitUrl);
    
    const response = await fetch(imageKitUrl, {
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