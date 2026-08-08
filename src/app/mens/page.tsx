'use client';

import { useEffect, useState } from 'react';
import ProductGrid from '@/components/ProductGrid';
import { Product } from '@/types';
import { getStoredProducts } from '@/lib/storage';
import { useProductView } from '@/context/ProductViewContext';

export default function Mens() {
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());
  const { viewState } = useProductView();

  useEffect(() => {
    setProducts(getStoredProducts());
  }, []);

  const mensProducts = products.filter(product => (product.gender || 'men') === 'men');

  return (
    <>
      <div className="flex-1 pb-16 bg-white">
        <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
          <ProductGrid products={mensProducts} compact={viewState === 0} viewState={viewState} />
        </div>
      </div>
    </>
  );
}
