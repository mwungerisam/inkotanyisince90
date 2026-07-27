'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartIcon from '@/components/CartIcon';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { itemCount } = useCart();

  const navCategories = [
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 lg:px-20">
          <div className="flex items-center justify-between h-36">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-gray-900 p-4 hover:bg-gray-50 rounded-lg transition-colors"
              aria-label="Open menu"
            >
              <Plus className="w-5 h-5" strokeWidth={2} />
            </button>

            <nav className="hidden md:block">
              <div className="flex flex-col items-center gap-4">
                <Link
                  href="/"
                  className="relative block h-9 w-[72px] md:h-10 md:w-[80px]"
                  aria-label="Inkotanyi Since 90 home"
                >
                  <Image
                    src="/logo.png"
                    alt="Inkotanyi Since 90"
                    fill
                    sizes="80px"
                    quality={90}
                    priority
                    className="object-contain"
                  />
                </Link>
                <div className="flex items-center gap-10">
                  {navCategories.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`text-[10px] uppercase transition-colors hover:text-blue-600 ${
                        pathname === item.href ? 'text-gray-900' : 'text-gray-500'
                      }`}
                      style={{ 
                        fontFamily: '"Helvetica Neue", "Arial", sans-serif',
                        fontWeight: pathname === item.href ? 600 : 400,
                        letterSpacing: '2px'
                      }}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>

            {/* Mobile logo */}
            <Link
              href="/"
              className="md:hidden relative block h-8 w-16"
              aria-label="Inkotanyi Since 90 home"
            >
              <Image
                src="/logo.png"
                alt="Inkotanyi Since 90"
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

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="max-w-[1800px] mx-auto px-8 md:px-16 lg:px-20">
            <div className="flex items-center justify-between h-36">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-900 p-4 hover:bg-gray-50 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </button>
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative block h-9 w-[72px]"
                aria-label="Inkotanyi Since 90 home"
              >
                <Image
                  src="/logo.png"
                  alt="Inkotanyi Since 90"
                  fill
                  sizes="72px"
                  quality={90}
                  className="object-contain"
                />
              </Link>
              <div className="w-16" />
            </div>

            <nav className="pt-24">
              <div className="flex flex-col items-center gap-8">
                <ul className="flex flex-col items-center gap-8">
                  {navCategories.map((item) => (
                    <li key={item.name} className="w-full">
                      <Link
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`block text-center text-[10px] uppercase py-4 transition-colors hover:text-blue-600 ${
                          pathname === item.href ? 'text-gray-900' : 'text-gray-400'
                        }`}
                        style={{ 
                          fontFamily: '"Helvetica Neue", "Arial", sans-serif',
                          fontWeight: pathname === item.href ? 600 : 400,
                          letterSpacing: '2px'
                        }}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
