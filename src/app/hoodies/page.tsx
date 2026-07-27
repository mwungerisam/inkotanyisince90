import ProductGrid from '@/components/ProductGrid';
import { products } from '@/data/products';

export default function HoodiesPage() {
  const hoodies = products.filter((p) => p.category === 'hoodies');

  return (
    <main className="flex-1 pt-24 md:pt-28 lg:pt-32 pb-16">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
        <h1 className="text-xs tracking-[0.15em] mb-8">HOODIES</h1>
        <ProductGrid products={hoodies} />
      </div>
    </main>
  );
}
