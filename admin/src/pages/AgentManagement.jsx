import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { UserPlus, Check, X, Eye, EyeOff } from 'lucide-react';
import { backendurl } from '../App';

const AgentManagement = () => {
  const [users, setUsers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedSubscription, setSelectedSubscription] = useState('basic');
  const [showModal, setShowModal] = useState(false);

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
        
        // Fetch users and agents in parallel
        const [usersResponse, agentsResponse] = await Promise.all([
          axios.get(`${apiUrl}/api/admin/users`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${apiUrl}/api/agents/all`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        if (usersResponse.data.success) {
          setUsers(usersResponse.data.users || []);
        }
        
        if (agentsResponse.data.success) {
          setAgents(agentsResponse.data.agents || []);
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
    if (newRole === 'agent') {
      // For agent role, show subscription selection modal
      const user = users.find(u => u._id === userId);
      setSelectedUser(user);
      setShowModal(true);
    } else {
      // For other roles, proceed directly
      await updateUserRole(userId, newRole);
    }
  };

  const updateUserRole = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading(
        newRole === 'agent' 
          ? 'Setting user as agent and creating agent profile...' 
          : `Updating user role to ${newRole}...`
      );
      
      const apiUrl = backendurl;
      const response = await axios.put(`${apiUrl}/api/admin/users/role`, 
        { userId, role: newRole },
        { headers: { Authorization: `Bearer ${token}` }}
      );

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (response.data.success) {
        // Update the user in the local state
        setUsers(users.map(user => 
          user._id === userId ? { ...user, role: newRole } : user
        ));
        
        toast.success(`User role updated to ${newRole}`);
        
        // Refresh data after role change
        fetchAgents();
      } else {
        toast.error('Failed to update user role');
      }
    } catch (err) {
      console.error('Error updating user role:', err);
      toast.error('Error updating user role');
    }
  };

  const handleCreateAgent = async () => {
    if (!selectedUser) {
      toast.error('No user selected');
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required');
        return;
      }
      
      const loadingToast = toast.loading('Creating agent profile...');
      
      const response = await axios.post(
        `${backendurl}/api/agents/create`,
        { 
          userId: selectedUser._id,
          subscription: selectedSubscription
        },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      toast.dismiss(loadingToast);
      
      if (response.data.success) {
        toast.success('Agent profile created successfully');
        
        // Update user role in users list
        setUsers(users.map(user => 
          user._id === selectedUser._id ? { ...user, role: 'agent' } : user
        ));
        
        // Refresh agents list
        fetchAgents();
        
        // Close modal
        setShowModal(false);
        setSelectedUser(null);
        setSelectedSubscription('basic');
      } else {
        toast.error('Failed to create agent profile');
      }
    } catch (err) {
      console.error('Error creating agent profile:', err);
      toast.error('Failed to create agent profile');
    }
  };

  const fetchAgents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await axios.get(`${backendurl}/api/agents/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setAgents(response.data.agents || []);
      }
    } catch (err) {
      console.error('Error fetching agents:', err);
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

  const filteredUsers = users.filter(user => 
    (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
    user.role !== 'admin' && user.role !== 'agent'
  );

  const filteredAgents = agents.filter(agent => 
    (agent.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    agent.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Agent Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center gap-2"
        >
          <UserPlus size={16} />
          Add New Agent
        </button>
      </div>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search agents..."
          className="w-full md:w-1/3 px-4 py-2 border rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
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
                          <div className="text-xs text-gray-500">Since {formatDate(agent.createdAt)}</div>
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
                        Expires: {formatDate(agent.subscriptionExpiry)}
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
                          className={`p-2 rounded-full ${
                            agent.visible 
                              ? 'text-green-600 hover:bg-green-50' 
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                          title={agent.visible ? 'Hide agent and their properties' : 'Show agent and their properties'}
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

      {/* User Selection for Agent Creation */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Create New Agent</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            
            {selectedUser ? (
              <>
                <p className="mb-4">
                  Creating agent profile for <span className="font-medium">{selectedUser.name}</span>.
                </p>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subscription Plan
                  </label>
                  <select
                    value={selectedSubscription}
                    onChange={(e) => setSelectedSubscription(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>
                
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setSelectedUser(null);
                      setSelectedSubscription('basic');
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCreateAgent}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
                  >
                    <Check size={16} />
                    Create Agent
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="mb-4">
                  Select a user to convert to an agent:
                </p>
                
                <div className="max-h-60 overflow-y-auto mb-4 border rounded-md">
                  {filteredUsers.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {filteredUsers.map(user => (
                        <li 
                          key={user._id}
                          className="p-3 hover:bg-gray-50 cursor-pointer"
                          onClick={() => setSelectedUser(user)}
                        >
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-700 flex items-center justify-center text-white font-medium">
                              {user.name ? user.name[0].toUpperCase() : "U"}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.email}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="p-4 text-center text-gray-500">No eligible users found</p>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentManagement;