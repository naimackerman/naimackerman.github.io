import React, { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { FullscreenImageViewer } from "./FullscreenImageViewer";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  className?: string;
}

export function ImageCarousel({ images, alt, className = "" }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  if (!images || images.length === 0) return null;

  const openFullscreen = useCallback(() => {
    setIsFullscreenOpen(true);
  }, []);

  const closeFullscreen = useCallback(() => {
    setIsFullscreenOpen(false);
  }, []);

  if (images.length === 1) {
    return (
      <>
        <div className={`rounded-lg overflow-hidden bg-gray-700 group cursor-pointer ${className}`}>
          <div className="relative h-full">
            <ImageWithFallback
              src={images[0]}
              alt={alt}
              className="w-full h-full object-cover"
              onClick={openFullscreen}
            />
            {/* Fullscreen button */}
            <button
              onClick={openFullscreen}
              className="absolute top-2 right-2 p-2 bg-gray-900/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-900/90 backdrop-blur-sm"
              aria-label="View fullscreen"
            >
              <Expand className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <FullscreenImageViewer
          images={images}
          currentIndex={0}
          isOpen={isFullscreenOpen}
          onClose={closeFullscreen}
          alt={alt}
        />
      </>
    );
  }

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  return (
    <>
      <div className={`relative rounded-lg overflow-hidden bg-gray-700 group cursor-pointer ${className}`}>
        {/* Main Image */}
        <div className="relative h-full">
          <ImageWithFallback
            src={images[currentIndex]}
            alt={`${alt} - Image ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-opacity duration-300"
            onClick={openFullscreen}
          />
          
          {/* Fullscreen button */}
          <button
            onClick={openFullscreen}
            className="absolute top-2 right-2 p-2 bg-gray-900/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-900/90 backdrop-blur-sm z-10"
            aria-label="View fullscreen"
          >
            <Expand className="w-4 h-4" />
          </button>
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-gray-900/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-900/90 backdrop-blur-sm z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <button
                onClick={(e) => { e.stopPropagation(); goToNext(); }}
                className="absolute right-12 top-1/2 -translate-y-1/2 p-2 bg-gray-900/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-gray-900/90 backdrop-blur-sm z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </>
          )}
          
          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-gray-900/70 text-white text-xs rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Dots Indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-[#3B82F6] scale-125' 
                    : 'bg-gray-400 hover:bg-gray-300'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      
      <FullscreenImageViewer
        images={images}
        currentIndex={currentIndex}
        isOpen={isFullscreenOpen}
        onClose={closeFullscreen}
        alt={alt}
      />
    </>
  );
}