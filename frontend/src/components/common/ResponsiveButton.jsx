import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/**
 * ResponsiveButton - A responsive button component with consistent styling
 */
const ResponsiveButton = ({ 
  children, 
  className = '', 
  variant = 'primary',
  size = 'default',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
  };

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs rounded',
    sm: 'px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm rounded',
    default: 'px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base rounded-lg',
    lg: 'px-4 sm:px-6 py-2.5 sm:py-3 text-base sm:text-lg rounded-lg',
    xl: 'px-6 sm:px-8 py-3 sm:py-4 text-lg sm:text-xl rounded-xl'
  };

  const iconSizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-3 h-3 sm:w-4 sm:h-4',
    default: 'w-4 h-4 sm:w-5 sm:h-5',
    lg: 'w-5 h-5 sm:w-6 sm:h-6',
    xl: 'w-6 h-6 sm:w-7 sm:h-7'
  };

  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');

  const iconSpacing = {
    xs: iconPosition === 'left' ? 'mr-1' : 'ml-1',
    sm: iconPosition === 'left' ? 'mr-1 sm:mr-1.5' : 'ml-1 sm:ml-1.5',
    default: iconPosition === 'left' ? 'mr-1.5 sm:mr-2' : 'ml-1.5 sm:ml-2',
    lg: iconPosition === 'left' ? 'mr-2 sm:mr-2.5' : 'ml-2 sm:ml-2.5',
    xl: iconPosition === 'left' ? 'mr-2.5 sm:mr-3' : 'ml-2.5 sm:ml-3'
  };

  const renderIcon = () => {
    if (loading) {
      return (
        <div className={`animate-spin rounded-full border-2 border-current border-t-transparent ${iconSizeClasses[size]} ${iconSpacing[size]}`} />
      );
    }
    
    if (icon) {
      return (
        <span className={`${iconSizeClasses[size]} ${iconSpacing[size]}`}>
          {icon}
        </span>
      );
    }
    
    return null;
  };

  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      {...props}
    >
      {iconPosition === 'left' && renderIcon()}
      {children}
      {iconPosition === 'right' && renderIcon()}
    </motion.button>
  );
};

ResponsiveButton.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger']),
  size: PropTypes.oneOf(['xs', 'sm', 'default', 'lg', 'xl']),
  fullWidth: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset'])
};

export default ResponsiveButton;