import  { useState } from 'react';
import PropTypes from 'prop-types';
import { tenantSteps, landlordSteps } from '../assets/stepsdata';
import { ArrowRight } from '../utils/icons.jsx';
import { motion } from 'framer-motion';
import chevronRightIcon from '../../public/images/32px-Chevron_right_font_awesome.png';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 70,
      damping: 15,
    },
  },
};

function Step({ icon: Icon, title, description, stepNumber, imgSrc }) {
  return (
    <motion.div variants={itemVariants} className="relative flex flex-col items-center">
      {/* Step number display */}
      <div className="absolute -top-8 text-blue-600 font-bold">{stepNumber}</div>

      {/* Icon container */}
      <div className="w-20 h-20 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl flex items-center justify-center mb-5 shadow-md relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={title}
            className="h-10 w-10 relative z-10 transition-opacity duration-300 group-hover:opacity-90"
          />
        ) : (
          <Icon
            className="h-10 w-10 text-primary-600 group-hover:text-white relative z-10 transition-colors duration-300"
          />
        )}
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 max-w-xs text-center leading-relaxed">{description}</p>

      {/* Hover indicator */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="mt-4 p-2 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors cursor-pointer"
      >
        <img src={chevronRightIcon} alt="Next" className="h-5 w-5" />
      </motion.div>
    </motion.div>
  );
}

Step.propTypes = {
  icon: PropTypes.elementType,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  stepNumber: PropTypes.number.isRequired,
  imgSrc: PropTypes.string,
};

export default function HowItWorks() {
  const [activeTab, setActiveTab] = useState('tenant');
  
  return (
    <section className="py-28 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-medium tracking-wide uppercase">
            Simple Process
          </span>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mt-4 mb-4">
            {activeTab === 'tenant' ? 'Tenant Onboarding Process' : 'Landlord Onboarding Process'}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experience excellence in property management with our simple steps
          </p>
        </motion.div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-16">
          <div className="bg-gray-100 dark:bg-gray-700 p-1 rounded-lg flex">
            <button
              onClick={() => setActiveTab('tenant')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === 'tenant' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              For Tenants
            </button>
            <button
              onClick={() => setActiveTab('landlord')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                activeTab === 'landlord' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              For Landlords
            </button>
          </div>
        </div>

        {/* Steps Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8 lg:gap-12 relative"
          key={activeTab} // Force re-render animation when tab changes
        >
          {activeTab === 'tenant' ? (
            tenantSteps.map((step, index) => (
              <Step
                key={index}
                icon={step.icon}
                title={step.title}
                description={step.description}
                stepNumber={index + 1}
                imgSrc={step.imgSrc}
              />
            ))
          ) : (
            landlordSteps.map((step, index) => (
              <Step
                key={index}
                icon={step.icon}
                title={step.title}
                description={step.description}
                stepNumber={index + 1}
                imgSrc={step.imgSrc}
              />
            ))
          )}
        </motion.div>

        {/* CTA button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-16"
        >
          <motion.a
            href={activeTab === 'tenant' ? "/properties" : "/contact"}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 
              text-white font-medium rounded-lg hover:shadow-lg transition-all shadow-blue-500/30"
          >
            {activeTab === 'tenant' ? 'Browse Properties' : 'Contact Us'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </motion.a>
        </motion.div>

        {/* Testimonial teaser */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-20 max-w-3xl mx-auto"
        >
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-xl border border-gray-50 dark:border-gray-700 text-center">
            <p className="text-gray-700 dark:text-gray-300 italic text-lg mb-4">
              {activeTab === 'tenant' 
                ? `"The tenant onboarding process was incredibly smooth. Within a week, I found and secured my dream apartment!"`
                : `"As a property owner, I'm impressed with Makini's professional management approach. They've made the entire process seamless."`
              }
            </p>
            <p className="font-bold text-gray-900 dark:text-white">
              {activeTab === 'tenant' ? 'Sarah Nzomo, Eldoret' : 'James Mwangi, Property Owner'}
            </p>
            <div className="flex justify-center mt-2">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

HowItWorks.propTypes = {
  // No props are passed to HowItWorks, so no propTypes needed here
};


