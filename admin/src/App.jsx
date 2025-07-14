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
import Appointments from "./pages/Appointments";
import PropertyDetail from "./pages/PropertyDetail";
import BlogRoutes from "./pages/Blog";

// Document Management
import DocumentList from "./pages/Documents/DocumentList";
import DocumentUpload from "./pages/Documents/DocumentUpload";
import DocumentView from "./pages/Documents/DocumentView";

// Tenant Management
import TenantList from "./pages/Tenants/TenantList";
import TenantForm from "./pages/Tenants/TenantForm";
import TenantDetail from "./pages/Tenants/TenantDetail";
import TenantPayment from "./pages/Tenants/TenantPayment";
import TenantDocuments from "./pages/Tenants/TenantDocuments";

// Advanced Business Tools
import DashboardOverview from "./pages/Analytics/DashboardOverview";
import FinancialAnalytics from "./pages/Financial/FinancialAnalytics";
import PropertyAnalytics from "./pages/Analytics/PropertyAnalytics";

import MaintenanceManagement from "./pages/Maintenance/MaintenanceManagement";
import PropertyApproval from "./pages/PropertyApproval";


// User Management
import UserManagement from "./pages/UserManagement";
import AgentManagement from "./pages/AgentManagement";
import AgentDetail from "./pages/AgentDetail";

// Newsletter Management
import Newsletter from "./pages/Newsletter";

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
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />

                  {/* Protected Routes */}
                  <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/list" element={<List />} />
                    <Route path="/property/:id" element={<PropertyDetail />} />
                    <Route path="/add" element={<Add />} />
                    <Route path="/update/:id" element={<Update />} />
                    <Route path="/appointments" element={<Appointments />} />
                    
                    {/* Document Management Routes */}
                    <Route path="/documents" element={<DocumentList />} />
                    <Route path="/documents/upload" element={<DocumentUpload />} />
                    <Route path="/documents/:id" element={<DocumentView />} />
                    
                    {/* Tenant Management Routes */}
                    <Route path="/tenants" element={<TenantList />} />
                    <Route path="/tenants/add" element={<TenantForm />} />
                    <Route path="/tenants/edit/:id" element={<TenantForm />} />
                    <Route path="/tenants/:id" element={<TenantDetail />} />
                    <Route path="/tenants/:id/payment" element={<TenantPayment />} />
                    <Route path="/tenants/:id/documents" element={<TenantDocuments />} />

                    {/* User Management Routes */}
                    <Route path="/users" element={<UserManagement/>} />
                    <Route path="/agents" element={<AgentManagement/>} />
                    <Route path="/agents/:id" element={<AgentDetail/>} />
                    
                    {/* Blog Management Routes */}
                    <Route path="/blogs/*" element={<BlogRoutes />} />
                    
                    {/* Advanced Business Tools Routes */}
                    <Route path="/analytics/dashboard" element={<DashboardOverview />} />
                    <Route path="/analytics/financial" element={<FinancialAnalytics />} />
                    <Route path="/analytics/properties" element={<PropertyAnalytics />} />
                    <Route path="/maintenance" element={<MaintenanceManagement />} />
                    <Route path="/property-approval" element={<PropertyApproval />} />
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