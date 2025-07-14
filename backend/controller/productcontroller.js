import { supabase, supabaseAdmin } from '../config/supabase.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sortBy, featured } = req.query;
    
    let query = supabase.from('products').select('*');

    // Category filter
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    // Search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,brand.ilike.%${search}%,category.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Price filter
    if (minPrice) {
      query = query.gte('price', parseInt(minPrice));
    }
    if (maxPrice) {
      query = query.lte('price', parseInt(maxPrice));
    }

    // Featured filter
    if (featured === 'true') {
      query = query.not('original_price', 'is', null);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        query = query.order('price', { ascending: true });
        break;
      case 'price-high':
        query = query.order('price', { ascending: false });
        break;
      case 'name':
        query = query.order('name', { ascending: true });
        break;
      case 'rating':
        query = query.order('rating', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    const { data: products, error } = await query;
    
    if (error) throw error;
    
    res.json({
      success: true,
      products: products || []
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products'
    });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error || !product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product'
    });
  }
};

// Add new product
export const addProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      price: parseFloat(req.body.price),
      original_price: req.body.originalPrice ? parseFloat(req.body.originalPrice) : null,
      stock_quantity: parseInt(req.body.stockQuantity) || 0,
      features: req.body.features ? req.body.features.split(',').map(f => f.trim()) : []
    };

    // Handle image uploads
    const imageUrls = [];
    if (req.files) {
      for (let i = 1; i <= 4; i++) {
        const file = req.files[`image${i}`];
        if (file && file[0]) {
          const fileName = `${Date.now()}-${file[0].originalname}`;
          const { data, error } = await supabaseAdmin.storage
            .from('product-images')
            .upload(fileName, file[0].buffer, {
              contentType: file[0].mimetype
            });
          
          if (!error) {
            const { data: { publicUrl } } = supabaseAdmin.storage
              .from('product-images')
              .getPublicUrl(fileName);
            imageUrls.push(publicUrl);
          }
        }
      }
    }

    if (imageUrls.length > 0) {
      productData.images = imageUrls;
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();
    
    if (error) throw error;
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product'
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
      price: parseFloat(req.body.price),
      original_price: req.body.originalPrice ? parseFloat(req.body.originalPrice) : null,
      stock_quantity: parseInt(req.body.stockQuantity) || 0,
      features: req.body.features ? req.body.features.split(',').map(f => f.trim()) : []
    };

    const { data: product, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product'
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id);
    
    if (error) throw error;
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product'
    });
  }
};

// Legacy exports for compatibility
export const createProduct = addProduct;
export const getAvailableProducts = getAllProducts;
export const getFeaturedProducts = getAllProducts;
export const getProductsByCategory = getAllProducts;
export const toggleProductAvailability = updateProduct;
