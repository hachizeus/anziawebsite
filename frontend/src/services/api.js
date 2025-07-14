import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://kasdvsdakhvfgynmjcxi.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthc2R2c2Rha2h2Zmd5bm1qY3hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NzcxOTAsImV4cCI6MjA2ODA1MzE5MH0.OKqPtJnqh_v_M5-ImU2Ag9ovYJqS4l3o4DcVJk-Jv60';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Backend API URL
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

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

// User authentication functions
export const registerUser = async (userData) => {
  const { data, error } = await supabase.auth.signUp({
    email: userData.email,
    password: userData.password,
    options: {
      data: {
        name: userData.name
      }
    }
  });
  
  if (error) throw error;
  return { success: true, user: data.user };
};

export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  return { success: true, user: data.user, session: data.session };
};

export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return { success: true };
};

