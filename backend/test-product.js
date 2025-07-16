import { connectToDatabase, getCollection, closeConnection } from './config/mongodb.js';
import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Test product data
const testProduct = {
  name: "Test Drill Machine",
  brand: "TestBrand",
  model: "TDM-2000",
  category: "Power Tools & Workshop Gear",
  subcategory: "Drills & Drivers",
  price: 12999,
  description: "A powerful test drill for testing purposes",
  specifications: "Power: 800W, Speed: 3000RPM",
  availability: "in-stock",
  condition: "new",
  warranty: "1 year",
  features: ["Cordless", "Variable Speed", "LED Light"],
  stock_quantity: 10
};

// Function to add a test product
async function addTestProduct() {
  console.log('Adding test product to database...');
  
  try {
    await connectToDatabase();
    const productsCollection = await getCollection('products');
    
    const productData = {
      ...testProduct,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const result = await productsCollection.insertOne(productData);
    
    if (!result.acknowledged) {
      console.error('Error adding product: Insert not acknowledged');
      return null;
    }
    
    const insertedProduct = await productsCollection.findOne({ _id: result.insertedId });
    console.log('Product added successfully:', insertedProduct);
    return insertedProduct;
  } catch (err) {
    console.error('Exception occurred:', err);
    return null;
  }
}

// Function to fetch a product by ID
async function fetchProduct(id) {
  console.log(`Fetching product with ID: ${id}`);
  
  try {
    const productsCollection = await getCollection('products');
    
    let productId;
    try {
      productId = new ObjectId(id);
    } catch (error) {
      console.error('Invalid product ID format');
      return null;
    }
    
    const product = await productsCollection.findOne({ _id: productId });
    
    if (!product) {
      console.error('Product not found');
      return null;
    }
    
    console.log('Product fetched successfully:', product);
    return product;
  } catch (err) {
    console.error('Exception occurred:', err);
    return null;
  }
}

// Function to fetch all products
async function fetchAllProducts() {
  console.log('Fetching all products...');
  
  try {
    const productsCollection = await getCollection('products');
    
    const products = await productsCollection.find({}).toArray();
    
    console.log(`Found ${products.length} products`);
    return products;
  } catch (err) {
    console.error('Exception occurred:', err);
    return [];
  }
}

// Main function to run the tests
async function runTests() {
  console.log('Starting product functionality test...');
  
  try {
    // Add a test product
    const addedProduct = await addTestProduct();
    
    if (addedProduct) {
      // Fetch the product by ID
      await fetchProduct(addedProduct._id);
      
      // Fetch all products
      const allProducts = await fetchAllProducts();
      console.log('All product names:', allProducts.map(p => p.name));
    }
    
    console.log('Test completed');
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    // Close MongoDB connection
    await closeConnection();
  }
}

// Run the tests
runTests().catch(console.error);