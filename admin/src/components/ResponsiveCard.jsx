import React from 'react';
import PropTypes from 'prop-types';
import { responsivePadding, responsiveText } from '../utils/responsiveUtils';

/**
 * A responsive card component for consistent styling across the admin interface
 */
const ResponsiveCard = ({ 
  children, 
  title,
  subtitle,
  action,
  className = '',
  bodyClassName = '',
  noPadding = false
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md ${!noPadding ? responsivePadding.card : ''} ${className}`}>
      {/* Card header */}
      {(title || action) && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
          <div>
            {title && (
              <h2 className={responsiveText.subheading}>{title}</h2>
            )}
            {subtitle && (
              <p className={`${responsiveText.small} text-gray-500 mt-1`}>{subtitle}</p>
            )}
          </div>
          {action && (
            <div className="w-full sm:w-auto">
              {action}
            </div>
          )}
        </div>
      )}
      
      {/* Card body */}
      <div className={bodyClassName}>
        {children}
      </div>
    </div>
  );
};

ResponsiveCard.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.node,
  subtitle: PropTypes.node,
  action: PropTypes.node,
  className: PropTypes.string,
  bodyClassName: PropTypes.string,
  noPadding: PropTypes.bool
};

export default ResponsiveCard;