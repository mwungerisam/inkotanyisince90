'use client';

import { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  isExpanded?: boolean;
}

export default function ProductGrid({ products, isExpanded = false }: ProductGridProps) {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 ${isExpanded ? 'xl:grid-cols-5' : 'xl:grid-cols-6'} gap-x-4 gap-y-12`}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
