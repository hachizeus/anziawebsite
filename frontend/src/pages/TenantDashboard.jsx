import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TenantDocumentUpload from '../components/tenant/TenantDocumentUpload';

const TenantDashboard = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('documents');

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Redirect if not tenant
  if (!user || user.role !== 'tenant') {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Tenant Dashboard</h1>
        
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b overflow-x-auto">
            <button
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === 'documents' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('documents')}
              data-tab="documents"
            >
              Documents
            </button>
            <button
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === 'payments' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('payments')}
              data-tab="payments"
            >
              Payments
            </button>
            <button
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === 'maintenance' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('maintenance')}
              data-tab="maintenance"
            >
              Maintenance
            </button>
          </div>
        </div>
        
        {activeTab === 'documents' && (
          <TenantDocumentUpload />
        )}
        
        {activeTab === 'payments' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Payments</h2>
            <p className="text-gray-500">Payment functionality coming soon.</p>
          </div>
        )}
        
        {activeTab === 'maintenance' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-6">Maintenance Requests</h2>
            <p className="text-gray-500">Maintenance request functionality coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantDashboard;

