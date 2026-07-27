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
  const { addToCart, toggleCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [showSizeSelector, setShowSizeSelector] = useState<boolean>(false);
  const [hoveredSize, setHoveredSize] = useState<number | null>(null);
  const [hoverInfo, setHoverInfo] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const handlePlusClick = () => {
    // For accessories, add directly to cart without size selection
    if (product.category === 'accessories') {
      addToCart(product, 'One Size', 1);
      toggleCart();
    } else {
      setIsAnimating(true);
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
    toggleCart();
    setShowSizeSelector(false);
  };

  return (
    <div className="pb-16 flex justify-center">
      <div className="text-center flex flex-col items-center w-full max-w-xs font-sans -mt-28">
        {!showSizeSelector ? (
          <>
            {/* Product code directly below product */}
            <p className="text-xs font-bold text-gray-600 mb-0 tracking-tight uppercase">
              {product.code}
            </p>
            {/* Price directly below product code */}
            <p className="text-sm font-medium text-gray-900 tracking-tight mb-1">
              RWF {product.price.toLocaleString()}
            </p>
            {/* Plus button */}
            <button 
              onClick={handlePlusClick}
              className="flex items-center justify-center text-black hover:text-gray-700 transition-colors rounded-lg p-2 hover:bg-gray-50"
              aria-label="Select size"
            >
              <span className="text-4xl font-light">+</span>
            </button>
          </>
        ) : (
          <div className={`flex flex-col items-center w-full relative ${isAnimating ? 'animate-fade-in-up' : ''}`}>
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
              
              <p className="text-sm font-bold text-gray-900 uppercase tracking-[0.15em]">SELECT SIZE</p>
              
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
            <div className="flex gap-[140px] justify-center w-full mb-14">
              {numberSizes.map((size, index) => (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(sizes[index])}
                  onMouseEnter={() => setHoveredSize(index)}
                  onMouseLeave={() => setHoveredSize(null)}
                  className="text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors rounded-lg p-2 hover:bg-blue-50"
                >
                  {(hoveredSize === index || hoverInfo) ? sizes[index] : size}
                </button>
              ))}
            </div>

            {/* Information */}
            <p className="text-sm font-medium text-gray-500 uppercase tracking-[0.15em]">INFORMATION</p>
          </div>
        )}
      </div>
    </div>
  );
}
