const axios = require('axios');

const API_URL = 'https://anzia-electronics-api.onrender.com/api';

// Test data
const testUser = {
  name: 'Test User',
  email: 'testuser@example.com',
  password: 'password123',
  phone: '+254 769 162665',
  address: {
    street: '123 Test Street',
    city: 'Nairobi',
    state: 'Nairobi',
    zipCode: '00100',
    country: 'Kenya'
  }
};

let userId = null;
let productId = null;

async function runTests() {
  console.log('🚀 Starting User Functionality Tests...\n');

  try {
    // Test 1: Register User
    console.log('1. Testing User Registration...');
    const registerResponse = await axios.post(`${API_URL}/users/register`, {
      name: testUser.name,
      email: testUser.email,
      password: testUser.password
    });
    
    if (registerResponse.data.success) {
      userId = registerResponse.data.user._id;
      console.log('✅ User registered successfully');
      console.log(`   User ID: ${userId}`);
    } else {
      console.log('❌ User registration failed');
      return;
    }

    // Test 2: Update Profile
    console.log('\n2. Testing Profile Update...');
    const profileUpdateResponse = await axios.put(`${API_URL}/users/profile/${userId}`, {
      phone: testUser.phone,
      address: testUser.address
    });
    
    if (profileUpdateResponse.data.success) {
      console.log('✅ Profile updated successfully');
    } else {
      console.log('❌ Profile update failed');
    }

    // Test 3: Get a product for wishlist/order testing
    console.log('\n3. Getting a product for testing...');
    const productsResponse = await axios.get(`${API_URL}/products/list`);
    
    if (productsResponse.data.success && productsResponse.data.products.length > 0) {
      productId = productsResponse.data.products[0]._id;
      console.log('✅ Product found for testing');
      console.log(`   Product ID: ${productId}`);
    } else {
      console.log('❌ No products found for testing');
      return;
    }

    // Test 4: Add to Wishlist
    console.log('\n4. Testing Add to Wishlist...');
    const wishlistAddResponse = await axios.post(`${API_URL}/wishlist/add`, {
      userId: userId,
      productId: productId
    });
    
    if (wishlistAddResponse.data.success) {
      console.log('✅ Product added to wishlist successfully');
    } else {
      console.log('❌ Failed to add product to wishlist');
    }

    // Test 5: Get Wishlist
    console.log('\n5. Testing Get Wishlist...');
    const wishlistResponse = await axios.get(`${API_URL}/wishlist/${userId}`);
    
    if (wishlistResponse.data.success) {
      console.log('✅ Wishlist retrieved successfully');
      console.log(`   Wishlist items: ${wishlistResponse.data.wishlist.length}`);
    } else {
      console.log('❌ Failed to get wishlist');
    }

    // Test 6: Create Order
    console.log('\n6. Testing Order Creation...');
    const orderData = {
      userId: userId,
      items: [{
        productId: productId,
        quantity: 2,
        price: 15000
      }],
      totalAmount: 30000,
      shippingAddress: testUser.address,
      paymentMethod: 'cash'
    };

    const orderResponse = await axios.post(`${API_URL}/orders/create`, orderData);
    
    if (orderResponse.data.success) {
      console.log('✅ Order created successfully');
      console.log(`   Order ID: ${orderResponse.data.order._id}`);
    } else {
      console.log('❌ Failed to create order');
    }

    // Test 7: Get User Orders
    console.log('\n7. Testing Get User Orders...');
    const userOrdersResponse = await axios.get(`${API_URL}/orders/user/${userId}`);
    
    if (userOrdersResponse.data.success) {
      console.log('✅ User orders retrieved successfully');
      console.log(`   Number of orders: ${userOrdersResponse.data.orders.length}`);
    } else {
      console.log('❌ Failed to get user orders');
    }

    // Test 8: Get Admin Orders
    console.log('\n8. Testing Get Admin Orders...');
    const adminOrdersResponse = await axios.get(`${API_URL}/orders/admin`);
    
    if (adminOrdersResponse.data.success) {
      console.log('✅ Admin orders retrieved successfully');
      console.log(`   Total orders: ${adminOrdersResponse.data.orders.length}`);
    } else {
      console.log('❌ Failed to get admin orders');
    }

    // Test 9: Remove from Wishlist
    console.log('\n9. Testing Remove from Wishlist...');
    const wishlistRemoveResponse = await axios.delete(`${API_URL}/wishlist/remove`, {
      data: {
        userId: userId,
        productId: productId
      }
    });
    
    if (wishlistRemoveResponse.data.success) {
      console.log('✅ Product removed from wishlist successfully');
    } else {
      console.log('❌ Failed to remove product from wishlist');
    }

    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.response?.data || error.message);
  }
}

// Run the tests
runTests();