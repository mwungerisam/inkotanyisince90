import ProductGrid from '@/components/ProductGrid';
import Footer from '@/components/Footer';
import { products } from '@/data/products';

export default function Mens() {
  const mensProducts = products.filter(product => product.price === 18000);

  return (
    <>
      <div className="flex-1 pb-16 bg-white">
        <div className="h-24 md:h-32" />
        <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
          <ProductGrid products={mensProducts} />
        </div>
      </div>
      <Footer />
    </>
  );
}
