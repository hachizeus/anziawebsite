import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';
import { backendurl } from '../../App';

const TenantForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const propertyIdFromQuery = queryParams.get('propertyId');
  
  const isEditMode = !!id;
  
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [createNewUser, setCreateNewUser] = useState(false);
  const [userFound, setUserFound] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    phone: '',
    address: '',
    propertyId: propertyIdFromQuery || '',
    leaseStart: '',
    leaseEnd: '',
    rentAmount: '',
    securityDeposit: '',
    notes: '',
    status: 'active',
    password: '',
    createNewUser: false
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }
        
        try {
          const propertiesResponse = await axios.get(`${backendurl}/api/products/list`);
          if (propertiesResponse.data && propertiesResponse.data.property) {
            setProperties(propertiesResponse.data.property);
          }
        } catch (propertyError) {
          console.error('Error fetching properties:', propertyError);
          setProperties([]);
        }
        
        if (isEditMode && id) {
          try {
            const tenantResponse = await axios.get(`${backendurl}/api/tenants/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            
            if (tenantResponse.data && tenantResponse.data.tenant) {
              const tenant = tenantResponse.data.tenant;
              const userData = tenant.userId || {};
              
              const formatDate = (dateString) => {
                if (!dateString) return '';
                const date = new Date(dateString);
                return date.toISOString().split('T')[0];
              };
              
              setFormData({
                email: userData.email || '',
                name: userData.name || '',
                phone: userData.phone || '',
                address: userData.address || '',
                propertyId: tenant.propertyId?._id || '',
                leaseStart: formatDate(tenant.leaseStart),
                leaseEnd: formatDate(tenant.leaseEnd),
                rentAmount: tenant.rentAmount || '',
                securityDeposit: tenant.securityDeposit || '',
                notes: tenant.notes || '',
                status: tenant.status || 'active',
                password: ''
              });
              
              setUserFound(true);
              toast.success('Tenant details loaded successfully');
            }
          } catch (tenantError) {
            console.error('Error fetching tenant details:', tenantError);
            toast.error('Failed to load tenant details');
          }
        } else if (propertyIdFromQuery) {
          setFormData(prev => ({
            ...prev,
            propertyId: propertyIdFromQuery
          }));
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, isEditMode, propertyIdFromQuery, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (name === 'email' && !createNewUser) {
      setUserFound(false);
    }
  };
  
  const checkEmail = async () => {
    if (!formData.email) {
      toast.error('Please enter an email address');
      return;
    }
    
    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${backendurl}/api/users/check-email`,
        { email: formData.email },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (response.data.exists) {
        setFormData(prev => ({
          ...prev,
          name: response.data.user.name || '',
          phone: response.data.user.phone || '',
          address: response.data.user.address || ''
        }));
        setUserFound(true);
        toast.success('User found! Details loaded.');
        
        if (response.data.user.role === 'tenant') {
          toast.info('Note: This user is already a tenant for another property.');
        }
      } else {
        toast.info('User not found. Would you like to create a new tenant?');
        if (window.confirm('User not found. Would you like to create a new tenant with this email?')) {
          setCreateNewUser(true);
          setFormData(prev => ({
            ...prev,
            email: prev.email
          }));
        }
      }
    } catch (err) {
      console.error('Error checking email:', err);
      toast.error('Failed to check email');
    } finally {
      setLoading(false);
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const token = localStorage.getItem('token');
    
    if (!formData.propertyId) {
      toast.error('Please select a property');
      setLoading(false);
      return;
    }
    
    if (!formData.leaseStart || !formData.leaseEnd) {
      toast.error('Please provide lease start and end dates');
      setLoading(false);
      return;
    }
    
    if (createNewUser && !formData.password) {
      toast.error('Password is required when creating a new tenant');
      setLoading(false);
      return;
    }
    
    if (!formData.email) {
      toast.error('Email address is required');
      setLoading(false);
      return;
    }
    
    const tenantData = {
      email: formData.email,
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      propertyId: formData.propertyId,
      leaseStart: formData.leaseStart,
      leaseEnd: formData.leaseEnd,
      rentAmount: formData.rentAmount,
      securityDeposit: formData.securityDeposit,
      notes: formData.notes,
      status: formData.status,
      updatePropertyStatus: true,
      createNewUser: createNewUser,
      password: formData.password
    };
    
    if (isEditMode) {
      await axios.put(`${backendurl}/api/tenants/${id}`, tenantData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Tenant updated successfully');
    } else {
      await axios.post(`${backendurl}/api/tenants`, tenantData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      try {
        await axios.get(`${backendurl}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (statsError) {
        console.error('Error refreshing dashboard stats:', statsError);
      }
      
      toast.success(createNewUser 
        ? 'New tenant created successfully with tenant role' 
        : 'Tenant created successfully');
    }
    
    navigate('/users');
  } catch (error) {
    console.error('Error saving tenant:', error);
    toast.error(error.response?.data?.message || 'Failed to save tenant');
    setLoading(false);
  }
};

  if (loading && isEditMode) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#91BB3E]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Edit Tenant' : 'Add New Tenant'}
      </h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Tenant Information</h2>
            
            <div className="mb-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-md font-medium text-gray-800">
                  {createNewUser ? "Create New Tenant" : "Select Existing User"}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {createNewUser ? "Creating a new user account" : "Using an existing user account"}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCreateNewUser(!createNewUser);
                      setUserFound(false);
                      setFormData(prev => ({
                        ...prev,
                        password: ''
                      }));
                    }}
                    className="flex items-center gap-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-800 px-3 py-1 rounded-md"
                  >
                    {createNewUser ? (
                      <>Use existing user</>
                    ) : (
                      <><UserPlus size={16} /> Create new tenant</>
                    )}
                  </button>
                </div>
              </div>
              
              {!createNewUser ? (
                <>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="flex">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#91BB3E]"
                      placeholder="Enter email address"
                      required
                    />
                    <button
                      type="button"
                      onClick={checkEmail}
                      disabled={loading || !formData.email}
                      className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Checking...' : 'Check'}
                    </button>
                  </div>
                  
                  {userFound && (
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 mt-2 mb-4">
                      <p className="text-green-700 font-medium">User found! Details loaded.</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <UserPlus size={18} className="text-blue-700" />
                    <p className="text-blue-700 font-medium">Creating a new tenant account</p>
                  </div>
                  <p className="text-sm text-blue-600 mb-2">A new user account will be created with the provided email and details.</p>
                  <ul className="text-xs text-blue-600 list-disc list-inside">
                    <li>The tenant will receive login credentials to access their account</li>
                    <li>They will be able to view their property details and payment history</li>
                    <li>Their role will be automatically set to &quot;tenant&quot;</li>
                  </ul>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {createNewUser && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#91BB3E]"
                    placeholder="Enter email address"
                    required
                  />
                </div>
                )}
                
                {createNewUser && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#91BB3E]"
                      placeholder="Create password for new tenant"
                      required={createNewUser}
                    />
                  </div>
                )}
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#91BB3E]"
                    placeholder="Enter full name"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#91BB3E]"
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div className="mb-4 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#91BB3E]"
                    placeholder="Enter address"
                    rows="2"
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Lease Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property *
                </label>
                <select
                  name="propertyId"
                  value={formData.propertyId}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#91BB3E]"
                  required
                >
                  <option value="">Select a property</option>
                  {properties.map((property) => (
                    <option 
                      key={property._id} 
                      value={property._id}
                    >
                      {property.title} - {property.location}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#91BB3E]"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lease Start Date *
                </label>
                <input
                  type="date"
                  name="leaseStart"
                  value={formData.leaseStart}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#91BB3E]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lease End Date *
                </label>
                <input
                  type="date"
                  name="leaseEnd"
                  value={formData.leaseEnd}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#91BB3E]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monthly Rent Amount (KSh) *
                </label>
                <input
                  type="number"
                  name="rentAmount"
                  value={formData.rentAmount}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#91BB3E]"
                  placeholder="Enter monthly rent amount"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Security Deposit (KSh)
                </label>
                <input
                  type="number"
                  name="securityDeposit"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#91BB3E]"
                  placeholder="Enter security deposit amount"
                />
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#91BB3E]"
              placeholder="Enter any additional notes"
              rows="3"
            />
          </div>
          
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/tenants')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#91BB3E] text-white rounded-md hover:bg-[#82a737] disabled:opacity-50 flex items-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>{isEditMode ? 'Update Tenant' : 'Create Tenant'}</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TenantForm;