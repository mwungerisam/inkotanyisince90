'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { products } from '@/data/products';
import ProductGallery from '@/components/ProductGallery';
import ProductDetails from '@/components/ProductDetails';
import { useCart } from '@/context/CartContext';
import CartIcon from '@/components/CartIcon';

interface ProductPageClientProps {
  product: any;
}

export default function ProductPageClient({ product }: ProductPageClientProps) {
  const router = useRouter();
  const { toggleCart, itemCount } = useCart();
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isNavigatingRef = useRef(false);
  const accumulatedDeltaRef = useRef(0);
  const [currentProduct, setCurrentProduct] = useState(product);
  const [galleryIndex, setGalleryIndex] = useState(0);

  useEffect(() => {
    setCurrentProduct(product);
  }, [product]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isNavigatingRef.current) return;
      
      accumulatedDeltaRef.current += e.deltaY;
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        const totalDelta = accumulatedDeltaRef.current;
        accumulatedDeltaRef.current = 0;
        
        if (Math.abs(totalDelta) > 50 && !isNavigatingRef.current) {
          isNavigatingRef.current = true;
          
          const currentIndex = products.findIndex((p) => p.id === product.id);
          
          if (totalDelta > 0) {
            const nextIndex = (currentIndex + 1) % products.length;
            router.push(`/product/${products[nextIndex].id}`);
          } else {
            const prevIndex = currentIndex === 0 ? products.length - 1 : currentIndex - 1;
            router.push(`/product/${products[prevIndex].id}`);
          }

          setTimeout(() => {
            isNavigatingRef.current = false;
          }, 300);
        }
      }, 30);
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [product.id, router]);

  const handleGalleryPrevious = () => {
    setGalleryIndex((prev) => (prev === 0 ? currentProduct.images.length - 1 : prev - 1));
  };

  const handleGalleryNext = () => {
    setGalleryIndex((prev) => (prev === currentProduct.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <main className="flex-1 min-h-screen bg-white flex flex-col overflow-hidden relative">
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 lg:px-20">
          <div className="flex items-center justify-between h-24">
            <button
              onClick={() => router.push('/')}
              className="text-black hover:text-gray-600 transition-colors px-2"
              aria-label="Go back"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={2} />
            </button>

            <button
              onClick={toggleCart}
              className="cart"
              aria-label="Open cart"
            >
              <CartIcon count={itemCount} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start px-4 pt-2 pb-4">
        <div className="w-full max-w-sm flex flex-col">
          <ProductGallery 
            images={currentProduct.images} 
            name={currentProduct.name} 
            index={galleryIndex}
            onPrevious={handleGalleryPrevious}
            onNext={handleGalleryNext}
          />
          <ProductDetails product={currentProduct} />
        </div>
      </div>
    </main>
  );
}
