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
        // Add delay to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: 'e96a43e6-afeb-496e-b4e0-aac6a69e65c9',
            name: formData.name,
            email: formData.email,
            phone: formData.phone || 'Not provided',
            message: formData.message,
            subject: `Contact Form: ${formData.name} - Anzia Electronics`
          })
        });
        
        const result = await response.json();
        console.log('Web3Forms response:', result);
        
        if (result.success) {
          toast.success('Message sent successfully! We will get back to you soon.');
        } else {
          console.error('Web3Forms error:', result);
          toast.error(`Error: ${result.message || 'Failed to send email'}`);
        }
        
        // Reset form
        setFormData({ name: '', email: '', phone: '', message: '' });
      } catch (error) {
        toast.error('Failed to send message. Please try again.');
        console.error('Error sending email:', error);
      }
    }
  };

  return { formData, errors, handleChange, handleSubmit };
}

