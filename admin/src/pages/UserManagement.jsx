import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { UserPlus, Check, X, Eye, EyeOff } from 'lucide-react';
import { backendurl } from '../App';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [agents, setAgents] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }

        // Use the backendurl from App.jsx
        const apiUrl = backendurl;
        
        // Fetch users, tenants, agents, and properties in parallel
        const [usersResponse, tenantsResponse, agentsResponse, propertiesResponse] = await Promise.all([
          axios.get(`${apiUrl}/api/admin/users`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${apiUrl}/api/tenants`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${apiUrl}/api/agents/all`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${apiUrl}/api/products/list`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (usersResponse.data.success) {
          setUsers(usersResponse.data.users || []);
        }
        
        if (tenantsResponse.data.success) {
          setTenants(tenantsResponse.data.tenants || []);
        }
        
        if (agentsResponse.data.success) {
          setAgents(agentsResponse.data.agents || []);
        }
        
        if (propertiesResponse.data && propertiesResponse.data.property) {
          setProperties(propertiesResponse.data.property || []);
        }
        
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error loading data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    if (newRole === 'tenant') {
      // For tenant role, show property selection modal
      const user = users.find(u => u._id === userId);
      setSelectedUser(user);
      setShowModal(true);
    } else {
      // For other roles, proceed directly
      await updateUserRole(userId, newRole);
    }
  };

  const updateUserRole = async (userId, newRole, propertyId = null) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading(
        newRole === 'tenant' 
          ? 'Setting user as tenant and creating tenant record...' 
          : `Updating user role to ${newRole}...`
      );
      
      const apiUrl = backendurl;
      const response = await axios.put(`${apiUrl}/api/admin/users/role`, 
        { userId, role: newRole, propertyId },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (response.data.success) {
        // Update the user in the local state
        setUsers(users.map(user => 
          user._id === userId ? { ...user, role: newRole } : user
        ));
        
        if (newRole === 'tenant') {
          toast.success('User role updated to tenant and tenant record created');
          
          // Refresh tenant list
          const tenantsResponse = await axios.get(`${apiUrl}/api/tenants`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (tenantsResponse.data.success) {
            setTenants(tenantsResponse.data.tenants || []);
          }
          
          // Refresh properties list
          const propertiesResponse = await axios.get(`${apiUrl}/api/products/list`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (propertiesResponse.data && propertiesResponse.data.property) {
            setProperties(propertiesResponse.data.property || []);
          }
        } else {
          toast.success(`User role updated to ${newRole}`);
          
          // If changing from tenant to user, refresh tenant list
          if (users.find(u => u._id === userId)?.role === 'tenant') {
            const tenantsResponse = await axios.get(`${apiUrl}/api/tenants`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            if (tenantsResponse.data.success) {
              setTenants(tenantsResponse.data.tenants || []);
            }
          }
        }
      } else {
        toast.error('Failed to update user role');
      }
    } catch (err) {
      console.error('Error updating user role:', err);
      toast.error('Error updating user role');
    }
  };

  const handleDeleteTenant = async (id) => {
    if (!window.confirm('Are you sure you want to delete this tenant? This will also revert the user role to regular user.')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }
      
      await axios.delete(`${backendurl}/api/tenants/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setTenants(tenants.filter(tenant => tenant._id !== id));
      
      // Update user role in users list
      const tenant = tenants.find(t => t._id === id);
      if (tenant && tenant.userId) {
        setUsers(users.map(user => 
          user._id === tenant.userId._id ? { ...user, role: 'user' } : user
        ));
      }
      
      toast.success('Tenant deleted successfully');
    } catch (err) {
      console.error('Error deleting tenant:', err);
      toast.error('Failed to delete tenant');
    }
  };

  const handleToggleVisibility = async (agentId, currentVisibility) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }
      
      const response = await axios.put(
        `${backendurl}/api/agents/toggle-visibility`,
        { agentId },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      if (response.data.success) {
        // Update agent in the state
        setAgents(agents.map(agent => 
          agent._id === agentId ? { ...agent, visible: !currentVisibility } : agent
        ));
        
        toast.success(`Agent ${currentVisibility ? 'hidden' : 'visible'} successfully`);
      }
    } catch (err) {
      console.error('Error toggling agent visibility:', err);
      toast.error('Failed to update agent visibility');
    }
  };

  const handleConfirmTenant = () => {
    if (!selectedUser || !selectedProperty) {
      toast.error('Please select a property');
      return;
    }
    
    updateUserRole(selectedUser._id, 'tenant', selectedProperty);
    setShowModal(false);
    setSelectedUser(null);
    setSelectedProperty('');
  };

  const filteredUsers = users.filter(user => 
    (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredTenants = tenants.filter(tenant => 
    (tenant.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    tenant.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.propertyId?.title?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredAgents = agents.filter(agent => 
    (agent.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    agent.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">User, Tenant & Agent Management</h1>
      
      {/* Tabs */}
      <div className="flex border-b mb-6">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'users' 
            ? 'text-blue-600 border-b-2 border-blue-600' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'tenants' 
            ? 'text-blue-600 border-b-2 border-blue-600' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('tenants')}
        >
          Tenants
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'agents' 
            ? 'text-blue-600 border-b-2 border-blue-600' 
            : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('agents')}
        >
          Agents
        </button>
      </div>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-full md:w-1/3 px-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {activeTab === 'users' ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'tenant' ? 'bg-green-100 text-green-800' :
                          user.role === 'agent' ? 'bg-blue-100 text-blue-800' :
                          user.role === 'user' ? 'bg-gray-100 text-gray-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role || 'No Role'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {user.role !== 'admin' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleRoleChange(user._id, 'user')}
                              className={`px-3 py-1 text-xs rounded ${
                                user.role === 'user' 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              User
                            </button>
                            <button
                              onClick={() => handleRoleChange(user._id, 'tenant')}
                              className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${
                                user.role === 'tenant' 
                                  ? 'bg-green-600 text-white' 
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              <UserPlus size={12} />
                              Tenant
                            </button>
                            <button
                              onClick={() => handleRoleChange(user._id, 'agent')}
                              className={`px-3 py-1 text-xs rounded flex items-center gap-1 ${
                                user.role === 'agent' 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              <UserPlus size={12} />
                              Agent
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'tenants' ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-medium">Tenant List</h2>
            <Link
              to="/tenants/add"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center gap-2"
            >
              <UserPlus size={16} />
              Add New Tenant
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tenant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lease Period
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rent
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTenants.length > 0 ? (
                  filteredTenants.map((tenant) => (
                    <tr key={tenant._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{tenant.userId?.name || 'Unknown'}</div>
                            <div className="text-sm text-gray-500">{tenant.userId?.email || 'No email'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{tenant.propertyId?.title || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{tenant.propertyId?.location || 'No location'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {tenant.leaseStart ? new Date(tenant.leaseStart).toLocaleDateString() : 'N/A'} - 
                          {tenant.leaseEnd ? new Date(tenant.leaseEnd).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        KSh {typeof tenant.rentAmount === 'number' ? tenant.rentAmount.toLocaleString('en-KE') : tenant.rentAmount || 0}/month
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            to={`/tenants/${tenant._id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </Link>
                          <Link
                            to={`/tenants/edit/${tenant._id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDeleteTenant(tenant._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      No tenants found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-medium">Agent List</h2>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center gap-2"
            >
              <UserPlus size={16} />
              Add New Agent
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agent
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subscription
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Properties
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAgents.length > 0 ? (
                  filteredAgents.map((agent) => (
                    <tr key={agent._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white font-medium">
                            {agent.userId?.name ? agent.userId.name[0].toUpperCase() : "A"}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{agent.userId?.name || 'Unknown'}</div>
                            <div className="text-xs text-gray-500">Since {new Date(agent.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{agent.userId?.email || agent.email || 'No email'}</div>
                        <div className="text-sm text-gray-500">{agent.phone || 'No phone'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">{agent.subscription || 'Basic'}</div>
                        <div className="text-xs text-gray-500">
                          Expires: {new Date(agent.subscriptionExpiry).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {agent.properties?.length || 0} properties
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${agent.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {agent.active ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${agent.visible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {agent.visible ? 'Visible' : 'Hidden'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleToggleVisibility(agent._id, agent.visible)}
                            className={`p-2 rounded-full ${agent.visible ? 'text-green-600 hover:bg-green-50' : 'text-gray-600 hover:bg-gray-50'}`}
                            title={agent.visible ? 'Hide agent' : 'Show agent'}
                          >
                            {agent.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                          </button>
                          <Link
                            to={`/agents/${agent._id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                      No agents found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Property Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Assign Property to Tenant</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            <p className="mb-4">
              Assigning <span className="font-medium">{selectedUser?.name}</span> as a tenant.
              Please select a property:
            </p>
            
            <select
              value={selectedProperty}
              onChange={(e) => setSelectedProperty(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-4"
            >
              <option value="">Select a property</option>
              {properties.map((property) => (
                <option key={property._id} value={property._id}>
                  {property.title} - {property.location}
                  {property.availability !== 'available' ? ' (Currently Occupied)' : ''}
                </option>
              ))}
            </select>
            
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmTenant}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                disabled={!selectedProperty}
              >
                <Check size={16} />
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;