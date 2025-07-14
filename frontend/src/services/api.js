import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const supabaseUrl = 'https://kasdvsdakhvfgynmjcxi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthc2R2c2Rha2h2Zmd5bm1qY3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NzcxOTAsImV4cCI6MjA2ODA1MzE5MH0.OKqPtJnqh_v_M5-ImU2Ag9ovYJqS4l3o4DcVJk-Jv60';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fallback API for backend routes
const API_URL = 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 30000,
  withCredentials: false
});

// Retry functionality disabled - using localhost only

// Add a request interceptor to include token from localStorage
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor with simple error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

// Direct Supabase operations
export const getProducts = async (filters = {}) => {
  try {
    let query = supabase.from('products').select('*');
    
    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }
    
    if (filters.search) {
      query = query.or(`name.ilike.%${filters.search}%,brand.ilike.%${filters.search}%`);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, products: data || [] };
  } catch (error) {
    console.error('Error fetching products:', error);
    return { success: false, products: [] };
  }
};

export const getProductById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { success: true, product: data };
  } catch (error) {
    console.error('Error fetching product:', error);
    return { success: false, product: null };
  }
};

export default api;

