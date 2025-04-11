/**
 * Utility functions to improve JavaScript execution performance
 */

/**
 * A debounce function that limits how often a function can be called
 * @param func The function to debounce
 * @param wait Wait time in milliseconds
 * @param immediate Whether to call the function immediately
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number = 100,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(this: any, ...args: Parameters<T>): void {
    const context = this;
    
    const later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(later, wait);
    
    if (callNow) {
      func.apply(context, args);
    }
  };
}

/**
 * A throttle function that ensures a function is called at most once per specified period
 * @param func The function to throttle
 * @param limit Limit in milliseconds
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T, 
  limit: number = 100
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  let lastFunc: ReturnType<typeof setTimeout>;
  let lastRan: number;
  
  return function(this: any, ...args: Parameters<T>): void {
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      lastRan = Date.now();
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}

/**
 * Group multiple DOM operations to minimize layout thrashing
 * @param callback Function containing DOM read/write operations
 */
export function batchDomOperations(callback: () => void): void {
  // Request animation frame for smoothness
  window.requestAnimationFrame(() => {
    const startTime = performance.now();
    
    // Call the function containing DOM operations
    callback();
    
    // Log performance in development
    if (import.meta.env.DEV) {
      const duration = performance.now() - startTime;
      if (duration > 16.67) { // More than one frame (60fps)
        console.warn(`DOM operation took ${duration.toFixed(2)}ms, which may cause jank`);
      }
    }
  });
}

/**
 * Run non-critical code when the browser is idle
 * @param callback Function to run during idle time
 * @param timeout Maximum time to wait before forcing execution
 */
export function runWhenIdle(callback: () => void, timeout: number = 2000): void {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(
      () => {
        callback();
      },
      { timeout }
    );
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(callback, 1);
  }
}

/**
 * Preconnect to origins early to speed up future requests
 * @param origins Array of origins to preconnect to
 */
export function preconnectToOrigins(origins: string[]): void {
  if (!origins || !origins.length) return;
  
  origins.forEach(origin => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
    
    // Also add DNS prefetch as a fallback
    const dnsLink = document.createElement('link');
    dnsLink.rel = 'dns-prefetch';
    dnsLink.href = origin;
    document.head.appendChild(dnsLink);
  });
}

/**
 * Measure execution time of a function
 * @param fn Function to measure
 * @param label Label for the console output
 */
export function measurePerformance<T extends (...args: any[]) => any>(
  fn: T,
  label: string
): (...args: Parameters<T>) => ReturnType<T> {
  return function(this: any, ...args: Parameters<T>): ReturnType<T> {
    const start = performance.now();
    const result = fn.apply(this, args);
    const end = performance.now();
    const duration = end - start;
    
    // Only log in development
    if (import.meta.env.DEV) {
      console.log(`${label} took ${duration.toFixed(2)}ms`);
    }
    
    return result;
  };
}