-- Anzia Electronics Database Schema for Supabase
-- Run supabase-cleanup.sql FIRST, then run this file

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create products table
CREATE TABLE products (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    description TEXT,
    specifications TEXT,
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    availability VARCHAR(50) DEFAULT 'in-stock',
    condition VARCHAR(50) DEFAULT 'new',
    warranty VARCHAR(100),
    features JSONB DEFAULT '[]',
    images JSONB DEFAULT '[]',
    stock_quantity INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_profiles table (extends Supabase auth.users)
CREATE TABLE user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    shipping_address TEXT,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE order_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart table
CREATE TABLE cart (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, product_id)
);

-- Create reviews table
CREATE TABLE reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true);

-- Set up Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Products policies (public read, admin write)
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Products are insertable by authenticated users" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Products are updatable by authenticated users" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Products are deletable by authenticated users" ON products FOR DELETE USING (auth.role() = 'authenticated');

-- User profiles policies
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Orders policies
CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Order items policies
CREATE POLICY "Users can view own order items" ON order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

-- Cart policies
CREATE POLICY "Users can manage own cart" ON cart FOR ALL USING (auth.uid() = user_id);

-- Reviews policies
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);

-- Storage policies for product images
CREATE POLICY "Product images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Authenticated users can upload product images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_created_at ON products(created_at);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_cart_user_id ON cart(user_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample products
INSERT INTO products (name, brand, category, subcategory, description, price, availability, condition, features, images) VALUES
('Bosch Professional Drill GSB 13 RE', 'Bosch', 'Power Tools & Workshop Gear', 'Drills & Drivers', 'High-performance impact drill designed for professional use', 12000.00, 'in-stock', 'new', '["Corded", "13mm Chuck", "600W Motor", "Variable Speed"]', '[]'),
('Honda EU22i Generator', 'Honda', 'Generators & Power Equipment', 'Portable Generators', 'Quiet and fuel-efficient portable generator', 85000.00, 'in-stock', 'new', '["2200W Output", "Inverter Technology", "Eco-Throttle", "Parallel Capability"]', '[]'),
('Samsung 55" 4K Smart TV', 'Samsung', 'Electronics & Appliances', 'Audio & Video', 'Crystal clear 4K display with smart features', 65000.00, 'in-stock', 'new', '["4K UHD", "Smart TV", "HDR", "Voice Control"]', '[]'),
('Makita Angle Grinder', 'Makita', 'Power Tools & Workshop Gear', 'Grinders & Sanders', 'Professional 125mm angle grinder with high performance', 8500.00, 'in-stock', 'new', '["125mm Disc", "840W Motor", "Anti-restart Protection", "Tool-less Guard"]', '[]'),
('Yamaha EF2000iS Generator', 'Yamaha', 'Generators & Power Equipment', 'Portable Generators', 'Super quiet inverter generator perfect for camping', 75000.00, 'in-stock', 'new', '["2000W Output", "Inverter Technology", "Super Quiet", "Fuel Efficient"]', '[]');