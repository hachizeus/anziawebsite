import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Deals from './pages/Deals';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import About from './pages/About';
import Admin from './pages/Admin';
import ProductDetail from './components/products/productdetail';
import UserDashboard from './components/UserDashboard';
// Customer Support route removed - using Contact page instead
import PropTypes from 'prop-types'; // Import prop-types

// Protected route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isLoggedIn, user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" />;
  }
  
  return children;
};

// Add prop-types validation
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
};

function App() {

  return (
    <AuthProvider>
      <Router>

        
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <Admin />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<div className="pt-20 text-center">Page not found</div>} />
          </Routes>
          <Footer />
        </>
      </Router>
    </AuthProvider>
  );
}

export default App;

