import { useState, useEffect } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  style?: React.CSSProperties;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
}

/**
 * Enhanced image component that:
 * - Handles loading failures with a fallback image
 * - Uses lazy loading by default (but allows priority loading)
 * - Supports width, height, and sizes attributes for performance
 * - Uses loading="eager" for above-the-fold images when priority=true
 */
function ImageWithFallback({
  src,
  alt,
  fallbackSrc = "/assets/images/fallback-image.svg",
  className = "",
  style = {},
  width,
  height,
  sizes = "100vw",
  priority = false,
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset state if src prop changes
  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };
  
  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={`relative ${className}`} style={style}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <img
        src={imgSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        style={style}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding={priority ? "sync" : "async"}
      />
    </div>
  );
}

/**
 * Hook to check if an image exists at the given URL
 * Uses AbortController to cancel pending requests when component unmounts
 */
function useImageExists(url: string): boolean {
  const [exists, setExists] = useState(true);

  useEffect(() => {
    if (!url) {
      setExists(false);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    fetch(url, { method: 'HEAD', signal })
      .then(response => {
        if (response.ok) {
          setExists(true);
        } else {
          setExists(false);
        }
      })
      .catch(() => {
        setExists(false);
      });

    return () => {
      controller.abort();
    };
  }, [url]);

  return exists;
}

export { useImageExists };
export default ImageWithFallback;