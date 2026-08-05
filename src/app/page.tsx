import ProductCatalog from '@/components/ProductCatalog';

export default function Home() {
  return (
    <>
      <div className="flex-1 pb-16 bg-white">
<div className="h-40 md:h-44" />
        <div className="max-w-[1800px] mx-auto px-4 md:px-8 lg:px-12">
          <ProductCatalog />
        </div>
      </div>
    </>
  );
}
