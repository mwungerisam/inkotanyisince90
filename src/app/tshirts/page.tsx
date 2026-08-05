'use client';

import { useEffect, useState } from 'react';
import ProductGrid from '@/components/ProductGrid';
import { Product } from '@/types';
import { getStoredProducts } from '@/lib/storage';

export default function TshirtsPage() {
  // Hydration-safe: ship default catalogue, then load admin-overridden products.
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());

  useEffect(() => {
    setProducts(getStoredProducts());
  }, []);

  const tshirts = products.filter((p) => p.category === 'tshirts');

  return (
    <main className="flex-1 pt-36 md:pt-40 pb-16">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
        <h1 className="text-xs tracking-[0.15em] mb-8">TSHIRTS</h1>
        <ProductGrid products={tshirts} />
      </div>
    </main>
  );
}
