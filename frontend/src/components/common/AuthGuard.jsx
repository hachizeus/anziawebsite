import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PropTypes from 'prop-types';

/**
 * AuthGuard - Prevents authenticated users from accessing auth pages
 */
const AuthGuard = ({ children, redirectTo = '/', reverse = false }) => {
  const { isLoggedIn, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (reverse) {
        // For protected routes - redirect to login if not authenticated
        if (!isLoggedIn) {
          navigate('/login', { replace: true });
        }
      } else {
        // For auth pages - redirect to home if already authenticated
        if (isLoggedIn) {
          navigate(redirectTo, { replace: true });
        }
      }
    }
  }, [isLoggedIn, loading, navigate, redirectTo, reverse]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // For auth pages, don't render if user is logged in
  if (!reverse && isLoggedIn) {
    return null;
  }

  // For protected routes, don't render if user is not logged in
  if (reverse && !isLoggedIn) {
    return null;
  }

  return children;
};

AuthGuard.propTypes = {
  children: PropTypes.node.isRequired,
  redirectTo: PropTypes.string,
  reverse: PropTypes.bool
};

export default AuthGuard;