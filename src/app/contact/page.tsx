'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CartIcon from '@/components/CartIcon';

export default function Contact() {
  const router = useRouter();
  const { itemCount } = useCart();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top navigation with back and cart buttons */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 lg:px-20">
          <div className="flex items-center justify-between h-24">
            <button
              onClick={() => router.push('/')}
              className="text-black hover:text-gray-600 transition-colors px-2"
              aria-label="Go back"
            >
              <ChevronLeft className="w-6 h-6" strokeWidth={2} />
            </button>

            <button
              onClick={() => router.push('/cart')}
              className="cart"
              aria-label="Open cart"
            >
              <CartIcon count={itemCount} />
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-8 md:px-16 lg:px-20 text-center">
          <div 
            style={{ 
              fontFamily: '"Courier Prime", "Courier New", Courier, monospace',
              fontSize: '13px',
              fontWeight: 400,
              lineHeight: 1.8,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            <h1 className="mb-6 text-gray-900">ALL SALES FINAL</h1>
            <p className="mb-10 text-gray-700">
              All sales are final due to the low cost of goods. We do not offer returns or exchanges. Please review your order carefully before completing your purchase.
            </p>

            <h2 className="mb-6 text-gray-900">ORDER ISSUES</h2>
            <p className="mb-10 text-gray-700">
              If an item is incorrect or defective, email us at contact@inkotanyisince90.rw and we will take responsibility and resolve it promptly.
            </p>
            <p className="mb-10 text-gray-700">
              Please include your order number and a brief description.
            </p>

            <h2 className="text-gray-900">INKOTANYI SINCE 90- Contact</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
