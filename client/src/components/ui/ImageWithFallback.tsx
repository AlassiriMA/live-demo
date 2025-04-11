import { useState, useEffect } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Image component that handles loading failures with a fallback image
 */
export const ImageWithFallback = ({
  src,
  alt,
  fallbackSrc = "/assets/images/fallback-image.jpg",
  className = "",
  style = {},
}: ImageWithFallbackProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Reset state if src prop changes
  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className={className}
      style={style}
      loading="lazy"
    />
  );
};

/**
 * Hook to check if an image exists at the given URL
 */
export const useImageExists = (url: string): boolean => {
  const [exists, setExists] = useState(true);

  useEffect(() => {
    if (!url) {
      setExists(false);
      return;
    }

    const img = new Image();
    img.onload = () => setExists(true);
    img.onerror = () => setExists(false);
    img.src = url;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [url]);

  return exists;
};

export default ImageWithFallback;