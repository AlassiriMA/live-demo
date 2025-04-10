import { useEffect } from 'react';
import { useLocation } from 'wouter';

/**
 * A component that automatically scrolls to the top of the page
 * when the route changes.
 */
export default function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    // Scroll to the top of the page when the location changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);
  
  return null; // This component doesn't render anything
}