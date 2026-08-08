import ProductCatalog from '@/components/ProductCatalog';
import { Product } from '@/types';

interface CategoryPageProps {
  title: string;
  category?: Product['category'];
  newOnly?: boolean;
  compact?: boolean;
}

export default function CategoryPage({ title, category, newOnly = false, compact = false }: CategoryPageProps) {
  return (
    <main className="flex-1 pb-16">
      <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
        {!newOnly && category !== 'accessories' && (
          <h1 className="text-xs tracking-[0.15em] mb-8">{title}</h1>
        )}
        <ProductCatalog category={category} newOnly={newOnly} compact={compact || newOnly} />
      </div>
    </main>
  );
}
