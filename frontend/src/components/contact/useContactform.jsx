import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function useContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        // Send email using Web3Forms (free email service)
        // Send to backend API
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL || 'https://anzia-electronics-api.onrender.com'}/api/forms/submit`, formData);
        
        if (response.data.success) {
          toast.success('Form submitted successfully!');
        } else {
          toast.error('Error submitting form. Please try again.');
        }
        
        // Reset form
        setFormData({ name: '', email: '', phone: '', message: '' });
      } catch (error) {
        toast.error('Error submitting form. Please try again.');
        console.error('Error submitting form:', error);
      }
    }
  };

  return { formData, errors, handleChange, handleSubmit };
}

