import { useState, useEffect } from 'react';

/**
 * Predefined screen size breakpoints (in pixels)
 * These match Tailwind's default breakpoints for consistency
 */
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

export type Breakpoint = keyof typeof breakpoints;

interface ViewportState {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  breakpoint: Breakpoint;
  orientation: 'portrait' | 'landscape';
}

/**
 * Hook that tracks the viewport size and provides responsive helpers
 * Uses performance optimizations like debouncing and RAF to minimize re-renders
 */
function useViewport(): ViewportState {
  // Default to a reasonable desktop size to avoid hydration issues
  const [viewport, setViewport] = useState<ViewportState>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
    isMobile: false,
    isTablet: false, 
    isDesktop: true,
    breakpoint: 'lg',
    orientation: 'landscape'
  });
  
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    // Function to calculate current breakpoint based on width
    const getBreakpoint = (width: number): Breakpoint => {
      if (width < breakpoints.sm) return 'xs';
      if (width < breakpoints.md) return 'sm';
      if (width < breakpoints.lg) return 'md';
      if (width < breakpoints.xl) return 'lg';
      if (width < breakpoints['2xl']) return 'xl';
      return '2xl';
    };
    
    // Use RAF for better performance
    let frameId: number;
    let resizeTimeout: ReturnType<typeof setTimeout>;
    
    // Handle resize with debounce for performance
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      
      // Debounce to avoid too many updates
      resizeTimeout = setTimeout(() => {
        // Use requestAnimationFrame to avoid layout thrashing
        cancelAnimationFrame(frameId);
        frameId = requestAnimationFrame(() => {
          const width = window.innerWidth;
          const height = window.innerHeight;
          const breakpoint = getBreakpoint(width);
          
          setViewport({
            width,
            height,
            isMobile: width < breakpoints.md,
            isTablet: width >= breakpoints.md && width < breakpoints.lg,
            isDesktop: width >= breakpoints.lg,
            breakpoint,
            orientation: width > height ? 'landscape' : 'portrait'
          });
        });
      }, 100); // 100ms debounce
    };
    
    // Set initial values
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      cancelAnimationFrame(frameId);
    };
  }, []);
  
  return viewport;
}

export default useViewport;