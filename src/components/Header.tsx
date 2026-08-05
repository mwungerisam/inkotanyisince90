'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeft, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useProductView } from '@/context/ProductViewContext';
import CartIcon from '@/components/CartIcon';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { isExpanded, toggleProductView } = useProductView();
  const isOrderConfirmationPage = pathname === '/order-confirmation';

  const handleProductViewToggle = () => {
    toggleProductView();

    if (pathname !== '/') {
      router.push('/');
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 lg:px-20">
          <div className="flex items-center justify-between h-36">
            {isOrderConfirmationPage ? (
              <button
                onClick={() => router.push('/')}
                className="text-gray-900 p-4 hover:bg-gray-50 rounded-lg transition-colors"
                aria-label="Go back"
              >
                <ChevronLeft className="w-5 h-5" strokeWidth={2} />
              </button>
            ) : (
              <button
                onClick={handleProductViewToggle}
                className="text-gray-900 p-4 hover:bg-gray-50 rounded-lg transition-colors"
                aria-label={isExpanded ? 'Show standard product view' : 'Show larger product view'}
              >
                <Plus className="w-5 h-5" strokeWidth={2} />
              </button>
            )}

            <nav className="hidden md:block">
              <Link
                href="/"
                className="relative block h-9 w-[72px] md:h-10 md:w-[80px]"
                aria-label="INKOTANYISINCE90 home"
              >
                <Image
                  src="/logo.png"
                  alt="INKOTANYISINCE90"
                  fill
                  sizes="80px"
                  quality={90}
                  priority
                  className="object-contain"
                />
              </Link>
            </nav>

            {/* Mobile logo */}
            <Link
              href="/"
              className="md:hidden relative block h-8 w-16"
              aria-label="INKOTANYISINCE90 home"
            >
              <Image
                src="/logo.png"
                alt="INKOTANYISINCE90"
                fill
                sizes="64px"
                quality={90}
                priority
                className="object-contain"
              />
            </Link>

            <button
              onClick={() => router.push('/cart')}
              className="cart"
              aria-label="Open cart"
            >
              <CartIcon count={itemCount} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
