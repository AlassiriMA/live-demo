import { useState, useEffect } from 'react';
import { throttle } from '@/lib/performanceUtils';

export interface ViewportDimensions {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  orientation: 'portrait' | 'landscape';
}

/**
 * A hook that provides viewport dimensions and responsive breakpoints
 * - Includes Tailwind's default breakpoints for consistency
 * - Provides orientation detection
 * - Uses performance-optimized resize handler with throttling
 */
export function useViewport(): ViewportDimensions {
  // Define breakpoints matching Tailwind's defaults
  const BREAKPOINTS = {
    sm: 640,   // Small - Mobile
    md: 768,   // Medium - Tablet
    lg: 1024,  // Large - Desktop
    xl: 1280,  // Extra Large - Large Desktop
    '2xl': 1536 // 2X Large - Extra Large Desktop
  };
  
  // Default dimensions on server/initial render
  const [dimensions, setDimensions] = useState<ViewportDimensions>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024, 
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isLargeDesktop: false,
    orientation: 'landscape'
  });
  
  // Update the state when window resizes
  useEffect(() => {
    // Skip if we're not in a browser environment
    if (typeof window === 'undefined') return;
    
    // Handler to update dimensions
    const handleResize = throttle(() => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setDimensions({
        width,
        height,
        isMobile: width < BREAKPOINTS.md,
        isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
        isDesktop: width >= BREAKPOINTS.lg && width < BREAKPOINTS.xl,
        isLargeDesktop: width >= BREAKPOINTS.xl,
        orientation: width > height ? 'landscape' : 'portrait'
      });
    }, 100);
    
    // Run once immediately to set initial state correctly
    handleResize();
    
    // Add event listener with throttle to avoid excessive updates
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return dimensions;
}

/**
 * A utility hook that returns a boolean indicating if the current viewport matches a breakpoint
 * 
 * @param query The breakpoint query to check: 'sm', 'md', 'lg', 'xl', or '2xl'
 * @param operator The comparison operator: 'up' (>=), 'down' (<), or 'only' (between this and next breakpoint)
 */
export function useBreakpoint(
  query: 'sm' | 'md' | 'lg' | 'xl' | '2xl',
  operator: 'up' | 'down' | 'only' = 'up'
): boolean {
  const { width } = useViewport();
  
  // Define breakpoints matching Tailwind's defaults
  const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536
  };
  
  // Define the next breakpoint for 'only' operator
  const NEXT_BREAKPOINT: Record<string, keyof typeof BREAKPOINTS | null> = {
    sm: 'md',
    md: 'lg',
    lg: 'xl',
    xl: '2xl',
    '2xl': null
  };
  
  // Return boolean based on operator
  switch (operator) {
    case 'up':
      return width >= BREAKPOINTS[query];
    case 'down':
      return width < BREAKPOINTS[query];
    case 'only': {
      const nextBreakpoint = NEXT_BREAKPOINT[query];
      return width >= BREAKPOINTS[query] && (nextBreakpoint ? width < BREAKPOINTS[nextBreakpoint] : true);
    }
    default:
      return false;
  }
}

export default useViewport;