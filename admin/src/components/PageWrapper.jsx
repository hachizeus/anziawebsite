import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { responsivePadding } from '../utils/responsiveUtils';

/**
 * A responsive wrapper component for all admin pages
 * Provides consistent padding, animations, and responsive behavior
 */
const PageWrapper = ({ 
  children, 
  title,
  subtitle,
  actionButton,
  backLink,
  className = '',
  animate = true
}) => {
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const Content = () => (
    <div className={`min-h-screen pt-20 sm:pt-24 md:pt-28 ${responsivePadding.container} bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header section with title, subtitle and action button */}
        {(title || backLink || actionButton) && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              {backLink && (
                <div className="mb-2 sm:mb-3">
                  {backLink}
                </div>
              )}
              {title && (
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{title}</h1>
              )}
              {subtitle && (
                <p className="text-sm sm:text-base text-gray-600 mt-1">{subtitle}</p>
              )}
            </div>
            {actionButton && (
              <div className="w-full sm:w-auto">
                {actionButton}
              </div>
            )}
          </div>
        )}
        
        {/* Main content */}
        {children}
      </div>
    </div>
  );

  // Return with or without animation
  return animate ? (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.3 }}
    >
      <Content />
    </motion.div>
  ) : (
    <Content />
  );
};

PageWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  actionButton: PropTypes.node,
  backLink: PropTypes.node,
  className: PropTypes.string,
  animate: PropTypes.bool
};

export default PageWrapper;