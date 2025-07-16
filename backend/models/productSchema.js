/**
 * MongoDB Product Schema Definition
 * 
 * This file defines the structure of product documents in MongoDB.
 * While MongoDB is schema-less, this serves as documentation and validation reference.
 */

const productSchema = {
  name: String,                 // Product name
  description: String,          // Product description
  price: Number,                // Current price
  original_price: Number,       // Original price (for discounts)
  category: String,             // Product category
  brand: String,                // Product brand
  stock_quantity: Number,       // Available stock
  availability: String,         // "in-stock" or "out-of-stock"
  features: Array,              // Array of product features
  images: Array,                // Array of image URLs (stored in ImageKit)
  rating: Number,               // Product rating (1-5)
  reviews_count: Number,        // Number of reviews
  specifications: Object,       // Technical specifications as key-value pairs
  created_at: Date,             // Creation timestamp
  updated_at: Date              // Last update timestamp
};

export default productSchema;

/**
 * Example product document:
 * 
 * {
 *   _id: ObjectId("..."),
 *   name: "Smartphone XYZ",
 *   description: "Latest smartphone with advanced features",
 *   price: 599.99,
 *   original_price: 699.99,
 *   category: "Electronics",
 *   brand: "BrandName",
 *   stock_quantity: 50,
 *   availability: "in-stock",
 *   features: ["5G", "Water resistant", "48MP camera"],
 *   images: [
 *     "https://ik.imagekit.io/q5jukn457/product-images/smartphone-front.jpg",
 *     "https://ik.imagekit.io/q5jukn457/product-images/smartphone-back.jpg"
 *   ],
 *   rating: 4.5,
 *   reviews_count: 120,
 *   specifications: {
 *     "screen": "6.5 inch OLED",
 *     "processor": "Octa-core 2.8GHz",
 *     "ram": "8GB",
 *     "storage": "128GB"
 *   },
 *   created_at: ISODate("2023-01-15T10:30:00Z"),
 *   updated_at: ISODate("2023-02-20T14:15:00Z")
 * }
 */