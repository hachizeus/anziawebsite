import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin');

  // Check both token and admin status - NO EXPIRATION CHECK
  const isAuthenticated = token && isAdmin === 'true';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Return Outlet for nested routes
  return <Outlet />;
};

export default ProtectedRoute;