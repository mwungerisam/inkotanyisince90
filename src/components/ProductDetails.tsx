'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

interface ProductDetailsProps {
  product: Product;
}

const sizes = ['S', 'M', 'L'];
const numberSizes = ['1', '2', '3'];

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const availableSizes =
    product.category === 'accessories'
      ? ['One Size']
      : product.sizes.length > 0
        ? product.sizes
        : sizes;
  const [showSizeSelector, setShowSizeSelector] = useState<boolean>(false);
  const [hoveredSize, setHoveredSize] = useState<number | null>(null);
  const [hoverInfo, setHoverInfo] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const handlePlusClick = () => {
    // For accessories, add directly to cart without size selection
    if (product.category === 'accessories') {
      addToCart(product, 'One Size', 1);
    } else {
      setIsAnimating(true);
      setSelectedSize(availableSizes[0] || 'M');
      setTimeout(() => {
        setShowSizeSelector(true);
        setIsAnimating(false);
      }, 100);
    }
  };

  const handleClose = () => {
    setShowSizeSelector(false);
  };

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
    addToCart(product, size, 1);
    setShowSizeSelector(false);
  };

  return (
    <div className="pb-12 flex justify-center">
      <div className="text-center flex flex-col items-center w-full max-w-xs font-sans -mt-7 md:-mt-5">
        {!showSizeSelector ? (
          <>
            {/* Product code directly below product */}
            <p className="text-[10px] font-semibold text-gray-800 mb-[7px] tracking-[0.02em] uppercase">
              {product.code}
            </p>
            {/* Price directly below product code */}
            <p className="text-[10px] font-normal text-gray-900 tracking-[0.01em] mb-[11px]">
              RWF {product.price.toLocaleString()}
            </p>
            {/* Plus button */}
            <button
              onClick={handlePlusClick}
              className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-black transition-colors hover:text-gray-700"
              aria-label="Select size"
            >
              <span className="text-[20px] leading-none font-light">+</span>
            </button>
          </>
        ) : (
          <div
            className={`flex flex-col items-center w-full relative ${
              isAnimating ? 'animate-fade-in-up' : ''
            }`}
          >
            {/* Top row with icons and SELECT SIZE */}
            <div className="flex items-center justify-between w-full mb-12">
              <button
                onMouseEnter={() => setHoverInfo(true)}
                onMouseLeave={() => setHoverInfo(false)}
                className="w-4 h-4 flex items-center justify-center text-black hover:text-gray-700 transition-colors font-bold text-base rounded hover:bg-gray-50 p-2"
                aria-label="Size information"
              >
                ?
              </button>

              <p className="text-sm font-bold text-gray-900 uppercase tracking-[0.15em]">
                SELECT SIZE
              </p>

              <button
                onClick={handleClose}
                className="w-3.5 h-3.5 flex items-center justify-center text-black hover:text-gray-700 transition-colors font-medium text-sm rounded hover:bg-gray-50 p-2"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* Price */}
            <p className="text-base font-medium text-gray-900 tracking-tight mb-12">
              RWF {product.price.toLocaleString()}
            </p>

            {/* Size buttons */}
            <div className="flex justify-center w-full mb-14">
              <div className="flex items-center justify-center gap-12 sm:gap-20">
                {availableSizes.map((size, index) => (
                  <button
                    key={size}
                    onClick={() => handleSizeSelect(size)}
                    onMouseEnter={() => setHoveredSize(index)}
                    onMouseLeave={() => setHoveredSize(null)}
                    className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors rounded-lg p-2 hover:bg-blue-50 min-w-10"
                  >
                    {(hoveredSize === index || hoverInfo) ? size : numberSizes[index] || size}
                  </button>
                ))}
              </div>
            </div>

            {/* Information */}
            <p className="text-sm font-medium text-gray-500 uppercase tracking-[0.15em]">
              {selectedSize ? `${selectedSize} READY` : 'INFORMATION'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
