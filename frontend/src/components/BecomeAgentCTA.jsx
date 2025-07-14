import { UserPlus, ArrowRight } from '../utils/icons.jsx';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { trackEvent } from '../utils/analytics';

const BecomeAgentCTA = () => {
  const navigate = useNavigate();
  
  const handleBecomeAgentClick = () => {
    // Track the event in Google Analytics
    trackEvent('become_agent_click', {
      'event_category': 'engagement',
      'event_label': 'Become Agent CTA'
    });
    navigate('/become-agent');
  };

  return (
    <div className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-xl p-6 mb-8 border border-primary-100 dark:border-primary-900/30 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute -right-12 -top-12 w-40 h-40 bg-primary-100 dark:bg-primary-900/20 rounded-full opacity-70"></div>
      <div className="absolute -left-12 -bottom-12 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full opacity-70"></div>
      
      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        <motion.div 
          whileHover={{ rotate: 10, scale: 1.05 }}
          className="bg-gradient-to-br from-primary-500 to-primary-600 p-5 rounded-2xl shadow-lg shadow-primary-500/20">
          <UserPlus className="w-12 h-12 text-white" />
        </motion.div>
        
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 flex items-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-blue-600">Become a Property Agent</span>
            <span className="ml-2 px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs rounded-full font-medium">New Opportunity</span>
          </h3>
          
          <p className="text-gray-700 dark:text-gray-300 mb-5 text-lg">
            Are you a property owner or freelancer looking to list real estate?
            Join us as an agent and promote your properties to a wide audience.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {[
              'Click your profile picture',
              'Select "Ask to be an Agent"',
              'Fill in the short application form',
              'Submit and wait for approval'
            ].map((step, index) => (
              <motion.div 
                key={index} 
                className="flex items-start bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                whileHover={{ y: -3 }}
              >
                <div className="bg-primary-100 dark:bg-primary-900/30 rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">
                  <span className="text-primary-600 dark:text-primary-400 text-sm font-bold">{index + 1}</span>
                </div>
                <span className="text-gray-800 dark:text-gray-200">{step}</span>
              </motion.div>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              Once approved, you will get access to an agent dashboard to manage your listings!
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-5 py-2 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg shadow-md hover:shadow-lg flex items-center gap-2 transition-all"
              onClick={handleBecomeAgentClick}
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeAgentCTA;


