'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ProductGallery from './ProductGallery';
import ProductDetails from './ProductDetails';
import { Product } from '@/types';

interface ProductScrollProps {
  currentProduct: Product;
  nextProduct?: Product;
  prevProduct?: Product;
  products: Product[];
  currentIndex: number;
}

export default function ProductScroll({
  currentProduct,
  nextProduct,
  prevProduct,
  products,
  currentIndex,
}: ProductScrollProps) {
  const router = useRouter();
  const [isScrolling, setIsScrolling] = useState(false);
  const touchStartY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (isScrolling) return;

      if (e.deltaY > 50 && nextProduct) {
        setIsScrolling(true);
        setTimeout(() => {
          router.push(`/product/${nextProduct.id}`);
        }, 300);
      } else if (e.deltaY < -50 && prevProduct) {
        setIsScrolling(true);
        setTimeout(() => {
          router.push(`/product/${prevProduct.id}`);
        }, 300);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (isScrolling) return;

      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY.current - touchEndY;

      if (diff > 50 && nextProduct) {
        setIsScrolling(true);
        setTimeout(() => {
          router.push(`/product/${nextProduct.id}`);
        }, 300);
      } else if (diff < -50 && prevProduct) {
        setIsScrolling(true);
        setTimeout(() => {
          router.push(`/product/${prevProduct.id}`);
        }, 300);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel);
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [isScrolling, nextProduct, prevProduct, router]);

  return (
    <div 
      ref={containerRef}
      className={`flex-1 flex items-center justify-center pt-32 transition-opacity duration-300 ${
        isScrolling ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="w-full max-w-sm px-6 md:px-12 lg:px-16">
        <ProductGallery images={currentProduct.images} name={currentProduct.name} />
        <ProductDetails product={currentProduct} />
        
        {/* Scroll indicator */}
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="w-1 h-1 rounded-full bg-gray-300" />
            <span className="w-1 h-1 rounded-full bg-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
