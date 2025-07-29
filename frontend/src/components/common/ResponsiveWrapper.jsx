import PropTypes from 'prop-types';

/**
 * ResponsiveWrapper - A utility component for consistent responsive layouts
 */
const ResponsiveWrapper = ({ 
  children, 
  className = '', 
  maxWidth = '7xl',
  padding = 'default',
  as: Component = 'div'
}) => {
  const paddingClasses = {
    none: '',
    sm: 'px-3 sm:px-4',
    default: 'px-3 sm:px-4 md:px-6 lg:px-8',
    lg: 'px-4 sm:px-6 md:px-8 lg:px-12',
    section: 'px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16'
  };

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full',
    none: ''
  };

  const combinedClasses = [
    maxWidthClasses[maxWidth],
    maxWidth !== 'none' && maxWidth !== 'full' ? 'mx-auto' : '',
    paddingClasses[padding],
    className
  ].filter(Boolean).join(' ');

  return (
    <Component className={combinedClasses}>
      {children}
    </Component>
  );
};

ResponsiveWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  maxWidth: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', 'full', 'none']),
  padding: PropTypes.oneOf(['none', 'sm', 'default', 'lg', 'section']),
  as: PropTypes.elementType
};

export default ResponsiveWrapper;