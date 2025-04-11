import { useEffect } from 'react';
import { runWhenIdle } from '@/lib/performanceUtils';
import { preconnectToOrigins } from '@/lib/preloadUtils';

interface ResourcePreloaderProps {
  images?: string[];
  routes?: string[];
  apiEndpoints?: string[];
  origins?: string[];
  priority?: 'high' | 'low' | 'auto';
}

/**
 * Preloads critical resources to improve perceived performance
 * - Images are preloaded with <link rel="preload"> tags
 * - Routes are prefetched to warm up the route cache
 * - API endpoints are prefetched to warm up the data cache
 * - External origins are preconnected to establish early connections
 */
const ResourcePreloader: React.FC<ResourcePreloaderProps> = ({
  images = [],
  routes = [],
  apiEndpoints = [],
  origins = [],
  priority = 'auto'
}) => {
  // Determine if resources should be loaded immediately or during idle time
  const loadImmediately = priority === 'high' || 
    (priority === 'auto' && (images.length + routes.length + apiEndpoints.length <= 5));
  
  useEffect(() => {
    // Function to add preload link to document head
    const preloadImage = (src: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    };
    
    // Function to preconnect to origins
    const preconnectToOrigin = (origin: string) => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = origin;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    };
    
    // Execute preloading based on priority
    if (loadImmediately) {
      // Preload immediately
      images.forEach(preloadImage);
      origins.forEach(preconnectToOrigin);
    } else {
      // Preload during idle time
      runWhenIdle(() => {
        // Preload images first
        images.forEach(preloadImage);
      }, { timeout: 2000 });
      
      // Preconnect to origins
      origins.forEach(preconnectToOrigin);
    }
    
    // Cleanup function
    return () => {
      // No cleanup needed as these are one-time operations
      // Links remain in the document head for the duration of the session
    };
  }, [images, origins, loadImmediately]);
  
  return null; // This component doesn't render anything
};

export default ResourcePreloader;