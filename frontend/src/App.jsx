import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/footer';
import ErrorBoundary from './components/common/ErrorBoundary';
// Removed BackendSwitcher and ApiHealthCheck for production
import PropTypes from 'prop-types';
import { initLazyLoading } from './utils/lazyLoadImages';

// Lazy load components for better performance
const Home = lazy(() => import('./pages/Home'));
const Products = lazy(() => import('./pages/Products'));
// Categories page removed
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Cart = lazy(() => import('./pages/Cart'));
// Checkout removed - using WhatsApp orders
const Contact = lazy(() => import('./pages/Contact'));
const About = lazy(() => import('./pages/About'));
const Help = lazy(() => import('./pages/Help'));
const Admin = lazy(() => import('./pages/Admin'));
const ProductDetail = lazy(() => import('./components/products/productdetail'));
const UserDashboard = lazy(() => import('./components/UserDashboard'));

// Protected route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isLoggedIn, user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <img 
            src="/images/logo.svg" 
            alt="Anzia Electronics" 
            className="w-20 h-20 mb-4"
          />
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
        </div>
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

// Loading component for suspense fallback
const LoadingFallback = () => (
  <div className="min-h-screen flex justify-center items-center bg-white dark:bg-gray-900">
    <div className="flex flex-col items-center">
      <img 
        src="/images/logo.svg" 
        alt="Anzia Electronics" 
        className="w-20 h-20 mb-4"
      />
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  </div>
);

// 404 Page component
const NotFound = () => (
  <div className="min-h-screen pt-20 flex items-center justify-center bg-white dark:bg-gray-900">
    <div className="text-center p-8 max-w-md">
      <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8">The page you are looking for doesn't exist or has been moved.</p>
      <a href="/" className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors">
        Go to Homepage
      </a>
    </div>
  </div>
);

function App() {
  useEffect(() => {
    // Initialize lazy loading for images
    initLazyLoading();
    
    // Don't override CSP headers - they're already set in index.html
    // Keep the existing CSP from index.html
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <ThemeProvider>
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
              <Navbar />
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                {/* Categories route removed */}
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/cart" element={<Cart />} />
                {/* Checkout removed - using WhatsApp orders */}
                <Route path="/contact" element={<Contact />} />
                <Route path="/about" element={<About />} />
                <Route path="/help" element={<Help />} />
                
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
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            <Footer />
            <Toaster position="top-right" />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
