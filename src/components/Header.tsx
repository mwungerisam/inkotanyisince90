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
  const { viewState, nextViewState, resetViewState } = useProductView();
  const isOrderConfirmationPage = pathname === '/order-confirmation';

  const handleProductViewToggle = () => {
    if (viewState === 0) {
      nextViewState();
    } else {
      resetViewState();
    }
  };

  const navLinks = [
    { name: 'NEW', href: '/new' },
    { name: 'MENS', href: '/mens' },
    { name: 'WOMENS', href: '/womens' },
    { name: 'ACCESSORIES', href: '/accessories' },
  ];

  const activePath = pathname === '/' ? 'new' : pathname.split('/')[1];

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
                aria-label={viewState === 0 ? 'Show larger product view' : 'Return to normal product view'}
              >
                {viewState === 0 ? (
                  <Plus className="w-5 h-5" strokeWidth={2} />
                ) : (
                  <ChevronLeft className="w-5 h-5" strokeWidth={2} />
                )}
              </button>
            )}

            <div className="flex flex-col items-center justify-center gap-3">
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

              <nav aria-label="Primary navigation" className="flex md:flex items-center gap-4 md:gap-8 overflow-x-auto whitespace-nowrap">
                {navLinks.map((link) => {
                  const isActive = activePath === link.href.split('/')[1];
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={`text-[9px] md:text-[10px] tracking-[0.18em] uppercase transition-colors ${isActive ? 'font-semibold text-black' : 'font-light text-gray-400 hover:text-gray-700'}`}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

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
