import { useState } from 'react';
import axios from 'axios';
import { backendurl } from '../App';

const FixAgentButton = ({ userId, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleCreateAgent = async () => {
    if (!confirm('Are you sure you want to create an agent profile for this user?')) {
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      
      // First, try the direct endpoint
      const response = await axios.post(
        `${backendurl}/api/admin-utils/create-agent/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.success) {
        alert('Agent profile created successfully!');
        if (onSuccess) onSuccess();
      } else {
        throw new Error(response.data.message || 'Failed to create agent profile');
      }
    } catch (error) {
      console.error('Error creating agent profile:', error);
      alert(`Failed to create agent profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCreateAgent}
      disabled={loading}
      className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs"
    >
      {loading ? 'Creating...' : 'Fix Agent'}
    </button>
  );
};

export default FixAgentButton;