import React, { useState, useEffect } from 'react';
import { X, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImagePreviewModalProps {
  isOpen: boolean;
  images: { src: string; alt: string; caption?: string }[];
  initialIndex: number;
  onClose: () => void;
}

export function ImagePreviewModal({ 
  isOpen, 
  images, 
  initialIndex = 0, 
  onClose 
}: ImagePreviewModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  
  // Reset state when modal opens or index changes
  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }, [initialIndex, isOpen]);

  if (!images || images.length === 0) return null;
  if (!isOpen) return null;

  const currentImage = images[currentIndex];
  
  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrev();
    if (e.key === '+') handleZoomIn();
    if (e.key === '-') handleZoomOut();
  };
  
  const handleNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
      // Reset zoom and position
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  };
  
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      // Reset zoom and position
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  };
  
  const handleZoomIn = () => {
    if (zoom < 3) setZoom(zoom + 0.5);
  };
  
  const handleZoomOut = () => {
    if (zoom > 1) setZoom(zoom - 0.5);
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setStartPosition({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - startPosition.x,
        y: e.clientY - startPosition.y
      });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" 
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div 
        className="absolute inset-0 backdrop-blur-sm"
        style={{ backdropFilter: 'blur(10px)' }}
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
        className="relative z-10 w-full max-w-7xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Controls */}
        <div className="absolute top-4 right-4 flex items-center gap-3 z-50">
          <button 
            className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
            onClick={handleZoomIn}
          >
            <ZoomIn size={20} />
          </button>
          <button 
            className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
            onClick={handleZoomOut}
          >
            <ZoomOut size={20} />
          </button>
          <button 
            className="bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Navigation arrows */}
        {currentIndex > 0 && (
          <button 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition z-50"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
          >
            <ChevronLeft size={24} />
          </button>
        )}
        
        {currentIndex < images.length - 1 && (
          <button 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition z-50"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
          >
            <ChevronRight size={24} />
          </button>
        )}
        
        {/* Image container */}
        <div 
          className="relative flex-1 overflow-hidden h-[80vh] bg-transparent flex items-center justify-center cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImage.src}
              src={currentImage.src}
              alt={currentImage.alt}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
                maxHeight: '80vh',
                maxWidth: '100%',
                objectFit: 'contain'
              }}
              className="select-none"
              draggable={false}
            />
          </AnimatePresence>
        </div>
        
        {/* Caption */}
        {currentImage.caption && (
          <div className="bg-black/75 text-white p-4 text-center">
            <p className="text-sm md:text-base">{currentImage.caption}</p>
          </div>
        )}
        
        {/* Image counter */}
        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </motion.div>
    </div>
  );
}