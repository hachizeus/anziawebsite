import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import PropTypes from 'prop-types';

const ScheduleViewing = ({ property, onClose }) => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amount, setAmount] = useState(property?.price || 0);


  // Get tomorrow's date as the minimum date for scheduling
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Get date 3 months from now as the maximum date
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  // Available time slots
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', 
    '12:00 PM', '01:00 PM', '02:00 PM', 
    '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      // Get fresh token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('You must be logged in to schedule a viewing');
        setLoading(false);
        return;
      }
      
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/appointments/schedule`,
        { propertyId: property._id, date, time, notes },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccess('Viewing scheduled successfully!');
      setShowPaymentForm(true);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to schedule viewing');
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      // Get fresh token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('You must be logged in to process payment');
        setLoading(false);
        return;
      }
      
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/payments/create`,
        { 
          propertyId: property._id, 
          amount, 
          paymentMethod,
          notes: `Payment for ${property.title}`
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.refundInitiated) {
        setSuccess('Payment recorded but property is no longer available. A refund has been initiated.');
      } else {
        setSuccess('Payment processed successfully!');
      }
      
      setLoading(false);
      
      // Close modal after 3 seconds on success
      setTimeout(() => {
        onClose();
        // Refresh the page to update property status
        window.location.reload();
      }, 3000);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to process payment');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4">
          <h2 className="text-white text-xl font-bold">
            {showPaymentForm ? 'Process Payment' : 'Schedule a Viewing'}
          </h2>
        </div>
        
        {!showPaymentForm ? (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Property
              </label>
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                {property.title} - KES {property.price.toLocaleString()}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                Date
              </label>
              <input
                type="date"
                id="date"
                min={minDate}
                max={maxDateStr}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="time">
                Time
              </label>
              <select
                id="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="">Select a time</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="3"
                placeholder="Any special requests or questions?"
              ></textarea>
            </div>
            
            {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
            {success && <div className="mb-4 text-green-500 text-sm">{success}</div>}
            
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {loading ? 'Scheduling...' : 'Schedule Viewing'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handlePayment} className="p-6">
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Property
              </label>
              <div className="p-3 bg-gray-50 rounded border border-gray-200">
                {property.title} - KES {property.price.toLocaleString()}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                Amount
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="paymentMethod">
                Payment Method
              </label>
              <select
                id="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank Transfer</option>
              </select>
            </div>
            
            {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}
            {success && <div className="mb-4 text-green-500 text-sm">{success}</div>}
            
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {loading ? 'Processing...' : 'Process Payment'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ScheduleViewing;

// PropTypes validation
ScheduleViewing.propTypes = {
  property: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired
};

