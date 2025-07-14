import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X } from '../utils/icons.jsx';
import { features } from "../assets/featuredata";

// Enhanced animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 60,
      damping: 12
    }
  },
};

import PropTypes from 'prop-types';

const FeatureModal = ({ feature, isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        onClick={onClose}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", damping: 20 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl flex items-center justify-center mr-4">
                <img src={feature.icon} alt={feature.title} className="h-6 w-6 object-contain" />
              </div>
              <h3 className="text-xl font-bold dark:text-white">{feature.title}</h3>
            </div>
            <button 
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="prose prose-sm md:prose-base max-w-none">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {feature.description}
            </p>
            
            {feature.additionalInfo && (
              <>
                <h4 className="text-lg font-semibold mt-4">Additional Information</h4>
                <p className="text-gray-700 dark:text-gray-300">{feature.additionalInfo}</p>
              </>
            )}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const Features = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);
  
  const openModal = (feature) => {
    setSelectedFeature(feature);
  };
  
  const closeModal = () => {
    setSelectedFeature(null);
  };
  
  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-medium tracking-wide uppercase">Our Strengths</span>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-4 mb-4">Why Choose Anzia Electronics</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mb-6 rounded-full"></div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {features.slice(0, 6).map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl border border-gray-50 dark:border-gray-700 transition-all duration-300 flex flex-col h-full"
              variants={cardVariants}
              whileHover={{ 
                y: -10,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)"
              }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl flex items-center justify-center mb-6 transform transition-transform duration-300 group-hover:rotate-6">
                <img src={feature.icon} alt={feature.title} className="h-8 w-8 object-contain" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 line-clamp-3 flex-grow">
                {feature.description}
              </p>
              
              <motion.button 
                onClick={() => openModal(feature)}
                className="inline-flex items-center text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors mt-auto"
                whileHover={{ x: 5 }}
              >
                Learn more <ArrowRight className="ml-2 h-4 w-4" />
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Call to action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-16"
        >
          <motion.a
            href="/products"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all shadow-blue-500/30 flex items-center"
          >
            Browse Our Products
            <ArrowRight className="ml-2 h-5 w-5" />
          </motion.a>
        </motion.div>
      </div>
      
      {/* Feature Modal */}
      {selectedFeature && (
        <FeatureModal 
          feature={selectedFeature} 
          isOpen={!!selectedFeature} 
          onClose={closeModal} 
        />
      )}
    </section>
  );
};

FeatureModal.propTypes = {
  feature: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    additionalInfo: PropTypes.string
  }).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default Features;


