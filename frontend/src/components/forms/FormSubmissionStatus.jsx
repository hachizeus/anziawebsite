import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { CheckCircle, XCircle } from '../utils/icons.jsx';

const FormSubmissionStatus = ({ status, message, onClose }) => {
  if (!status) return null;
  
  const isSuccess = status === 'success';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
        isSuccess ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
      }`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {isSuccess ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
        </div>
        <div className="ml-3">
          <h3 className={`text-sm font-medium ${isSuccess ? 'text-green-800' : 'text-red-800'}`}>
            {isSuccess ? 'Success!' : 'Error'}
          </h3>
          <div className={`mt-1 text-sm ${isSuccess ? 'text-green-700' : 'text-red-700'}`}>
            {message}
          </div>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md p-1.5 ${
                isSuccess 
                  ? 'bg-green-50 text-green-500 hover:bg-green-100' 
                  : 'bg-red-50 text-red-500 hover:bg-red-100'
              }`}
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

FormSubmissionStatus.propTypes = {
  status: PropTypes.oneOf(['success', 'error', null]),
  message: PropTypes.string,
  onClose: PropTypes.func.isRequired
};

export default FormSubmissionStatus;


