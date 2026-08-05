import { notFound } from 'next/navigation';
import { products } from '@/data/products';
import ProductPageClient from './ProductPageClient';

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  return <ProductPageClient product={product} />;
}
