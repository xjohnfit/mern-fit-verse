import { useEffect } from 'react';
import { useLocation } from 'react-router';

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Try multiple scroll methods to ensure it works
    window.scrollTo(0, 0);
    document.documentElement.scrollTo(0, 0);
    document.body.scrollTo(0, 0);

    // Also set scrollTop directly as a fallback
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname]);

  return null;
};

export default ScrollToTop;