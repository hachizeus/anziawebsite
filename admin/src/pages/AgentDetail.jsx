import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Edit, Save, Plus, Trash } from 'lucide-react';
import { backendurl } from '../App';

const AgentDetail = () => {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [properties, setProperties] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Form states
  const [subscription, setSubscription] = useState('basic');
  const [currency, setCurrency] = useState('KSH');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank transfer');
  const [paymentNotes, setPaymentNotes] = useState('');

  useEffect(() => {
    fetchAgentDetails();
  }, [id]);

  const fetchAgentDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }
      
      // Fetch agent details
      const agentResponse = await axios.get(`${backendurl}/api/agents/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (agentResponse.data.success) {
        setAgent(agentResponse.data.agent);
        setSubscription(agentResponse.data.agent.subscription || 'basic');
        setCurrency(agentResponse.data.agent.currency || 'KSH');
        
        // Fetch agent properties
        if (agentResponse.data.agent.properties && agentResponse.data.agent.properties.length > 0) {
          const propertiesResponse = await axios.get(
            `${backendurl}/api/agents/${id}/properties`, 
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          if (propertiesResponse.data.success) {
            setProperties(propertiesResponse.data.properties || []);
          }
        }
      } else {
        setError('Failed to fetch agent details');
      }
    } catch (err) {
      console.error('Error fetching agent details:', err);
      setError('Error loading agent details');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAgent = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Authentication required');
        return;
      }
      
      const loadingToast = toast.loading('Updating agent...');
      
      const response = await axios.put(
        `${backendurl}/api/agents/${id}/update`,
        { 
          subscription,
          currency,
          subscriptionExpiry: agent.subscriptionExpiry
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.dismiss(loadingToast);
      
      if (response.data.success) {
        toast.success('Agent updated successfully');
        setEditMode(false);
        // Refresh agent data
        fetchAgentDetails();
      } else {
        toast.error('Failed to update agent');
      }
    } catch (err) {
      console.error('Error updating agent:', err);
      toast.error('Error updating agent');
    }
  };

  const handleAddPayment = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Authentication required');
        return;
      }
      
      if (!paymentAmount || isNaN(paymentAmount) || Number(paymentAmount) <= 0) {
        toast.error('Please enter a valid payment amount');
        return;
      }
      
      const loadingToast = toast.loading('Recording payment...');
      
      const response = await axios.post(
        `${backendurl}/api/agents/${id}/payment`,
        { 
          amount: Number(paymentAmount),
          method: paymentMethod,
          notes: paymentNotes
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.dismiss(loadingToast);
      
      if (response.data.success) {
        toast.success('Payment recorded successfully');
        setShowPaymentModal(false);
        setPaymentAmount('');
        setPaymentNotes('');
        
        // Refresh agent details to show new payment
        fetchAgentDetails();
      } else {
        toast.error('Failed to record payment');
      }
    } catch (err) {
      console.error('Error recording payment:', err);
      toast.error('Error recording payment');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return `${agent?.currency || 'KSH'} ${Number(amount).toLocaleString()}`;
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

  if (error || !agent) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error || 'Agent not found'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/agents" className="flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft size={16} className="mr-1" />
          Back to Agents
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Agent Details</h1>
            <div className="flex space-x-2">
              {editMode ? (
                <button
                  onClick={handleUpdateAgent}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <Save size={16} className="mr-1" />
                  Save
                </button>
              ) : (
                <button
                  onClick={() => setEditMode(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <Edit size={16} className="mr-1" />
                  Edit
                </button>
              )}
              <button
                onClick={() => setShowPaymentModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center"
              >
                <Plus size={16} className="mr-1" />
                Record Payment
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{agent.userId?.name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{agent.email || agent.userId?.email || 'No email'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{agent.phone || 'No phone'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">WhatsApp</p>
                  <p className="font-medium">{agent.whatsapp || 'No WhatsApp'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Bio</p>
                  <p className="font-medium">{agent.bio || 'No bio'}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-4">Subscription Details</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Subscription Plan</p>
                  {editMode ? (
                    <select
                      value={subscription}
                      onChange={(e) => setSubscription(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="basic">Basic</option>
                      <option value="premium">Premium</option>
                      <option value="professional">Professional</option>
                    </select>
                  ) : (
                    <p className="font-medium capitalize">{agent.subscription || 'Basic'}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Currency</p>
                  {editMode ? (
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="KSH">KSH (Kenyan Shilling)</option>
                      <option value="USD">USD (US Dollar)</option>
                      <option value="EUR">EUR (Euro)</option>
                    </select>
                  ) : (
                    <p className="font-medium">{agent.currency || 'KSH'}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Subscription Expiry</p>
                  {editMode ? (
                    <input
                      type="date"
                      value={agent.subscriptionExpiry ? new Date(agent.subscriptionExpiry).toISOString().split('T')[0] : ''}
                      onChange={(e) => setAgent({...agent, subscriptionExpiry: e.target.value})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  ) : (
                    <p className="font-medium">{formatDate(agent.subscriptionExpiry)}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <div className="flex space-x-2 mt-1">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      agent.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {agent.active ? 'Active' : 'Inactive'}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      agent.visible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {agent.visible ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Payment History</h2>
          {agent.paymentHistory && agent.paymentHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {agent.paymentHistory.map((payment, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(payment.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {payment.method}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No payment history found</p>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Properties ({properties.length})</h2>
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {properties.map(property => (
                <div key={property._id} className="border rounded-lg overflow-hidden">
                  <div className="h-40 bg-gray-200 relative">
                    {property.image && property.image[0] ? (
                      <img 
                        src={property.image[0]} 
                        alt={property.title} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-500">
                        No Image
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        property.visible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {property.visible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-lg mb-1">{property.title}</h3>
                    <p className="text-gray-500 text-sm mb-2">{property.location}</p>
                    <p className="font-bold text-blue-600">{formatCurrency(property.price)}</p>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex space-x-2 text-sm text-gray-500">
                        <span>{property.beds} beds</span>
                        <span>•</span>
                        <span>{property.baths} baths</span>
                        <span>•</span>
                        <span>{property.sqft} sqft</span>
                      </div>
                      <Link 
                        to={`/properties/${property._id}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No properties found</p>
          )}
        </div>
      </div>
      
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Record Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-gray-500 hover:text-gray-700">
                <Trash size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddPayment}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount ({agent.currency || 'KSH'})
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter amount"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="cash">Cash</option>
                  <option value="check">Check</option>
                  <option value="bank transfer">Bank Transfer</option>
                  <option value="credit card">Credit Card</option>
                  <option value="debit card">Debit Card</option>
                  <option value="paypal">PayPal</option>
                  <option value="mpesa">M-Pesa</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Enter payment notes"
                  rows="3"
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Record Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentDetail;