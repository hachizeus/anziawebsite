import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Users, CheckCircle } from '../utils/icons.jsx';

const BecomeAgentPage = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    message: '',
    formType: 'agent-request'
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Use direct fetch with explicit formType
      const requestData = {
        ...formData,
        formType: 'agent-request' // Ensure this is explicitly set
      };
      
      console.log('Sending agent request with data:', requestData);
      
      // Use the agent-specific endpoint
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/api/agents/request`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        }
      );
      
      const responseData = await response.json();
      
      if (response.ok) {
        setSubmitted(true);
        toast.success('Your request has been submitted successfully');
      } else {
        throw new Error(responseData.message || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Error submitting agent request:', error);
      toast.error('Failed to submit request. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
            <h1 className="text-2xl font-bold text-center mb-6">Become an Agent</h1>
            <p className="text-center mb-6">
              Please log in or create an account to apply as an agent.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Log In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-6 py-2 border border-primary-600 text-primary-600 rounded-md hover:bg-primary-50"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Request Submitted!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your interest in becoming an agent with Real Estate Website. 
              We have received your request and our team will review it shortly.
              We will contact you with further instructions.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 bg-primary-600 p-8 text-white">
                <h1 className="text-2xl font-bold mb-4">Become an Agent</h1>
                <p className="mb-6">
                  Join our team of professional agents and start selling properties using our platform.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">List Your Properties</h3>
                      <p className="text-primary-100 text-sm">
                        Create and manage your property listings with our easy-to-use platform.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">Reach More Clients</h3>
                      <p className="text-primary-100 text-sm">
                        Get exposure to our wide audience of potential buyers and renters.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">Professional Support</h3>
                      <p className="text-primary-100 text-sm">
                        Get support from our team to help you succeed in your real estate business.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="md:w-1/2 p-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <Users className="w-6 h-6 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-semibold">Agent Application</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name*
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Your full name"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Your email address"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number*
                    </label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Your phone number"
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Information
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Tell us about your experience in real estate..."
                    ></textarea>
                  </div>
                  
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className={`w-full px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                        submitting ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {submitting ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeAgentPage;


