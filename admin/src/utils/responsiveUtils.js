/**
 * Responsive utility functions and constants for consistent styling
 */

// Common responsive padding classes
export const responsivePadding = {
  container: "px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6",
  card: "p-3 sm:p-4 md:p-6 lg:p-8",
  cardSmall: "p-2 sm:p-3 md:p-4",
  button: "px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5",
  buttonSmall: "px-2 sm:px-3 py-1 sm:py-1.5",
  table: "px-2 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4",
  section: "px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12"
};

// Common responsive margin classes
export const responsiveMargin = {
  section: "mt-4 sm:mt-6 md:mt-8 lg:mt-12",
  element: "mt-3 sm:mt-4 md:mt-6",
  bottom: "mb-3 sm:mb-4 md:mb-6 lg:mb-8",
  top: "mt-3 sm:mt-4 md:mt-6 lg:mt-8",
  vertical: "my-3 sm:my-4 md:my-6 lg:my-8"
};

// Common responsive text size classes
export const responsiveText = {
  xs: "text-xs sm:text-sm",
  sm: "text-sm sm:text-base",
  base: "text-sm sm:text-base md:text-lg",
  lg: "text-base sm:text-lg md:text-xl",
  xl: "text-lg sm:text-xl md:text-2xl",
  heading: "text-xl sm:text-2xl md:text-3xl lg:text-4xl",
  subheading: "text-lg sm:text-xl md:text-2xl font-semibold",
  body: "text-sm sm:text-base",
  small: "text-xs sm:text-sm",
  caption: "text-xs"
};

// Common responsive gap classes
export const responsiveGap = {
  xs: "gap-1 sm:gap-1.5",
  small: "gap-1 sm:gap-2 md:gap-3",
  medium: "gap-2 sm:gap-4 md:gap-6",
  large: "gap-3 sm:gap-6 md:gap-8",
  xl: "gap-4 sm:gap-8 md:gap-12"
};

// Common responsive grid classes
export const responsiveGrid = {
  cols1: "grid-cols-1",
  cols1to2: "grid-cols-1 sm:grid-cols-2",
  cols1to3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  cols1to4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  cols2to4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  cols2to6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
};

// Responsive flex classes
export const responsiveFlex = {
  colToRow: "flex-col sm:flex-row",
  rowToCol: "flex-row sm:flex-col",
  center: "flex items-center justify-center",
  between: "flex items-center justify-between",
  start: "flex items-center justify-start",
  end: "flex items-center justify-end"
};

// Helper function to combine responsive classes
export const combineClasses = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Helper to check if mobile
export const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768;
};

// Helper to check if desktop
export const isDesktop = () => {
  if (typeof window === 'undefined') return true;
  return window.innerWidth >= 1024;
};