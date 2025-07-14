import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    // If user is admin, redirect to the admin workspace
    if (user && user.role === 'admin') {
      window.location.href = '/admin';
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <p className="text-lg mb-4">Redirecting to admin workspace...</p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

