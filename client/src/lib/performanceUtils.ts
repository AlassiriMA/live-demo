/**
 * Collection of performance utilities for optimizing the application
 * Includes functions for:
 * - Debouncing and throttling
 * - Resource loading prioritization
 * - Performance metrics
 * - DOM operation batching
 */

/**
 * Debounce a function to limit how often it can be called
 * @param fn The function to debounce
 * @param delay Milliseconds to wait before executing
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Throttle a function to execute at most once per specified time period
 * @param fn The function to throttle
 * @param limit Milliseconds to wait between executions
 * @returns Throttled function
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  let lastArgs: Parameters<T> | null = null;
  
  return function(...args: Parameters<T>) {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
        if (lastArgs) {
          const currentArgs = lastArgs;
          lastArgs = null;
          fn(...currentArgs);
        }
      }, limit);
    } else {
      lastArgs = args;
    }
  };
}

/**
 * Batch multiple DOM operations to be processed in the next animation frame
 * @param callback Function containing DOM operations to batch
 */
export function batchDOMUpdates(callback: () => void): void {
  if (typeof requestAnimationFrame !== 'undefined') {
    requestAnimationFrame(() => {
      callback();
    });
  } else {
    // Fallback for environments without requestAnimationFrame
    setTimeout(callback, 0);
  }
}

/**
 * Measure the execution time of a function
 * @param fn Function to measure
 * @param name Optional name for logging
 * @returns Function with same signature as fn that measures execution time
 */
export function measurePerformance<T extends (...args: any[]) => any>(
  fn: T,
  name = 'Function'
): (...args: Parameters<T>) => ReturnType<T> {
  return function(...args: Parameters<T>): ReturnType<T> {
    const start = performance.now();
    const result = fn(...args);
    const end = performance.now();
    
    // Log timing information
    console.debug(`${name} executed in ${(end - start).toFixed(2)}ms`);
    
    return result;
  };
}

/**
 * Get page load metrics
 * @returns Object containing various page load metrics
 */
export function getPageLoadMetrics() {
  if (typeof window === 'undefined' || !window.performance) {
    return { pageLoadTime: 0 };
  }
  
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paintMetrics = performance.getEntriesByType('paint');
  
  // Find specific paint metrics
  const firstPaint = paintMetrics.find(metric => metric.name === 'first-paint');
  const firstContentfulPaint = paintMetrics.find(metric => metric.name === 'first-contentful-paint');
  
  return {
    pageLoadTime: navigation ? navigation.loadEventEnd - navigation.startTime : 0,
    domInteractive: navigation ? navigation.domInteractive - navigation.startTime : 0,
    domContentLoaded: navigation ? navigation.domContentLoadedEventEnd - navigation.startTime : 0,
    firstPaint: firstPaint ? firstPaint.startTime : 0,
    firstContentfulPaint: firstContentfulPaint ? firstContentfulPaint.startTime : 0
  };
}

/**
 * Log page load metrics to console for development
 */
export function logPageLoadMetrics(): void {
  if (typeof window === 'undefined' || !window.performance) return;
  
  // Wait for all resources to finish loading
  window.addEventListener('load', () => {
    // Give a small delay to ensure metrics are ready
    setTimeout(() => {
      const metrics = getPageLoadMetrics();
      console.log(`Page load time: ${Math.round(metrics.pageLoadTime)}ms`);
      
      // Log detailed metrics in development
      if (process.env.NODE_ENV === 'development') {
        console.debug('Performance metrics:', {
          domInteractive: `${Math.round(metrics.domInteractive || 0)}ms`,
          domContentLoaded: `${Math.round(metrics.domContentLoaded || 0)}ms`,
          firstPaint: `${Math.round(metrics.firstPaint || 0)}ms`,
          firstContentfulPaint: `${Math.round(metrics.firstContentfulPaint || 0)}ms`
        });
      }
    }, 100);
  });
}

/**
 * Queue a function to run when the browser is idle
 * @param callback Function to run during idle time
 * @param options Options for idle callback
 */
export function runWhenIdle(
  callback: () => void,
  options: { timeout?: number } = {}
): void {
  if (typeof window === 'undefined') return;
  
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback, options);
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(callback, options.timeout || 1);
  }
}

export default {
  debounce,
  throttle,
  batchDOMUpdates,
  measurePerformance,
  getPageLoadMetrics,
  logPageLoadMetrics,
  runWhenIdle
};