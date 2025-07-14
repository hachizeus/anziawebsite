import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TermsAndConditions = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the policy document page
    navigate('/policy-document');
  }, [navigate]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-8 sm:p-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Redirecting to Terms and Conditions document...</p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;

