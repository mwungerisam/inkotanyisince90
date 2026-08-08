'use client';

import { useEffect, useState } from 'react';
import ProductGrid from '@/components/ProductGrid';

import { Product } from '@/types';
import { getStoredProducts } from '@/lib/storage';
import { useProductView } from '@/context/ProductViewContext';

interface ProductCatalogProps {
  category?: Product['category'];
  newOnly?: boolean;
  compact?: boolean;
}

export default function ProductCatalog({ category, newOnly = false, compact = false }: ProductCatalogProps) {
  // Hydration-safe: start with the shipped catalogue, then load any admin-overridden
  // products from localStorage inside useEffect to avoid hydration mismatches.
  const [products, setProducts] = useState<Product[]>(() => getStoredProducts());
  const { viewState } = useProductView();

  useEffect(() => {
    setProducts(getStoredProducts());
  }, []);

  const filteredProducts = products.filter((product) => {
    if (category && product.category !== category) {
      return false;
    }

    if (newOnly && !product.isNew) {
      return false;
    }

    return true;
  });

  return <ProductGrid products={filteredProducts} viewState={viewState} compact={compact} />;
}
