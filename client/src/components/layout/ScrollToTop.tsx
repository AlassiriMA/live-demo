import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { throttle } from '@/lib/performanceUtils';
import useViewport from '@/hooks/useViewport';

/**
 * A component that scrolls the page to the top when
 * - The route changes
 * - The user clicks the scroll-to-top button
 * 
 * Performance optimized with:
 * - Throttled scroll event handling
 * - Hardware-accelerated animations
 * - Responsive design for all device sizes
 * - Auto-hiding when not needed
 */
const ScrollToTop = () => {
  const [location] = useLocation();
  const [showButton, setShowButton] = useState(false);
  const { isMobile } = useViewport();
  
  // Scroll to top when route changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location]);
  
  // Show button when user scrolls down
  useEffect(() => {
    // Use throttle for better performance
    const handleScroll = throttle(() => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowButton(scrollTop > 300);
    }, 200);
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Adjust size and position for mobile
  const buttonSize = isMobile ? 'h-10 w-10' : 'h-12 w-12';
  const buttonPosition = isMobile ? 'bottom-4 right-4' : 'bottom-8 right-8';
  
  return (
    <AnimatePresence>
      {showButton && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className={`fixed ${buttonPosition} ${buttonSize} rounded-full bg-primary text-white shadow-lg flex items-center justify-center z-50 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-transform will-change-transform`}
          aria-label="Scroll to top"
        >
          <ChevronUp className={isMobile ? 'h-5 w-5' : 'h-6 w-6'} />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;