'use client';

import { useEffect, useState } from 'react';
import ProductGrid from '@/components/ProductGrid';
import { Product } from '@/types';
import { getStoredProducts } from '@/lib/storage';

export default function Womens() {
  // Hydration-safe: ship default catalogue, then load admin-overridden products.
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());

  useEffect(() => {
    setProducts(getStoredProducts());
  }, []);

  const womensProducts = products.filter(product => product.gender === 'women');

  return (
    <>
      <div className="flex-1 pb-16 bg-white">
        <div className="h-36 md:h-40" />
        <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
          <ProductGrid products={womensProducts} />
        </div>
      </div>
    </>
  );
}
