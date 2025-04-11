import { useState, useEffect, ImgHTMLAttributes } from 'react';
import { hasFastConnection } from '@/lib/networkUtils';
import useViewport from '@/hooks/useViewport';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';

interface ResponsiveImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  srcSmall?: string;
  srcMedium?: string;
  srcLarge?: string;
  srcXLarge?: string;
  fallbackSrc?: string;
  lazyLoad?: boolean;
  rootMargin?: string;
  onImageLoad?: () => void;
  placeholderColor?: string;
  objectFit?: string;
  objectPosition?: string;
  showLoadingIndicator?: boolean;
}

/**
 * A responsive image component that:
 * - Loads appropriate image size based on viewport
 * - Supports lazy loading with intersection observer
 * - Shows proper loading states
 * - Handles errors with fallbacks
 * - Optimizes based on network conditions
 */
const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  srcSmall,
  srcMedium,
  srcLarge,
  srcXLarge,
  fallbackSrc = '/assets/images/fallback-image.svg',
  lazyLoad = true,
  rootMargin = '200px',
  onImageLoad,
  placeholderColor = '#f3f4f6',
  objectFit = 'cover',
  objectPosition = 'center',
  showLoadingIndicator = true,
  className = '',
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const { width } = useViewport();
  const [ref, isInView] = useIntersectionObserver({
    rootMargin,
    once: true,
  });

  // Determine appropriate image source based on viewport width
  useEffect(() => {
    const isFastNet = hasFastConnection();
    
    // If on a slow connection, always use the smallest image
    if (!isFastNet) {
      setImageSrc(srcSmall || src);
      return;
    }
    
    // Otherwise choose based on screen size
    if (width < 640) {
      setImageSrc(srcSmall || src);
    } else if (width < 1024) {
      setImageSrc(srcMedium || srcSmall || src);
    } else if (width < 1536) {
      setImageSrc(srcLarge || srcMedium || srcSmall || src);
    } else {
      setImageSrc(srcXLarge || srcLarge || srcMedium || srcSmall || src);
    }
  }, [width, src, srcSmall, srcMedium, srcLarge, srcXLarge]);

  // Handle image load
  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    onImageLoad?.();
  };

  // Handle image error
  const handleError = () => {
    setHasError(true);
    setImageSrc(fallbackSrc);
  };

  // Only start loading when in view if lazyLoad is true
  const shouldStartLoading = lazyLoad ? isInView : true;

  return (
    <div 
      ref={ref as React.RefObject<HTMLDivElement>} 
      className="relative overflow-hidden"
      style={{ backgroundColor: placeholderColor }}
    >
      {/* Loading indicator */}
      {showLoadingIndicator && shouldStartLoading && !isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Actual image (only set src when in view) */}
      <img
        src={shouldStartLoading ? imageSrc : undefined}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
        style={{ 
          objectFit: objectFit as any,
          objectPosition,
          ...props.style 
        }}
        {...props}
      />
    </div>
  );
};

export default ResponsiveImage;