import React, { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface FullscreenImageViewerProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  alt: string;
}

export function FullscreenImageViewer({
  images,
  currentIndex: initialIndex,
  isOpen,
  onClose,
  alt,
}: FullscreenImageViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoom(1);
    setRotation(0);
  }, [initialIndex, isOpen]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setZoom(1);
    setRotation(0);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    setZoom(1);
    setRotation(0);
  }, [images.length]);

  const zoomIn = useCallback(() => {
    setZoom((prev) => Math.min(prev + 0.25, 3));
  }, []);

  const zoomOut = useCallback(() => {
    setZoom((prev) => Math.max(prev - 0.25, 0.5));
  }, []);

  const rotate = useCallback(() => {
    setRotation((prev) => (prev + 90) % 360);
  }, []);

  const resetTransforms = useCallback(() => {
    setZoom(1);
    setRotation(0);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          onClose();
          break;
        case "ArrowLeft":
          goToPrevious();
          break;
        case "ArrowRight":
          goToNext();
          break;
        case "+":
        case "=":
          zoomIn();
          break;
        case "-":
          zoomOut();
          break;
        case "r":
        case "R":
          rotate();
          break;
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose, goToPrevious, goToNext, zoomIn, zoomOut, rotate]);

  if (!isOpen || images.length === 0) return null;

  const overlay = (
    <div
      className={`fixed inset-0 z-50 bg-black/95 backdrop-blur-sm transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      onClick={onClose}
    >
      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-white text-lg font-medium">
              {currentIndex + 1} / {images.length}
            </span>
            <span className="text-gray-400">{alt}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Zoom controls */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                zoomOut();
              }}
              className="p-2 bg-gray-800/80 text-white rounded-lg hover:bg-gray-700 transition-colors"
              title="Zoom Out (-)"
            >
              <ZoomOut className="w-5 h-5" />
            </button>

            <span className="text-white text-sm px-2 py-1 bg-gray-800/80 rounded">
              {Math.round(zoom * 100)}%
            </span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                zoomIn();
              }}
              className="p-2 bg-gray-800/80 text-white rounded-lg hover:bg-gray-700 transition-colors"
              title="Zoom In (+)"
            >
              <ZoomIn className="w-5 h-5" />
            </button>

            {/* Rotate */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                rotate();
              }}
              className="p-2 bg-gray-800/80 text-white rounded-lg hover:bg-gray-700 transition-colors"
              title="Rotate (R)"
            >
              <RotateCw className="w-5 h-5" />
            </button>

            {/* Download */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                const link = document.createElement("a");
                link.href = images[currentIndex];
                link.download = `image-${currentIndex + 1}`;
                link.click();
              }}
              className="p-2 bg-gray-800/80 text-white rounded-lg hover:bg-gray-700 transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 bg-gray-800/80 text-white rounded-lg hover:bg-gray-700 transition-colors"
              title="Close (Esc)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Image Container */}
      <div className="absolute inset-0 flex items-center justify-center p-16">
        <div
          className="relative w-full h-full max-w-full max-h-full overflow-hidden transition-opacity duration-300"
          onClick={(e) => e.stopPropagation()}
        >
          <ImageWithFallback
            src={images[currentIndex]}
            alt={`${alt} - Image ${currentIndex + 1}`}
            className="w-full h-full object-contain transition-transform duration-300 select-none"
            style={{
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
              cursor: zoom > 1 ? "grab" : "default",
            }}
            draggable={false}
          />
        </div>
      </div>

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-gray-800/80 text-white rounded-full hover:bg-gray-700 transition-all duration-200 backdrop-blur-sm"
            title="Previous Image (←)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-gray-800/80 text-white rounded-full hover:bg-gray-700 transition-all duration-200 backdrop-blur-sm"
            title="Next Image (→)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Bottom Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <div className="flex gap-2 p-2 bg-gray-800/80 rounded-lg backdrop-blur-sm">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                  resetTransforms();
                }}
                className={`relative w-16 h-16 rounded overflow-hidden transition-all duration-200 ${
                  index === currentIndex
                    ? "ring-2 ring-[#3B82F6] scale-110"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <ImageWithFallback
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Keyboard shortcuts help */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-400 bg-gray-800/80 rounded p-2 backdrop-blur-sm">
        <div>ESC: Close | ← →: Navigate | +/-: Zoom | R: Rotate</div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(overlay, document.body)
    : overlay;
}
