import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Send } from '../utils/icons.jsx';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const RentalInquiryForm = ({ propertyId, propertyTitle, rentalPrice }) => {
  const { user, isLoggedIn } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    moveInDate: '',
    leaseTerm: '12', // Default to 12 months
    occupants: '1',
    propertyId,
    propertyTitle
  });
  
  // Auto-fill form with user data when available
  useEffect(() => {
    if (isLoggedIn && user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [isLoggedIn, user]);
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Lease term options
  const leaseTerms = [
    { value: '6', label: '6 Months' },
    { value: '12', label: '12 Months' },
    { value: '24', label: '24 Months' },
    { value: 'flexible', label: 'Flexible' }
  ];
  
  // Occupant options
  const occupantOptions = [
    { value: '1', label: '1 Person' },
    { value: '2', label: '2 People' },
    { value: '3', label: '3 People' },
    { value: '4', label: '4+ People' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.moveInDate) {
      newErrors.moveInDate = 'Move-in date is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Use the forms/submit endpoint that exists
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://makini-realtors-backend.onrender.com';
      
      console.log('Sending rental inquiry to:', `${apiUrl}/api/forms/submit`);
      
      const response = await axios.post(`${apiUrl}/api/forms/submit`, {
        ...formData,
        formType: 'rental'
      });
      
      console.log('Rental inquiry response:', response.data);
      
      if (response.data.success || response.data.message) {
        toast.success('Your rental inquiry has been submitted successfully! We will contact you shortly.');
        // Reset only the specific fields, keep user details
        setFormData(prev => ({
          ...prev,
          message: '',
          moveInDate: '',
          leaseTerm: '12',
          occupants: '1'
        }));
      } else {
        toast.error('Failed to submit inquiry. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting rental inquiry:', error);
      toast.error('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate estimated monthly payment
  const monthlyPayment = rentalPrice ? `KSh ${rentalPrice.toLocaleString()}` : 'Contact for pricing';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
    >
      <h3 className="text-xl font-bold mb-2 text-gray-800">Rental Inquiry</h3>
      <p className="text-gray-600 mb-4">Monthly payment: <span className="font-semibold text-blue-600">{monthlyPayment}</span></p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              readOnly={isLoggedIn}
            />
            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              readOnly={isLoggedIn}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              readOnly={isLoggedIn && formData.phone}
            />
          </div>
          
          <div>
            <label htmlFor="moveInDate" className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Move-in Date *
            </label>
            <div className="relative">
              <input
                type="date"
                id="moveInDate"
                name="moveInDate"
                value={formData.moveInDate}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.moveInDate ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
            {errors.moveInDate && <p className="mt-1 text-sm text-red-500">{errors.moveInDate}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="leaseTerm" className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Lease Term
            </label>
            <select
              id="leaseTerm"
              name="leaseTerm"
              value={formData.leaseTerm}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {leaseTerms.map(term => (
                <option key={term.value} value={term.value}>
                  {term.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="occupants" className="block text-sm font-medium text-gray-700 mb-1">
              Number of Occupants
            </label>
            <select
              id="occupants"
              name="occupants"
              value={formData.occupants}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {occupantOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Information *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.message ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Please share any specific requirements or questions you have about this rental property..."
          />
          {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Submit Rental Inquiry
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
};

RentalInquiryForm.propTypes = {
  propertyId: PropTypes.string.isRequired,
  propertyTitle: PropTypes.string.isRequired,
  rentalPrice: PropTypes.number
};

export default RentalInquiryForm;


