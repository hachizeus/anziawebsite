import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * AdminAuthGuard - Prevents authenticated admin users from accessing login page
 */
const AdminAuthGuard = ({ children, redirectTo = '/dashboard' }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin');
    
    if (token && isAdmin === 'true') {
      navigate(redirectTo, { replace: true });
    }
  }, [navigate, redirectTo]);

  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin');
  
  // Don't render if user is already logged in
  if (token && isAdmin === 'true') {
    return null;
  }

  return children;
};

AdminAuthGuard.propTypes = {
  children: PropTypes.node.isRequired,
  redirectTo: PropTypes.string
};

export default AdminAuthGuard;