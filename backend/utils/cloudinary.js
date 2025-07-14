import { supabaseAdmin } from '../config/supabase.js';

// Upload file to Supabase Storage
export const uploadToSupabase = async (fileBuffer, fileName) => {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from('product-images')
      .upload(fileName, fileBuffer, {
        contentType: 'image/jpeg'
      });
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('product-images')
      .getPublicUrl(fileName);
    
    return {
      public_id: data.path,
      secure_url: publicUrl
    };
  } catch (error) {
    console.error('Error uploading to Supabase:', error);
    throw new Error('Failed to upload image');
  }
};

// Legacy export for compatibility
export const uploadToCloudinary = uploadToSupabase;

// For development/mock mode, return a placeholder image
export const getMockImageUrl = () => {
  return 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3';
};
