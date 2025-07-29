import PropTypes from 'prop-types';

/**
 * ResponsiveGrid - A utility component for responsive grid layouts
 */
const ResponsiveGrid = ({ 
  children, 
  className = '', 
  cols = 'auto',
  gap = 'default',
  as: Component = 'div'
}) => {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    '1-2': 'grid-cols-1 sm:grid-cols-2',
    '1-3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '1-4': 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
    '2-4': 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    '2-6': 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6',
    'products': 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
    'cards': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    'stats': 'grid-cols-1 xs:grid-cols-2 lg:grid-cols-3',
    'auto': 'grid-cols-[repeat(auto-fit,minmax(250px,1fr))]',
    'auto-sm': 'grid-cols-[repeat(auto-fit,minmax(200px,1fr))]'
  };

  const gapClasses = {
    none: 'gap-0',
    xs: 'gap-1 sm:gap-1.5',
    sm: 'gap-2 sm:gap-3',
    default: 'gap-3 sm:gap-4 md:gap-6',
    lg: 'gap-4 sm:gap-6 md:gap-8',
    xl: 'gap-6 sm:gap-8 md:gap-12'
  };

  const combinedClasses = [
    'grid',
    colClasses[cols] || colClasses['auto'],
    gapClasses[gap],
    className
  ].filter(Boolean).join(' ');

  return (
    <Component className={combinedClasses}>
      {children}
    </Component>
  );
};

ResponsiveGrid.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  cols: PropTypes.oneOf([
    '1', '2', '3', '4', '5', '6',
    '1-2', '1-3', '1-4', '2-4', '2-6',
    'products', 'cards', 'stats', 'auto', 'auto-sm'
  ]),
  gap: PropTypes.oneOf(['none', 'xs', 'sm', 'default', 'lg', 'xl']),
  as: PropTypes.elementType
};

export default ResponsiveGrid;