'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductGalleryProps {
  images: string[];
  name: string;
  index?: number;
  onPrevious?: () => void;
  onNext?: () => void;
}

export default function ProductGallery({ images, name, index = 0, onPrevious, onNext }: ProductGalleryProps) {
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const activeImage = images[index] || images[0];
  const hasMultipleImages = images.length > 1;

  const handlePrevious = () => {
    setDirection('right');
    onPrevious?.();
  };

  const handleNext = () => {
    setDirection('left');
    onNext?.();
  };

  const variants = {
    enter: (direction: 'left' | 'right') => ({
      x: direction === 'left' ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: 'left' | 'right') => ({
      x: direction === 'left' ? -50 : 50,
      opacity: 0,
    }),
  };

  return (
    <div className="relative aspect-[3/3.5] bg-white overflow-hidden flex items-center justify-center p-0">
      <div className="relative w-full h-full max-w-[180px] mx-auto">
        <AnimatePresence mode="wait" custom={direction}>
          {activeImage ? (
            <motion.div
              key={activeImage}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="relative w-full h-full"
            >
              <Image
                src={activeImage}
                alt={`${name} — view ${index + 1} of ${images.length}`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                quality={95}
                priority={index === 0}
                className="object-contain"
              />
            </motion.div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs tracking-[0.15em] text-gray-400">{name}</span>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Arrows - positioned outside padding for distance */}
      {hasMultipleImages && (
        <>
          <button
            type="button"
            onClick={handlePrevious}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 text-black hover:text-gray-600 transition-colors px-2"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-black hover:text-gray-600 transition-colors px-2"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" strokeWidth={2} />
          </button>
        </>
      )}

      {/* Pagination Dots */}
      {hasMultipleImages && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${i === index ? 'bg-black' : 'bg-gray-300'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
