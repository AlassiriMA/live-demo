import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import ImageWithFallback from './ImageWithFallback';

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

interface ImageGridGalleryProps {
  images: GalleryImage[];
  columns?: 1 | 2 | 3 | 4;
  gap?: 'none' | 'small' | 'medium' | 'large';
  aspectRatio?: 'auto' | 'square' | 'video' | 'wide';
  rounded?: 'none' | 'small' | 'medium' | 'large';
  lightboxEnabled?: boolean;
}

export function ImageGridGallery({
  images,
  columns = 2,
  gap = 'medium',
  aspectRatio = 'auto',
  rounded = 'medium',
  lightboxEnabled = true,
}: ImageGridGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(false);

  // Early return if no images
  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 text-center text-gray-500">
        No screenshots available
      </div>
    );
  }

  // Memoize class mappings to prevent recalculation on every render
  const { gapClasses, columnClasses, aspectRatioClasses, roundedClasses } = useMemo(() => {
    return {
      gapClasses: {
        none: 'gap-0',
        small: 'gap-2',
        medium: 'gap-4',
        large: 'gap-6',
      },
      columnClasses: {
        1: 'grid-cols-1',
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
      },
      aspectRatioClasses: {
        auto: '',
        square: 'aspect-square',
        video: 'aspect-video',
        wide: 'aspect-[16/9]',
      },
      roundedClasses: {
        none: 'rounded-none',
        small: 'rounded-sm',
        medium: 'rounded-lg',
        large: 'rounded-xl',
      }
    };
  }, []);

  const openLightbox = useCallback((index: number) => {
    if (lightboxEnabled) {
      setCurrentImageIndex(index);
      setLightboxOpen(true);
      setIsImageLoading(true);
      // Prevent body scrolling when lightbox is open
      document.body.style.overflow = 'hidden';
    }
  }, [lightboxEnabled]);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    // Re-enable body scrolling
    document.body.style.overflow = '';
  }, []);

  const goToPrevious = useCallback(() => {
    setIsImageLoading(true);
    setCurrentImageIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : images.length - 1));
  }, [images.length]);

  const goToNext = useCallback(() => {
    setIsImageLoading(true);
    setCurrentImageIndex((prevIndex) => (prevIndex < images.length - 1 ? prevIndex + 1 : 0));
  }, [images.length]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      goToPrevious();
    } else if (e.key === 'ArrowRight') {
      goToNext();
    } else if (e.key === 'Escape') {
      closeLightbox();
    }
  }, [goToPrevious, goToNext, closeLightbox]);

  const handleImageLoad = useCallback(() => {
    setIsImageLoading(false);
  }, []);

  // Render thumbnail grid
  const renderThumbnails = () => (
    <div className={`grid ${columnClasses[columns]} ${gapClasses[gap]}`}>
      {images.map((image, index) => {
        // Only set priority loading for first 4 images
        const isPriority = index < 4;

        return (
          <motion.div
            key={index}
            className={`group relative ${aspectRatioClasses[aspectRatio]} overflow-hidden ${roundedClasses[rounded]} border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
            whileHover={{ scale: 1.02 }}
            onClick={() => openLightbox(index)}
          >
            <div className="relative h-full w-full">
              <ImageWithFallback
                src={image.src}
                alt={image.alt}
                className={`h-full w-full object-cover ${
                  lightboxEnabled ? 'cursor-pointer' : ''
                }`}
                fallbackSrc="/assets/images/placeholder-image.svg"
                width={image.width}
                height={image.height}
                priority={isPriority}
                sizes={`(max-width: 640px) 100vw, (max-width: 768px) 50vw, ${columns === 1 ? '100vw' : columns === 2 ? '50vw' : columns === 3 ? '33vw' : '25vw'}`}
              />
              {lightboxEnabled && (
                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <ZoomIn className="h-8 w-8 text-white" />
                </div>
              )}
            </div>
            {image.caption && (
              <div className="p-3 bg-gray-50">
                <p className="font-medium text-gray-700 text-sm">{image.caption}</p>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
  
  // Render lightbox when opened
  const renderLightbox = () => {
    if (!lightboxOpen) return null;
    
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
        onClick={closeLightbox}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <div
          className="absolute top-4 right-4 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <Button
            variant="outline"
            size="icon"
            className="bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800 hover:text-white rounded-full"
            onClick={closeLightbox}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative max-w-5xl w-full h-full flex items-center justify-center">
          {isImageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
            </div>
          )}
          
          <motion.img
            key={`lightbox-${currentImageIndex}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            src={images[currentImageIndex]?.src}
            alt={images[currentImageIndex]?.alt}
            className="max-h-[85vh] max-w-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
            onLoad={handleImageLoad}
            onError={(e) => {
              setIsImageLoading(false);
              console.warn(`Failed to load lightbox image: ${images[currentImageIndex]?.src}`);
              e.currentTarget.src = '/assets/images/placeholder-image.svg';
              e.currentTarget.alt = (images[currentImageIndex]?.alt || 'Image') + ' (unavailable)';
            }}
            loading="eager"
          />

          {images.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 transform -translate-y-1/2 top-1/2 bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800 hover:text-white rounded-full sm:left-4"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 transform -translate-y-1/2 top-1/2 bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800 hover:text-white rounded-full sm:right-4"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          {images[currentImageIndex]?.caption && (
            <div
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/70 text-white px-4 py-2 rounded-lg max-w-md text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <p>{images[currentImageIndex].caption}</p>
            </div>
          )}

          <div className="absolute bottom-4 right-4">
            <Button
              variant="outline"
              size="sm"
              className="bg-gray-900/50 border-gray-700 text-white hover:bg-gray-800 hover:text-white rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                const link = document.createElement('a');
                link.href = images[currentImageIndex]?.src;
                link.download = images[currentImageIndex]?.alt || 'image';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              <Download className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Download</span>
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex gap-2 justify-center flex-wrap max-w-full px-4">
            {images.map((_, idx) => (
              <button
                key={idx}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentImageIndex ? 'bg-white scale-125' : 'bg-gray-500'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsImageLoading(true);
                  setCurrentImageIndex(idx);
                }}
                aria-label={`View image ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <>
      {renderThumbnails()}
      <AnimatePresence>
        {lightboxOpen && renderLightbox()}
      </AnimatePresence>
    </>
  );
}

export default ImageGridGallery;