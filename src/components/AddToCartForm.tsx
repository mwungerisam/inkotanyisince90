'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/types';

interface AddToCartFormProps {
  product: Product;
}

export default function AddToCartForm({ product }: AddToCartFormProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart, toggleCart } = useCart();

  const handleAddToCart = () => {
    if (!selectedSize) return;

    addToCart(product, selectedSize, quantity);
    toggleCart();
  };

  const sizeLabels: { [key: string]: string } = {
    'S': 'Small',
    'M': 'Medium',
    'L': 'Big',
  };

  return (
    <div className="space-y-6">
      {/* Size Selector */}
      <div>
        <label className="text-xs font-semibold tracking-wide uppercase text-gray-600 block mb-3">Select Size</label>
        <div className="flex flex-wrap gap-3">
          {product.sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`px-6 py-3 border font-medium text-sm uppercase tracking-wide transition-all text-center ${
                selectedSize === size
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
              }`}
            >
              {sizeLabels[size] || size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity Selector */}
      <div>
        <label className="text-xs font-semibold tracking-wide uppercase text-gray-600 block mb-3">Quantity</label>
        <div className="flex items-center gap-0">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-12 h-12 border border-gray-300 border-r-0 flex items-center justify-center font-medium text-lg hover:bg-gray-50 transition-colors"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-12 h-12 border border-gray-300 flex items-center justify-center font-medium text-lg">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-12 h-12 border border-gray-300 border-l-0 flex items-center justify-center font-medium text-lg hover:bg-gray-50 transition-colors"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={!selectedSize}
        className="w-full bg-black text-white py-5 text-sm font-bold tracking-wide uppercase hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4" />
        Add to Cart
      </button>
    </div>
  );
}
