/**
 * Utility functions for preloading critical resources
 * to improve perceived performance
 */

/**
 * Preload images in the background
 * @param urls Array of image URLs to preload
 * @param priority Priority hints for the browser
 */
export function preloadImages(urls: string[], priority: 'high' | 'low' | 'auto' = 'auto'): void {
  if (!urls || urls.length === 0) return;

  // Use requestIdleCallback if available for non-critical preloads
  const preloadFunc = priority === 'high'
    ? (callback: () => void) => setTimeout(callback, 0)
    : window.requestIdleCallback || ((callback: () => void) => setTimeout(callback, 1000));

  preloadFunc(() => {
    urls.forEach(url => {
      if (!url) return;

      const linkEl = document.createElement('link');
      linkEl.rel = 'preload';
      linkEl.as = 'image';
      linkEl.href = url;
      linkEl.fetchPriority = priority;
      
      // Set crossOrigin if it's an external URL
      if (!/^(\/|\.\/|http:\/\/localhost)/.test(url)) {
        linkEl.crossOrigin = 'anonymous';
      }
      
      document.head.appendChild(linkEl);
    });
  });
}

/**
 * Preload a specific route/page in the background
 * @param path The route path to preload
 */
export function preloadRoute(path: string): void {
  if (!path) return;

  // Use requestIdleCallback if available
  const requestIdleCallback = window.requestIdleCallback || ((callback: () => void) => setTimeout(callback, 1000));

  requestIdleCallback(() => {
    try {
      // For production builds, we can preload the chunk
      const preloadLink = document.createElement('link');
      preloadLink.rel = 'prefetch';
      preloadLink.href = path;
      document.head.appendChild(preloadLink);
    } catch (error) {
      console.error('Failed to preload route:', error);
    }
  });
}

/**
 * Prefetch API data in the background and store in cache
 * @param endpoint API endpoint to prefetch
 * @param queryKey Optional query key for React Query cache
 */
export async function prefetchApiData(endpoint: string, queryKey?: string): Promise<void> {
  if (!endpoint) return;

  // Use requestIdleCallback if available
  const requestIdleCallback = window.requestIdleCallback || ((callback: () => void) => setTimeout(callback, 1000));

  return new Promise((resolve) => {
    requestIdleCallback(async () => {
      try {
        // Prefetch the data
        await fetch(endpoint, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'X-Prefetch': 'true'
          }
        });
        resolve();
      } catch (error) {
        console.warn('Failed to prefetch API data:', error);
        resolve();
      }
    });
  });
}

/**
 * Interface for the window object with requestIdleCallback
 */
interface WindowWithIdleCallback extends Window {
  requestIdleCallback?: (
    callback: (deadline: {
      didTimeout: boolean;
      timeRemaining: () => number;
    }) => void,
    options?: { timeout: number }
  ) => number;
}

// Add the requestIdleCallback to the window object
declare global {
  interface Window {
    requestIdleCallback?: (
      callback: (deadline: {
        didTimeout: boolean;
        timeRemaining: () => number;
      }) => void,
      options?: { timeout: number }
    ) => number;
  }
}