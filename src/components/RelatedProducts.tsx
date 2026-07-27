import { Product } from '@/types';
import ProductGrid from './ProductGrid';

interface RelatedProductsProps {
  products: Product[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section>
      <h2 className="text-xs tracking-[0.15em] mb-8">YOU MAY ALSO LIKE</h2>
      <ProductGrid products={products} />
    </section>
  );
}
