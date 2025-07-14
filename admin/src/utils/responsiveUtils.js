/**
 * Responsive utility functions and constants for consistent styling
 */

// Common responsive padding classes
export const responsivePadding = {
  container: "px-2 sm:px-4 md:px-6 py-3 sm:py-4 md:py-6",
  card: "p-3 sm:p-4 md:p-6",
  button: "px-3 sm:px-4 py-1.5 sm:py-2",
  table: "px-2 sm:px-4 md:px-6 py-2 sm:py-4"
};

// Common responsive margin classes
export const responsiveMargin = {
  section: "mt-4 sm:mt-6 md:mt-8",
  element: "mt-3 sm:mt-4",
  bottom: "mb-3 sm:mb-4 md:mb-6"
};

// Common responsive text size classes
export const responsiveText = {
  heading: "text-xl sm:text-2xl md:text-3xl",
  subheading: "text-lg sm:text-xl font-semibold",
  body: "text-sm sm:text-base",
  small: "text-xs sm:text-sm"
};

// Common responsive gap classes
export const responsiveGap = {
  small: "gap-1 sm:gap-2",
  medium: "gap-2 sm:gap-4",
  large: "gap-3 sm:gap-6"
};

// Common responsive grid classes
export const responsiveGrid = {
  cols1to2: "grid-cols-1 sm:grid-cols-2",
  cols1to3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
  cols1to4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
};

// Helper function to combine responsive classes
export const combineClasses = (...classes) => {
  return classes.filter(Boolean).join(' ');
};