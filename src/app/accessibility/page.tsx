'use client';

import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import CartIcon from '@/components/CartIcon';

export default function Accessibility() {
  const router = useRouter();
  const { itemCount } = useCart();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top navigation with back and cart buttons */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="max-w-[1800px] mx-auto px-8 md:px-16 lg:px-20">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => router.push('/')}
              className="back-button text-black hover:text-black transition-colors duration-200 flex items-center justify-center"
              aria-label="Go back"
              style={{ width: 52, height: 52, border: 'none', background: 'transparent', padding: 0 }}
            >
              <ChevronLeft strokeWidth={2} style={{ width: 22, height: 22 }} />
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
      <div className="flex-1 flex items-start justify-center pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-8 md:px-16 lg:px-20 mt-12">
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
            <h1 className="mb-6 text-gray-900">Accessibility</h1>
            <p className="mb-10 text-gray-700">
              At INKOTANYISINCE90, we are committed to making our website accessible to everyone, including people with disabilities. We continuously work to improve the usability of our website so that all visitors can browse, shop, and access our content with ease.
            </p>

            <h2 className="mb-6 text-gray-900">Disclaimer</h2>
            <p className="mb-10 text-gray-700">
              We are always improving the accessibility of our website. While we strive to provide an inclusive experience for all users, some areas of the site may still require improvement. We appreciate your patience as we continue to enhance accessibility.
            </p>

            <h2 className="mb-6 text-gray-900">Support</h2>
            <p className="mb-10 text-gray-700">
              If you experience any difficulty using our website or need assistance, please contact us. Our team will do its best to provide the support you need.
            </p>

            <h2 className="mb-6 text-gray-900">Contact</h2>
            <p className="mb-10 text-gray-700">
              If you have questions, feedback, or would like to report an accessibility issue, please contact us.
            </p>

            <p className="mb-6 text-gray-900 font-semibold">Email</p>
            <p className="mb-10 text-gray-700">
              contact@inkotanyisince90.com
            </p>

            <p className="mb-6 text-gray-900 font-semibold">Address</p>
            <p className="mb-10 text-gray-700">
              INKOTANYISINCE90
            </p>
            <p className="mb-10 text-gray-700">
              Kigali, Rwanda
            </p>

            <p className="text-gray-700">
              Thank you for helping us create a more accessible experience for everyone. We value your feedback and are committed to continuously improving our website.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
