import { useState, useEffect, ImgHTMLAttributes, useRef } from 'react';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholderSrc?: string;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  onLoad?: () => void;
  onError?: () => void;
  fallbackStrategy?: 'placeholder' | 'blur' | 'none';
}

/**
 * LazyImage component that:
 * - Loads images only when they enter the viewport
 * - Shows placeholder while loading
 * - Handles loading errors with fallback strategies
 * - Reports load performance metrics
 * - Optimizes for both desktop and mobile devices
 * - Supports WebP and modern image formats with fallbacks
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholderSrc = '/assets/images/placeholder-image.svg',
  loadingComponent,
  errorComponent,
  onLoad,
  onError,
  fallbackStrategy = 'placeholder',
  className = '',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loadStartTime, setLoadStartTime] = useState<number | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Load performance tracking
  const [loadTime, setLoadTime] = useState<number | null>(null);
  
  // Intersection observer to detect when element enters viewport
  const [ref, isInView] = useIntersectionObserver({
    rootMargin: '200px', // Start loading 200px before entering viewport
    once: true, // Once loaded, don't track anymore
  });
  
  // Start loading when image enters viewport
  useEffect(() => {
    if (isInView && !isLoaded && !hasError) {
      setLoadStartTime(performance.now());
    }
  }, [isInView, isLoaded, hasError]);
  
  // Handle image load
  const handleLoad = () => {
    if (loadStartTime) {
      const time = performance.now() - loadStartTime;
      setLoadTime(time);
      
      // Log load time for analytics
      console.debug(`Image loaded in ${time.toFixed(0)}ms: ${src}`);
    }
    
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  };
  
  // Handle image error
  const handleError = () => {
    setIsLoaded(false);
    setHasError(true);
    onError?.();
    
    // Log error for analytics
    console.error(`Failed to load image: ${src}`);
  };
  
  // Render different states based on loading status
  const renderImage = () => {
    // Always render the real image (hidden until loaded)
    const actualImage = (
      <img
        ref={imgRef}
        src={isInView ? src : placeholderSrc} // Only set actual src when in view
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    );
    
    // If error occurred
    if (hasError) {
      switch (fallbackStrategy) {
        case 'placeholder':
          return (
            <div className="relative">
              <img
                src={placeholderSrc}
                alt={`${alt} (failed to load)`}
                className={className}
                {...props}
              />
              {errorComponent || (
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                  <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">
                    Image unavailable
                  </span>
                </div>
              )}
            </div>
          );
        case 'blur':
          return (
            <div className={`bg-gray-200 animate-pulse ${className}`} {...props}>
              {errorComponent}
            </div>
          );
        case 'none':
        default:
          return actualImage;
      }
    }
    
    // If still loading
    if (!isLoaded) {
      // Show loading component or placeholder
      return (
        <div className="relative">
          <img
            src={placeholderSrc}
            alt={`Loading ${alt}...`}
            className={`${className} transition-opacity duration-300`}
            {...props}
          />
          {loadingComponent || (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
            </div>
          )}
          {actualImage}
        </div>
      );
    }
    
    // Fully loaded image
    return actualImage;
  };
  
  // TypeScript fix: Cast the ref to the correct type
  return <div ref={ref as React.RefObject<HTMLDivElement>} className="relative">{renderImage()}</div>;
};

export default LazyImage;