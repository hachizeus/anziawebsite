import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/**
 * ResponsiveCard - A responsive card component with mobile-first design
 */
const ResponsiveCard = ({ 
  children, 
  className = '', 
  padding = 'default',
  shadow = 'default',
  hover = false,
  rounded = 'default',
  background = 'white',
  border = false,
  as: Component = 'div',
  ...props
}) => {
  const baseClasses = 'transition-all duration-200';

  const paddingClasses = {
    none: '',
    xs: 'p-2 sm:p-3',
    sm: 'p-3 sm:p-4',
    default: 'p-3 sm:p-4 md:p-6',
    lg: 'p-4 sm:p-6 md:p-8',
    xl: 'p-6 sm:p-8 md:p-10'
  };

  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    default: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const hoverShadowClasses = {
    none: '',
    sm: 'hover:shadow-md',
    default: 'hover:shadow-lg',
    lg: 'hover:shadow-xl',
    xl: 'hover:shadow-2xl'
  };

  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    default: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    full: 'rounded-full'
  };

  const backgroundClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    primary: 'bg-primary-50',
    transparent: 'bg-transparent'
  };

  const borderClasses = border ? 'border border-gray-200' : '';

  const combinedClasses = [
    baseClasses,
    paddingClasses[padding],
    shadowClasses[shadow],
    hover ? hoverShadowClasses[shadow] : '',
    roundedClasses[rounded],
    backgroundClasses[background],
    borderClasses,
    className
  ].filter(Boolean).join(' ');

  if (hover) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        className={combinedClasses}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <Component className={combinedClasses} {...props}>
      {children}
    </Component>
  );
};

ResponsiveCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  padding: PropTypes.oneOf(['none', 'xs', 'sm', 'default', 'lg', 'xl']),
  shadow: PropTypes.oneOf(['none', 'sm', 'default', 'lg', 'xl']),
  hover: PropTypes.bool,
  rounded: PropTypes.oneOf(['none', 'sm', 'default', 'lg', 'xl', 'full']),
  background: PropTypes.oneOf(['white', 'gray', 'primary', 'transparent']),
  border: PropTypes.bool,
  as: PropTypes.elementType
};

export default ResponsiveCard;