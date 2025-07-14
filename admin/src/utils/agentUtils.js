import axios from 'axios';
import { backendurl } from '../App';

/**
 * Ensures an agent profile exists for a user
 * @param {string} userId - The user ID
 * @param {string} subscription - The subscription type
 * @returns {Promise<Object>} - The response data
 */
export const ensureAgentProfile = async (userId, subscription = 'basic') => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await axios.post(
    `${backendurl}/api/agent-management/ensure-agent-profile`,
    { userId, subscription },
    { headers: { Authorization: `Bearer ${token}` }}
  );
  
  return response.data;
};

/**
 * Removes an agent profile for a user
 * @param {string} userId - The user ID
 * @returns {Promise<Object>} - The response data
 */
export const removeAgentProfile = async (userId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication required');
  }
  
  const response = await axios.post(
    `${backendurl}/api/agent-management/remove-agent-profile`,
    { userId },
    { headers: { Authorization: `Bearer ${token}` }}
  );
  
  return response.data;
};