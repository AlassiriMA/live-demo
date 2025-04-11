import { useState, useEffect } from 'react';

/**
 * Hook to check if an image exists at a given URL before trying to load it
 * @param imageSrc Source URL of the image to check
 * @param fallbackSrc Optional fallback image source if the primary source fails
 * @returns Object containing the final image source after checks and loading state
 */
export function useImageExists(imageSrc: string, fallbackSrc: string = '/assets/images/placeholder-image.svg') {
  const [imgSrc, setImgSrc] = useState<string>(imageSrc);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    setIsLoading(true);
    
    // Reset to the original source when it changes
    setImgSrc(imageSrc);
    
    // Create an image object to test loading
    const img = new Image();
    
    img.onload = () => {
      setIsLoading(false);
    };
    
    img.onerror = () => {
      console.log(`Image failed to load:`, imageSrc);
      setImgSrc(fallbackSrc);
      setIsLoading(false);
    };
    
    img.src = imageSrc;
    
    return () => {
      // Clean up
      img.onload = null;
      img.onerror = null;
    };
  }, [imageSrc, fallbackSrc]);
  
  return { imgSrc, isLoading };
}