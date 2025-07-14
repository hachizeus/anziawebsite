import { useState } from 'react';

/**
 * Custom hook for handling forms with terms and conditions acceptance
 * @param {Object} initialValues - Initial form values
 * @param {Function} onSubmit - Function to call on form submission
 * @param {Function} validate - Optional validation function
 * @returns {Object} Form handling methods and state
 */
const useFormWithTerms = (initialValues, onSubmit, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      setValues({
        ...values,
        [name]: checked
      });
    } else {
      setValues({
        ...values,
        [name]: value
      });
    }
  };
  
  // Toggle terms acceptance
  const handleTermsAcceptance = () => {
    setTermsAccepted(!termsAccepted);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form if validation function is provided
    let validationErrors = {};
    if (validate) {
      validationErrors = validate(values);
      setErrors(validationErrors);
    }
    
    // Check if terms are accepted
    if (!termsAccepted) {
      setErrors({
        ...validationErrors,
        terms: 'You must accept the terms and conditions'
      });
      return;
    }
    
    // If no validation errors and terms accepted, submit the form
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  // Reset form to initial values
  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTermsAccepted(false);
  };
  
  return {
    values,
    errors,
    isSubmitting,
    termsAccepted,
    handleChange,
    handleSubmit,
    handleTermsAcceptance,
    resetForm,
    setValues,
    setErrors
  };
};

export default useFormWithTerms;

