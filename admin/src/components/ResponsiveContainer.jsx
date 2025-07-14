import React from 'react';
import PropTypes from 'prop-types';

const ResponsiveContainer = ({ children, className = '' }) => {
  return (
    <div className={`w-full px-2 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6 ${className}`}>
      {children}
    </div>
  );
};

ResponsiveContainer.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default ResponsiveContainer;