import React, { useState, useEffect } from 'react';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import ImageWithFallback from './ImageWithFallback';

interface LazyImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  sizes?: string;
  aspectRatio?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  placeholderColor?: string;
  threshold?: number;
  rootMargin?: string;
  priority?: boolean;
}

/**
 * Lazy-loaded image component that:
 * - Only loads when scrolled into view
 * - Shows a placeholder while loading
 * - Supports aspect ratio and object fit
 * - Uses IntersectionObserver for visibility detection
 * - Falls back to priority loading for critical images
 */
export function LazyImage({
  src,
  alt,
  fallbackSrc = "/assets/images/fallback-image.svg",
  className = "",
  style = {},
  width,
  height,
  sizes = "100vw",
  aspectRatio = "auto",
  objectFit = "cover",
  placeholderColor = "#f3f4f6",
  threshold = 0.1,
  rootMargin = "200px",
  priority = false
}: LazyImageProps) {
  // State to control image visibility
  const [shouldLoad, setShouldLoad] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Intersection observer tracks when the component enters the viewport
  const [ref, isInView] = useIntersectionObserver({
    threshold,
    rootMargin,
    once: true
  });

  // Effect to set loading when element becomes visible
  useEffect(() => {
    if (isInView && !shouldLoad) {
      setShouldLoad(true);
    }
  }, [isInView, shouldLoad]);

  // Combined styles with aspect ratio
  const combinedStyle: React.CSSProperties = {
    ...style,
    aspectRatio: aspectRatio !== 'auto' ? aspectRatio : undefined,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: placeholderColor,
  };

  // Handle image load event
  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div 
      ref={ref} 
      className={`lazy-image-container ${className}`} 
      style={combinedStyle}
    >
      {/* Placeholder shimmer */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse" 
          style={{ 
            backgroundSize: '200% 100%',
            backgroundPosition: 'left',
          }}
        />
      )}
      
      {/* Actual image (only rendered if in view or priority) */}
      {(shouldLoad || priority) && (
        <ImageWithFallback
          src={src}
          alt={alt}
          fallbackSrc={fallbackSrc}
          className={`transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ 
            objectFit,
            width: '100%', 
            height: '100%',
          }}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          onLoad={handleLoad}
        />
      )}
    </div>
  );
}

export default LazyImage;