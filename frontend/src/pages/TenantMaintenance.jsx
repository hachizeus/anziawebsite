import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MaintenanceRequestList from '../components/tenant/MaintenanceRequestList';
import MaintenanceRequestForm from '../components/tenant/MaintenanceRequestForm';
import MaintenanceRequestDetail from '../components/tenant/MaintenanceRequestDetail';

const TenantMaintenance = () => {
  const { user } = useAuth();
  
  // Check if user is a tenant
  if (!user || user.role !== 'tenant') {
    return <Navigate to="/login" />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Routes>
        <Route path="/" element={<MaintenanceRequestList />} />
        <Route path="/new" element={<MaintenanceRequestForm />} />
        <Route path="/:requestId" element={<MaintenanceRequestDetail />} />
      </Routes>
    </div>
  );
};

export default TenantMaintenance;

