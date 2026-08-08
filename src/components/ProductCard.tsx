'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
  viewState?: 0 | 1 | 2;
}

export default function ProductCard({ product, compact = false, viewState = 0 }: ProductCardProps) {
  const front = product.images[0];

  return (
    <Link href={`/product/${product.id}`} className="block group">
      <div className="group cursor-pointer w-full">
        <div
          className={`relative aspect-square w-full overflow-hidden ${
            viewState === 2 ? 'p-5' : viewState === 1 ? 'p-3' : compact ? 'p-1' : 'p-2'
          }`}
        >
          {front ? (
            <div className="relative w-full h-full">
              <Image
                src={front}
                alt={product.name}
                fill
                sizes={
                  viewState === 2
                    ? '(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 34vw'
                    : viewState === 1
                    ? '(max-width: 640px) 70vw, (max-width: 1024px) 40vw, 22vw'
                    : compact
                    ? '(max-width: 640px) 50vw, (max-width: 1024px) 20vw, 11vw'
                    : '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw'
                }
                quality={95}
                loading="lazy"
                decoding="async"
                className="object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-300">
                {product.code}
              </span>
            </div>
          )}
        </div>
        <div className={`text-center ${viewState > 0 ? 'mt-4' : compact ? 'mt-1' : 'mt-4'}`}>
          <p
            className={`uppercase font-semibold text-gray-900 ${
              viewState === 2
                ? 'text-[12px] tracking-[0.3em]'
                : viewState === 1
                ? 'text-[11px] tracking-[0.26em]'
                : compact
                ? 'text-[8.5px] tracking-[0.18em]'
                : 'text-[10px] tracking-[0.2em]'
            }`}
          >
            {product.code}
          </p>
        </div>
      </div>
    </Link>
  );
}
