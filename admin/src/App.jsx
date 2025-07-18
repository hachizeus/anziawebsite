import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "react-error-boundary";
import { motion, AnimatePresence } from "framer-motion";
import ScrollToTop from "./components/ScrollToTop";
import { useEffect } from "react";
import initSecurity from "./utils/initSecurity";
import initClientSecurity from "./utils/clientSecurity";
import initSecureReload from "./utils/secureReload";
import { SecurityProvider } from "./context/SecurityContext";
import SecureRoute from "./components/SecureRoute";

// Components
import Navbar from "./components/Navbar";
import Sidebar, { SidebarProvider, useSidebar } from "./components/Sidebar";
import MobileSidebarToggle from "./components/MobileSidebarToggle";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorFallback from "./components/ErrorFallback";

// Pages
import Login from "./components/login";
import Dashboard from "./pages/Dashboard";
import List from "./pages/List";
import Add from "./pages/Add";
import Update from "./pages/Update";
import ProductApproval from "./pages/ProductApproval";
import UserManagement from "./pages/UserManagement";
import Newsletter from "./pages/Newsletter";
import Orders from "./pages/Orders";

// Config
export const backendurl = import.meta.env.VITE_BACKEND_URL;

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// Main content wrapper that responds to sidebar state
const MainContent = ({ children }) => {
  const { expanded } = useSidebar();
  
  return (
    <div 
      className={`transition-all duration-300 ${
        expanded ? 'md:pl-64 pl-0' : 'md:pl-16 pl-0'
      } pt-16`}
    >
      <div className="w-full overflow-x-hidden px-0 md:px-0">
        {children}
      </div>
    </div>
  );
};

function App() {
  // Initialize security features
  useEffect(() => {
    initSecurity();
    initClientSecurity();
    initSecureReload();
  }, []);
  
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <SecurityProvider>
        <SidebarProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Sidebar />
          <MobileSidebarToggle />
          <ScrollToTop />
          
          <AnimatePresence mode="wait">
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={{ duration: 0.3 }}
            >
              <MainContent>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/" element={<Dashboard />} />

                  {/* Protected Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/list" element={<List />} />
                    <Route path="/add" element={<Add />} />
                    <Route path="/update/:id" element={<Update />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/users" element={<UserManagement/>} />
                    <Route path="/product-approval" element={<ProductApproval />} />
                    <Route path="/newsletter" element={<Newsletter />} />
                  </Route>

                  {/* 404 Route */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </MainContent>
            </motion.div>
          </AnimatePresence>

          {/* Toast Notifications */}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#333',
                color: '#fff',
              },
            }}
          />
        </div>
      </SidebarProvider>
      </SecurityProvider>
    </ErrorBoundary>
  );
}

export default App;