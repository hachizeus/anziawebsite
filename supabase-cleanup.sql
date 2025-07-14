-- Supabase Database Cleanup Script
-- Run this FIRST to clean up all existing tables, policies, triggers, and buckets

-- Drop all tables with CASCADE to remove dependencies
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS cart CASCADE;
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS products CASCADE;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Clean up storage
DELETE FROM storage.objects WHERE bucket_id = 'product-images';
DELETE FROM storage.buckets WHERE id = 'product-images';

-- Success message
SELECT 'Database cleanup completed successfully' as status;