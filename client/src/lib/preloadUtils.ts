/**
 * Utilities for preloading resources and optimizing perceived performance
 */

/**
 * Image preloading quality levels
 */
export enum PreloadQuality {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

/**
 * Preload an array of images
 * @param urls Array of image URLs to preload
 * @param quality Quality of preload ('high', 'medium', 'low')
 * @param callback Optional callback when all images are loaded
 */
export function preloadImages(
  urls: string[],
  quality: 'high' | 'medium' | 'low' = 'high',
  callback?: () => void
): void {
  if (!urls || urls.length === 0) return;
  
  // Track loaded images for callback
  let loadedCount = 0;
  const totalImages = urls.length;
  
  // Determine loading strategy based on quality
  const loadImmediately = quality === 'high';
  const loadWithDelay = quality === 'medium';
  const loadWhenIdle = quality === 'low';
  
  // Function to handle image loading
  const loadImage = (url: string) => {
    const img = new Image();
    
    img.onload = img.onerror = () => {
      loadedCount++;
      if (loadedCount === totalImages && callback) {
        callback();
      }
    };
    
    img.src = url;
  };
  
  // Execute preloading based on quality
  if (loadImmediately) {
    // Load all images immediately
    urls.forEach(loadImage);
  } else if (loadWithDelay) {
    // Load images with staggered delays
    urls.forEach((url, index) => {
      setTimeout(() => loadImage(url), index * 100);
    });
  } else if (loadWhenIdle) {
    // Load images during idle time
    if ('requestIdleCallback' in window) {
      let currentIndex = 0;
      const loadNextBatch = (deadline: IdleDeadline) => {
        while (
          (deadline.timeRemaining() > 0 || deadline.didTimeout) &&
          currentIndex < urls.length
        ) {
          loadImage(urls[currentIndex]);
          currentIndex++;
        }
        
        if (currentIndex < urls.length) {
          requestIdleCallback(loadNextBatch, { timeout: 1000 });
        }
      };
      
      requestIdleCallback(loadNextBatch, { timeout: 1000 });
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(() => urls.forEach(loadImage), 200);
    }
  }
}

/**
 * Preconnect to specified origins to establish early connections
 * @param origins Array of origins to preconnect to
 */
export function preconnectToOrigins(origins: string[]): void {
  if (!origins || origins.length === 0 || typeof document === 'undefined') return;
  
  origins.forEach((origin) => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = origin;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
  });
}

/**
 * Add DNS prefetch hint for origins
 * @param origins Array of origins to prefetch DNS for
 */
export function dnsPrefetch(origins: string[]): void {
  if (!origins || origins.length === 0 || typeof document === 'undefined') return;
  
  origins.forEach((origin) => {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = origin;
    document.head.appendChild(link);
  });
}

/**
 * Prefetch resources that might be needed soon
 * @param urls Array of URLs to prefetch
 */
export function prefetchResources(urls: string[]): void {
  if (!urls || urls.length === 0 || typeof document === 'undefined') return;
  
  urls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Prerender specific pages that are likely to be visited next
 * @param urls Array of URLs to prerender
 * @warning Use sparingly as this is resource-intensive
 */
export function prerenderPages(urls: string[]): void {
  if (!urls || urls.length === 0 || typeof document === 'undefined') return;
  
  urls.forEach((url) => {
    const link = document.createElement('link');
    link.rel = 'prerender';
    link.href = url;
    document.head.appendChild(link);
  });
}

// TypeScript declaration for requestIdleCallback
interface IdleDeadline {
  didTimeout: boolean;
  timeRemaining: () => number;
}

interface RequestIdleCallbackOptions {
  timeout?: number;
}

// Add type definitions for requestIdleCallback if not defined
declare global {
  interface Window {
    requestIdleCallback?: (
      callback: (deadline: IdleDeadline) => void,
      options?: RequestIdleCallbackOptions
    ) => number;
    cancelIdleCallback?: (handle: number) => void;
  }
}

export default {
  preloadImages,
  preconnectToOrigins,
  dnsPrefetch,
  prefetchResources,
  prerenderPages,
};