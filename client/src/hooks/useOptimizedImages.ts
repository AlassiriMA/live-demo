import { useState, useEffect } from 'react';
import { getAdaptiveImageQuality, hasFastConnection } from '@/lib/networkUtils';

interface OptimizedImageOptions {
  disableOptimization?: boolean;
  defaultQuality?: number;
  placeholderUrl?: string;
  lowQualityUrl?: string;
  baseUrl?: string;
}

/**
 * Hook to handle optimized image loading based on network conditions
 * - Provides image sources optimized for current network conditions
 * - Handles loading state and errors
 * - Supports low-quality image placeholders
 * - Can fall back to different quality images based on network speed
 */
export function useOptimizedImages(
  originalImageUrls: string[],
  options: OptimizedImageOptions = {}
) {
  const {
    disableOptimization = false,
    defaultQuality = 85,
    placeholderUrl = '/assets/images/placeholder-image.svg',
    lowQualityUrl,
    baseUrl = ''
  } = options;
  
  const [optimizedUrls, setOptimizedUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedCount, setLoadedCount] = useState(0);
  const [hasError, setHasError] = useState(false);
  
  // Effect to optimize images based on network conditions
  useEffect(() => {
    if (!originalImageUrls || originalImageUrls.length === 0) {
      setOptimizedUrls([]);
      setIsLoading(false);
      return;
    }
    
    // Skip optimization if disabled
    if (disableOptimization) {
      setOptimizedUrls(originalImageUrls.map(url => baseUrl + url));
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setLoadedCount(0);
    
    // Get connection quality
    const isFastConnection = hasFastConnection();
    const quality = getAdaptiveImageQuality(defaultQuality);
    
    // Create optimized URLs
    const urls = originalImageUrls.map(originalUrl => {
      // If it's not a fast connection and we have a low quality URL, use it
      if (!isFastConnection && lowQualityUrl && originalUrl !== lowQualityUrl) {
        return lowQualityUrl;
      }
      
      // Otherwise use the original URL
      return baseUrl + originalUrl;
    });
    
    setOptimizedUrls(urls);
    
    // Preload the images
    const preloadImages = () => {
      urls.forEach(url => {
        const img = new Image();
        img.onload = () => {
          setLoadedCount(prev => {
            const newCount = prev + 1;
            if (newCount >= urls.length) {
              setIsLoading(false);
            }
            return newCount;
          });
        };
        
        img.onerror = () => {
          setHasError(true);
          setIsLoading(false);
        };
        
        img.src = url;
      });
    };
    
    preloadImages();
    
    // Cleanup
    return () => {
      setOptimizedUrls([]);
      setIsLoading(true);
      setLoadedCount(0);
      setHasError(false);
    };
  }, [originalImageUrls, disableOptimization, defaultQuality, lowQualityUrl, baseUrl]);
  
  // Return optimized URLs and loading state
  return {
    optimizedUrls,
    isLoading,
    progress: originalImageUrls.length > 0 ? loadedCount / originalImageUrls.length : 0,
    hasError,
    placeholderUrl
  };
}

export default useOptimizedImages;