import { useEffect } from 'react';
import { useLocation } from 'react-router';

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls the window to the top (x=0, y=0)
  }, [location.pathname, location.search]); // Re-run effect whenever the location changes

  return null; // This component doesn't render anything visually
}; export default ScrollToTop;