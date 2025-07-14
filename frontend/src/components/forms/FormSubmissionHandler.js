import axios from 'axios';
import { toast } from 'react-toastify';

/**
 * Handles form submissions for various form types
 * @param {Object} formData - The form data to submit
 * @param {string} formType - The type of form being submitted
 * @returns {Promise<Object>} - The response from the server
 */
export const submitForm = async (formData, formType = 'contact') => {
  try {
    // All forms use the same endpoint for simplicity
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/forms/contact`, 
      {
        ...formData,
        formType // Add form type to help backend differentiate
      }
    );
    
    if (response.data.success) {
      let message = 'Form submitted successfully!';
      
      switch (formType) {
        case 'property':
          message = 'Your property inquiry has been submitted successfully!';
          break;
        case 'rental':
          message = 'Your rental inquiry has been submitted successfully!';
          break;
        case 'contact':
        default:
          message = 'Your message has been sent successfully!';
      }
      
      toast.success(message);
      return { success: true, data: response.data };
    } else {
      toast.error('Failed to submit form. Please try again.');
      return { success: false, error: response.data.message || 'Unknown error' };
    }
  } catch (error) {
    console.error(`Error submitting ${formType} form:`, error);
    toast.error('An error occurred. Please try again later.');
    return { 
      success: false, 
      error: error.response?.data?.message || error.message || 'Unknown error' 
    };
  }
};

export default submitForm;

