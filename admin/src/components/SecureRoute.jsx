import { Navigate, Outlet } from 'react-router-dom';
import { useSecurity } from '../context/SecurityContext';

// Secure route component that requires authentication
const SecureRoute = ({ requiredPermission }) => {
  const { isAuthenticated, hasPermission, loading } = useSecurity();
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-[#2563EB] border-gray-200 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying security credentials...</p>
        </div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Check for required permission if specified
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
          </div>
          <h2 className="mb-2 text-xl font-semibold text-center text-gray-800">Access Denied</h2>
          <p className="text-center text-gray-600">
            You don't have permission to access this resource.
          </p>
        </div>
      </div>
    );
  }
  
  // Render child routes if authenticated and authorized
  return <Outlet />;
};

export default SecureRoute;