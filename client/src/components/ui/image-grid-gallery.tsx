import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ImagePreviewModal } from './image-preview-modal';
import { ZoomIn } from 'lucide-react';

type Image = {
  src: string;
  alt: string;
  caption?: string;
  aspectRatio?: 'square' | 'landscape' | 'portrait';
  span?: boolean;
};

interface ImageGridGalleryProps {
  images: Image[];
  gridCols?: 2 | 3 | 4;
  className?: string;
  aspectRatio?: 'square' | 'landscape' | 'portrait';
  enablePreview?: boolean;
  gap?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
}

export function ImageGridGallery({
  images,
  gridCols = 3,
  className = '',
  aspectRatio = 'landscape',
  enablePreview = true,
  gap = 'md',
  rounded = 'md'
}: ImageGridGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Handle gap class
  const gapClass = 
    gap === 'none' ? 'gap-0' :
    gap === 'sm' ? 'gap-2' :
    gap === 'lg' ? 'gap-6' :
    'gap-4'; // md - default

  // Handle rounded class
  const roundedClass = 
    rounded === 'none' ? 'rounded-none' :
    rounded === 'sm' ? 'rounded-sm' :
    rounded === 'lg' ? 'rounded-lg' :
    rounded === 'full' ? 'rounded-full' :
    'rounded-md'; // md - default

  // Handle grid columns class
  const gridColsClass = 
    gridCols === 2 ? 'grid-cols-1 sm:grid-cols-2' :
    gridCols === 4 ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' :
    'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'; // 3 - default

  // Open modal with clicked image
  const openModal = (index: number) => {
    if (enablePreview) {
      setCurrentImageIndex(index);
      setIsModalOpen(true);
    }
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className={`grid ${gridColsClass} ${gapClass} ${className}`}>
        {images.map((image, index) => {
          // Determine if this image spans multiple columns
          const spanClass = image.span ? 'md:col-span-2 row-span-2' : '';
          
          // Use image's aspect ratio or fallback to prop default
          const imageRatio = image.aspectRatio || aspectRatio;
          const aspectRatioClass = 
            imageRatio === 'square' ? 'aspect-square' :
            imageRatio === 'portrait' ? 'aspect-[3/4]' :
            'aspect-[4/3]'; // landscape - default
          
          return (
            <motion.div
              key={index}
              className={`group relative overflow-hidden ${roundedClass} ${spanClass} shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] cursor-pointer`}
              whileHover={{ y: -5 }}
              onClick={() => openModal(index)}
            >
              <div className={`w-full ${aspectRatioClass} bg-gray-100 overflow-hidden`}>
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    // Replace with a default placeholder if image fails to load
                    (e.target as HTMLImageElement).src = '/assets/images/projects/generated/placeholder.svg';
                  }}
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-0 group-hover:scale-100">
                    <ZoomIn className="w-6 h-6 text-white" />
                  </div>
                  
                  {image.caption && (
                    <div className="text-white text-sm sm:text-base font-medium mb-1 transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-100">
                      {image.caption}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Image preview modal */}
      {enablePreview && (
        <ImagePreviewModal
          isOpen={isModalOpen}
          images={images}
          initialIndex={currentImageIndex}
          onClose={closeModal}
        />
      )}
    </>
  );
}