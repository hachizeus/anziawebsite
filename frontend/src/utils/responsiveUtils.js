/**
 * Responsive utility functions and constants for consistent styling
 */

// Breakpoint values (matching Tailwind config)
export const breakpoints = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

// Common responsive padding classes
export const responsivePadding = {
  container: "px-3 sm:px-4 md:px-6 lg:px-8",
  section: "px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-16",
  card: "p-3 sm:p-4 md:p-6",
  cardLarge: "p-4 sm:p-6 md:p-8",
  button: "px-3 sm:px-4 py-2 sm:py-2.5",
  buttonSmall: "px-2 sm:px-3 py-1.5 sm:py-2",
  input: "px-3 sm:px-4 py-2 sm:py-2.5"
};

// Common responsive margin classes
export const responsiveMargin = {
  section: "mt-6 sm:mt-8 md:mt-12 lg:mt-16",
  element: "mt-3 sm:mt-4 md:mt-6",
  bottom: "mb-3 sm:mb-4 md:mb-6",
  vertical: "my-3 sm:my-4 md:my-6"
};

// Common responsive text size classes
export const responsiveText = {
  xs: "text-xs sm:text-sm",
  sm: "text-sm sm:text-base",
  base: "text-sm sm:text-base md:text-lg",
  lg: "text-base sm:text-lg md:text-xl",
  xl: "text-lg sm:text-xl md:text-2xl",
  "2xl": "text-xl sm:text-2xl md:text-3xl",
  "3xl": "text-2xl sm:text-3xl md:text-4xl",
  heading: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
  subheading: "text-lg sm:text-xl md:text-2xl",
  display: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
};

// Common responsive gap classes
export const responsiveGap = {
  xs: "gap-1 sm:gap-1.5",
  sm: "gap-2 sm:gap-3",
  default: "gap-3 sm:gap-4 md:gap-6",
  lg: "gap-4 sm:gap-6 md:gap-8",
  xl: "gap-6 sm:gap-8 md:gap-12"
};

// Common responsive grid classes
export const responsiveGrid = {
  cols1: "grid-cols-1",
  cols2: "grid-cols-2",
  cols3: "grid-cols-3",
  cols4: "grid-cols-4",
  cols1to2: "grid-cols-1 sm:grid-cols-2",
  cols1to3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  cols1to4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  cols2to4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  cols2to6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
  products: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
  cards: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  stats: "grid-cols-1 xs:grid-cols-2 lg:grid-cols-3"
};

// Responsive flex classes
export const responsiveFlex = {
  colToRow: "flex-col sm:flex-row",
  rowToCol: "flex-row sm:flex-col",
  center: "flex items-center justify-center",
  between: "flex items-center justify-between",
  start: "flex items-center justify-start",
  end: "flex items-center justify-end",
  wrap: "flex flex-wrap",
  nowrap: "flex flex-nowrap"
};

// Responsive width classes
export const responsiveWidth = {
  full: "w-full",
  auto: "w-auto",
  fit: "w-fit",
  screen: "w-screen",
  container: "w-full max-w-7xl mx-auto",
  modal: "w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl"
};

// Helper functions
export const combineClasses = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const getCurrentBreakpoint = () => {
  if (typeof window === 'undefined') return 'sm';
  
  const width = window.innerWidth;
  if (width >= breakpoints['2xl']) return '2xl';
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  if (width >= breakpoints.sm) return 'sm';
  return 'xs';
};

export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < breakpoints.md;
};

export const isTablet = () => {
  if (typeof window === 'undefined') return false;
  const width = window.innerWidth;
  return width >= breakpoints.md && width < breakpoints.lg;
};

export const isDesktop = () => {
  if (typeof window === 'undefined') return true;
  return window.innerWidth >= breakpoints.lg;
};

// Hook for responsive behavior
export const useResponsive = () => {
  const [breakpoint, setBreakpoint] = useState(getCurrentBreakpoint());
  
  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(getCurrentBreakpoint());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return {
    breakpoint,
    isMobile: breakpoint === 'xs' || breakpoint === 'sm',
    isTablet: breakpoint === 'md',
    isDesktop: breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl',
    isSmallScreen: breakpoint === 'xs',
    isLargeScreen: breakpoint === 'xl' || breakpoint === '2xl'
  };
};