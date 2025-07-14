import React from 'react';
import PropTypes from 'prop-types';

const ResponsiveWrapper = ({ children }) => {
  return (
    <div className="w-full max-w-full overflow-x-hidden">
      <div className="px-2 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-4 md:py-6">
        {children}
      </div>
    </div>
  );
};

ResponsiveWrapper.propTypes = {
  children: PropTypes.node.isRequired
};

export default ResponsiveWrapper;