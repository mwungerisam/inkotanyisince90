'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import CartIcon from '@/components/CartIcon';

export default function ProductHeader() {
  const router = useRouter();
  const { itemCount } = useCart();

  const navCategories = [
    { name: 'NEW', href: '/', active: true },
    { name: 'MENS', href: '/mens', active: false },
    { name: 'WOMENS', href: '/womens', active: false },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white">
      <div className="max-w-[1800px] mx-auto px-8 md:px-16 lg:px-20">
        <div className="flex items-center justify-between h-32">
          <Link href="/" className="text-gray-900 p-4 hover:bg-gray-50 rounded-lg transition-colors" aria-label="Back to home">
            <ChevronLeft className="w-6 h-6" strokeWidth={3} />
          </Link>

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
              <div className="flex items-center gap-8">
                {navCategories.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`text-xs font-medium tracking-wide uppercase transition-colors hover:text-blue-600 ${
                      item.active ? 'text-gray-900 font-semibold' : 'text-gray-500'
                    }`}
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

          <button onClick={() => router.push('/cart')} className="cart" aria-label="Open cart">
            <CartIcon count={itemCount} />
          </button>
        </div>
      </div>
    </header>
  );
}
