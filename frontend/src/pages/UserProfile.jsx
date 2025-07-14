import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import UserDashboard from '../components/UserDashboard';

const UserProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-gray-500">Please log in to view your profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center text-white text-2xl font-bold">
              {user && user.name ? user.name[0].toUpperCase() : 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{user && user.name ? user.name : 'User'}</h1>
              <p className="text-gray-600">{user && user.email ? user.email : 'No email available'}</p>
              <p className="text-sm mt-1 inline-block px-2 py-1 bg-primary-100 text-primary-700 rounded-full">
                {user && user.role ? (user.role === 'admin' ? 'Administrator' : user.role === 'tenant' ? 'Tenant' : 'User') : 'User'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b overflow-x-auto">
            <button
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === 'dashboard' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === 'settings' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </div>
        </div>

        {activeTab === 'dashboard' && <UserDashboard />}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            <p className="text-gray-500 text-center py-8">
              Account settings functionality will be implemented soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;

