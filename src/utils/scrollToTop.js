/**
 * Utility function to scroll to the top of the page
 * @param {Object} options - Scroll options
 * @param {number} options.top - The number of pixels to scroll to (default: 0)
 * @param {number} options.left - The number of pixels to scroll left (default: 0)
 * @param {'auto' | 'smooth' | 'instant'} options.behavior - The scroll behavior (default: 'instant')
 */
export const scrollToTop = (options = {}) => {
  const { top = 0, left = 0, behavior = 'instant' } = options;
  
  if (behavior === 'instant') {
    // Use the faster method for instant scroll
    window.scrollTo(left, top);
  } else {
    // Use the options object for smooth scrolling
    window.scrollTo({
      top,
      left,
      behavior
    });
  }
};

/**
 * Custom hook to handle navigation with scroll to top
 * @param {Function} navigate - React Router's navigate function
 * @param {Object} scrollOptions - Scroll options to pass to scrollToTop
 */
export const useNavigateWithScroll = (navigate, scrollOptions = {}) => {
  return (path, navigateOptions = {}) => {
    scrollToTop(scrollOptions);
    navigate(path, navigateOptions);
  };
};

/**
 * Higher-order function to wrap navigation handlers with scroll to top
 * @param {Function} navigationHandler - The original navigation handler
 * @param {Object} scrollOptions - Scroll options to pass to scrollToTop
 */
export const withScrollToTop = (navigationHandler, scrollOptions = {}) => {
  return (...args) => {
    scrollToTop(scrollOptions);
    return navigationHandler(...args);
  };
};

// Default export for convenience
export default scrollToTop;