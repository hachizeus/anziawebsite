import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { testToken } from '../utils/tokenTest';

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Test token storage
    testToken();
    
    // Redirect if not logged in
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
  }, [isLoggedIn, navigate]);

  // Removed loading and error states

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">My Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Welcome back, {user?.name}!</h2>
          <p className="text-gray-600">Manage your account and view your activity here.</p>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-primary-50 p-4 rounded-lg">
              <h3 className="font-medium text-primary-800">Account Status</h3>
              <p className="text-primary-600">Active</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-800">Member Since</h3>
              <p className="text-green-600">{new Date(user?.createdAt).toLocaleDateString()}</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-800">Role</h3>
              <p className="text-blue-600 capitalize">{user?.role || 'User'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

