'use client';

import { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  viewState?: 0 | 1 | 2;
  compact?: boolean;
}

export default function ProductGrid({ products, viewState = 0, compact = false }: ProductGridProps) {
  const gridClass =
    viewState === 2
      ? 'grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-10 gap-y-14 max-w-[1800px] mx-auto'
      : viewState === 1
      ? 'grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-x-8 gap-y-12 max-w-[1600px] mx-auto'
      : compact
      ? 'grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-x-3 gap-y-8 max-w-[1320px] mx-auto'
      : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-x-6 gap-y-12';

  return (
    <div className={gridClass}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} compact={compact} viewState={viewState} />
      ))}
    </div>
  );
}
