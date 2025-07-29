import PropTypes from 'prop-types';

/**
 * ResponsiveText - A responsive text component with mobile-first typography
 */
const ResponsiveText = ({ 
  children, 
  className = '', 
  variant = 'body',
  color = 'default',
  weight = 'normal',
  align = 'left',
  truncate = false,
  as: Component = 'p',
  ...props
}) => {
  const variantClasses = {
    // Headings
    'h1': 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold',
    'h2': 'text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold',
    'h3': 'text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold',
    'h4': 'text-base sm:text-lg md:text-xl lg:text-2xl font-semibold',
    'h5': 'text-sm sm:text-base md:text-lg lg:text-xl font-semibold',
    'h6': 'text-xs sm:text-sm md:text-base lg:text-lg font-semibold',
    
    // Body text
    'body': 'text-sm sm:text-base',
    'body-lg': 'text-base sm:text-lg md:text-xl',
    'body-sm': 'text-xs sm:text-sm',
    
    // Special variants
    'lead': 'text-lg sm:text-xl md:text-2xl font-light',
    'caption': 'text-xs sm:text-sm',
    'overline': 'text-xs sm:text-sm uppercase tracking-wide font-medium',
    'subtitle': 'text-sm sm:text-base md:text-lg font-medium',
    
    // Display text
    'display': 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold',
    'display-sm': 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold'
  };

  const colorClasses = {
    default: 'text-gray-900 dark:text-gray-100',
    muted: 'text-gray-600 dark:text-gray-400',
    light: 'text-gray-500 dark:text-gray-500',
    primary: 'text-primary-600 dark:text-primary-400',
    secondary: 'text-gray-700 dark:text-gray-300',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    error: 'text-red-600 dark:text-red-400',
    white: 'text-white',
    black: 'text-black'
  };

  const weightClasses = {
    thin: 'font-thin',
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
    black: 'font-black'
  };

  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
    justify: 'text-justify'
  };

  const truncateClasses = truncate ? 'truncate' : '';

  const combinedClasses = [
    variantClasses[variant] || variantClasses.body,
    colorClasses[color],
    weightClasses[weight],
    alignClasses[align],
    truncateClasses,
    className
  ].filter(Boolean).join(' ');

  // Auto-select semantic HTML element based on variant
  const getSemanticElement = () => {
    if (Component !== 'p') return Component;
    
    switch (variant) {
      case 'h1': return 'h1';
      case 'h2': return 'h2';
      case 'h3': return 'h3';
      case 'h4': return 'h4';
      case 'h5': return 'h5';
      case 'h6': return 'h6';
      case 'display':
      case 'display-sm': return 'h1';
      case 'caption':
      case 'overline': return 'span';
      default: return 'p';
    }
  };

  const Element = getSemanticElement();

  return (
    <Element className={combinedClasses} {...props}>
      {children}
    </Element>
  );
};

ResponsiveText.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf([
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'body', 'body-lg', 'body-sm',
    'lead', 'caption', 'overline', 'subtitle',
    'display', 'display-sm'
  ]),
  color: PropTypes.oneOf([
    'default', 'muted', 'light', 'primary', 'secondary',
    'success', 'warning', 'error', 'white', 'black'
  ]),
  weight: PropTypes.oneOf([
    'thin', 'light', 'normal', 'medium', 'semibold', 'bold', 'extrabold', 'black'
  ]),
  align: PropTypes.oneOf(['left', 'center', 'right', 'justify']),
  truncate: PropTypes.bool,
  as: PropTypes.elementType
};

export default ResponsiveText;