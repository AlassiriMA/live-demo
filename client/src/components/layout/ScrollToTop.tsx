import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { ArrowUp } from 'lucide-react';
import { debounce } from '@/lib/performanceUtils';
import useViewport from '@/hooks/useViewport';

/**
 * Enhanced ScrollToTop component that:
 * - Automatically scrolls to the top when route changes
 * - Shows a back-to-top button on long pages
 * - Is optimized for mobile devices
 * - Uses smooth scrolling with fallbacks for Safari
 * - Only renders when needed
 */
export default function ScrollToTop() {
  const [location] = useLocation();
  const [showButton, setShowButton] = useState(false);
  const { isMobile } = useViewport();
  
  // Scroll to top when route changes
  useEffect(() => {
    // Use requestAnimationFrame for smoother scrolling
    window.requestAnimationFrame(() => {
      const supportsNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;
      
      if (supportsNativeSmoothScroll) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Fallback for browsers that don't support smooth scrolling
        window.scrollTo(0, 0);
      }
    });
  }, [location]);
  
  // Show button when scrolled down
  useEffect(() => {
    // Determine when to show the back-to-top button
    const handleScroll = debounce(() => {
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      // Show button when scrolled down 40% of viewport height
      setShowButton(scrollPosition > viewportHeight * 0.4);
    }, 100);
    
    window.addEventListener('scroll', handleScroll);
    
    // Run once on mount to set initial state
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Scroll to top handler
  const scrollToTop = () => {
    const supportsNativeSmoothScroll = 'scrollBehavior' in document.documentElement.style;
    
    if (supportsNativeSmoothScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Fallback smooth scroll implementation
      const duration = 500; // ms
      const start = window.scrollY;
      const startTime = performance.now();
      
      const animateScroll = (timestamp: number) => {
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Use easeInOutQuad easing function
        const easeProgress = progress < 0.5
          ? 2 * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
          
        window.scrollTo(0, start * (1 - easeProgress));
        
        if (progress < 1) {
          window.requestAnimationFrame(animateScroll);
        }
      };
      
      window.requestAnimationFrame(animateScroll);
    }
  };
  
  // Only render button on non-mobile or when specifically enabled on mobile
  if (!showButton) {
    return null;
  }
  
  // Render the back-to-top button
  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-50 p-3 bg-primary text-white rounded-full shadow-lg transition-all duration-300 hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      style={{
        opacity: showButton ? 1 : 0,
        transform: showButton ? 'scale(1)' : 'scale(0.8)',
        // Position differently on mobile
        bottom: isMobile ? '80px' : '24px',
        right: isMobile ? '16px' : '24px',
      }}
      aria-label="Scroll to top"
    >
      <ArrowUp size={20} />
    </button>
  );
}