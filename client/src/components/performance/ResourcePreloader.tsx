import { useEffect, ReactNode } from 'react';
import { preloadImages, preloadRoute, prefetchApiData } from '@/lib/preloadUtils';
import { runWhenIdle, preconnectToOrigins } from '@/lib/performanceUtils';

interface ResourcePreloaderProps {
  children?: ReactNode;
  images?: string[];
  routes?: string[];
  apiEndpoints?: string[];
  origins?: string[];
  enabled?: boolean;
}

/**
 * Component that preloads resources for better performance
 * - Runs during idle time to avoid impacting initial render
 * - Can preload images, routes, API data, and preconnect to origins
 * - Only runs in production by default
 */
export function ResourcePreloader({
  children,
  images = [],
  routes = [],
  apiEndpoints = [],
  origins = [],
  enabled = import.meta.env.PROD
}: ResourcePreloaderProps) {
  useEffect(() => {
    // Skip if disabled or no resources to preload
    if (
      !enabled ||
      (images.length === 0 && routes.length === 0 && apiEndpoints.length === 0 && origins.length === 0)
    ) {
      return;
    }

    // Run during idle time to avoid impacting critical rendering
    runWhenIdle(() => {
      // Preconnect to origins first for better performance
      if (origins.length > 0) {
        preconnectToOrigins(origins);
      }

      // Preload critical images with high priority
      if (images.length > 0) {
        // First 3 images get high priority, rest get low
        const highPriorityImages = images.slice(0, 3);
        const lowPriorityImages = images.slice(3);
        
        if (highPriorityImages.length > 0) {
          preloadImages(highPriorityImages, 'high');
        }
        
        if (lowPriorityImages.length > 0) {
          preloadImages(lowPriorityImages, 'low');
        }
      }

      // Preload routes
      if (routes.length > 0) {
        routes.forEach(route => {
          preloadRoute(route);
        });
      }

      // Prefetch API data
      if (apiEndpoints.length > 0) {
        apiEndpoints.forEach(endpoint => {
          prefetchApiData(endpoint);
        });
      }
    });
  }, [enabled, images, routes, apiEndpoints, origins]);

  return children || null;
}

export default ResourcePreloader;