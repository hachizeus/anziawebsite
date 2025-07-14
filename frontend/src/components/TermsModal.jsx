import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, ChevronLeft, ChevronRight } from '../utils/icons.jsx';
import PropTypes from 'prop-types';

const TermsModal = ({ isOpen, onClose }) => {
  // Define the policy document pages as images
  const policyPages = [
    '/images/policy/page1.png',
    '/images/policy/page2.png',
    '/images/policy/page3.png',
    '/images/policy/page4.png',
    '/images/policy/page5.png'
  ];
  
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Handle navigation
  const nextPage = () => {
    if (currentPage < policyPages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Handle image loading
  const handleImageLoad = () => {
    setIsLoading(false);
  };
  
  // Reset to first page when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentPage(0);
      setIsLoading(true);
    }
  }, [isOpen]);
  
  // Close modal when clicking outside or pressing ESC key
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    const handleClickOutside = (event) => {
      if (event.target.id === 'terms-modal-backdrop') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent scrolling on body when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('mousedown', handleClickOutside);
      // Restore scrolling when modal is closed
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);
  
  // Reset loading state when page changes
  useEffect(() => {
    setIsLoading(true);
  }, [currentPage]);
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="terms-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-primary-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Terms and Conditions
                </h3>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="prose dark:prose-invert prose-sm max-w-none">
                {/* Page navigation */}
                <div className="flex justify-between items-center mb-4">
                  <button 
                    onClick={prevPage} 
                    disabled={currentPage === 0}
                    className="px-3 py-1 flex items-center text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                  </button>
                  <span className="text-gray-600 dark:text-gray-300 text-sm">
                    Page {currentPage + 1} of {policyPages.length}
                  </span>
                  <button 
                    onClick={nextPage} 
                    disabled={currentPage === policyPages.length - 1}
                    className="px-3 py-1 flex items-center text-gray-600 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    Next <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
                
                {/* Policy document as image */}
                <div className="w-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  {isLoading && (
                    <div className="flex justify-center items-center h-[500px] bg-gray-100 dark:bg-gray-700">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                    </div>
                  )}
                  <img 
                    src={policyPages[currentPage]} 
                    alt={`Terms and Conditions page ${currentPage + 1}`}
                    className={`w-full ${isLoading ? 'hidden' : 'block'}`}
                    onLoad={handleImageLoad}
                  />
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 p-4 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

TermsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default TermsModal;


