import { useState } from 'react';
import { useImageExists } from '@/hooks/use-image-exists';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

export function ImageWithFallback({
  src,
  alt,
  fallbackSrc = '/assets/images/placeholder-image.svg',
  className,
  ...props
}: ImageWithFallbackProps) {
  const { imgSrc, isLoading } = useImageExists(src || '', fallbackSrc);
  
  return (
    <>
      {isLoading && (
        <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 ${className}`} />
      )}
      <img
        src={imgSrc}
        alt={alt}
        className={`${isLoading ? 'opacity-0 absolute' : 'opacity-100'} ${className}`}
        {...props}
      />
    </>
  );
}