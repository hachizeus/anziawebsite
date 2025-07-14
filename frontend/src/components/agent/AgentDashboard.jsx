import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import AgentPropertyList from './AgentPropertyList';
import AgentPropertyForm from './AgentPropertyForm';
import AgentProfile from './AgentProfile';
import api from '../../utils/resilientApi';

const AgentDashboard = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('properties');
  const [agentProfile, setAgentProfile] = useState(null);
  const [agentProperties, setAgentProperties] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [loadingProperties, setLoadingProperties] = useState(true);

  useEffect(() => {
    if (user && user.role === 'agent') {
      fetchAgentProfile();
      fetchAgentProperties();
    }
  }, [user]);

  const fetchAgentProfile = async () => {
    setLoadingProfile(true);
    const response = await api.get('/api/agents/profile');
    
    if (response.data.success && response.data.agent) {
      setAgentProfile(response.data.agent);
    } else {
      // Set default profile
      setAgentProfile({
        _id: 'default',
        bio: '',
        phone: '',
        whatsapp: '',
        email: user?.email || '',
        currency: 'KSH',
        subscription: 'basic',
        active: true,
        visible: true,
        properties: []
      });
    }
    setLoadingProfile(false);
  };

  const fetchAgentProperties = async () => {
    setLoadingProperties(true);
    const response = await api.get('/api/agents/properties');
    
    if (response.data.success && response.data.properties) {
      setAgentProperties(response.data.properties);
      if (response.data.currency) {
        localStorage.setItem('agentCurrency', response.data.currency);
      }
    } else {
      // Set empty properties
      setAgentProperties([]);
      localStorage.setItem('agentCurrency', 'KSH');
    }
    setLoadingProperties(false);
  };

  const handlePropertyCreated = (newProperty) => {
    setAgentProperties([newProperty, ...agentProperties]);
    toast.success('Property created successfully');
    setActiveTab('properties');
  };

  const handlePropertyUpdated = (updatedProperty) => {
    setAgentProperties(
      agentProperties.map(property => 
        property._id === updatedProperty._id ? updatedProperty : property
      )
    );
    toast.success('Property updated successfully');
  };

  const handlePropertyDeleted = (propertyId) => {
    setAgentProperties(
      agentProperties.filter(property => property._id !== propertyId)
    );
    toast.success('Property deleted successfully');
  };

  const handleProfileUpdated = (updatedProfile) => {
    setAgentProfile(updatedProfile);
    toast.success('Profile updated successfully');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // Redirect if not agent
  if (!user || user.role !== 'agent') {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Agent Dashboard</h1>
        </div>
        
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b overflow-x-auto">
            <button
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === 'properties' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('properties')}
              data-tab="properties"
            >
              My Properties
            </button>
            <button
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === 'add' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('add')}
              data-tab="add"
            >
              Add Property
            </button>
            <button
              className={`px-6 py-3 font-medium whitespace-nowrap ${
                activeTab === 'profile' 
                  ? 'text-primary-600 border-b-2 border-primary-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('profile')}
              data-tab="profile"
            >
              My Profile
            </button>
          </div>
        </div>
        
        {activeTab === 'properties' && (
          <AgentPropertyList 
            properties={agentProperties} 
            loading={loadingProperties}
            onPropertyUpdated={handlePropertyUpdated}
            onPropertyDeleted={handlePropertyDeleted}
          />
        )}
        
        {activeTab === 'add' && (
          <AgentPropertyForm onPropertyCreated={handlePropertyCreated} />
        )}
        
        {activeTab === 'profile' && (
          <AgentProfile 
            profile={agentProfile} 
            loading={loadingProfile}
            onProfileUpdated={handleProfileUpdated}
          />
        )}
      </div>
    </div>
  );
};

export default AgentDashboard;

