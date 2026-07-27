'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const front = product.images[0];

  return (
    <Link href={`/product/${product.id}`}>
      <div className="group cursor-pointer w-full">
        <div className="relative aspect-square w-full">
          {front ? (
            <div className="relative w-full h-full">
              <Image
                src={front}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                quality={95}
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
        <div className="mt-6 text-center">
          <p className="text-[11px] font-normal tracking-[0.2em] uppercase text-gray-900">
            {product.code}
          </p>
        </div>
      </div>
    </Link>
  );
}
