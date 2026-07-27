'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrderConfirmationPage() {
  const router = useRouter();
  const [orderId, setOrderId] = useState<string>('');

  useEffect(() => {
    // Get the most recent order from localStorage
    const orders = JSON.parse(localStorage.getItem('inkotanyi-orders') || '[]');
    if (orders.length > 0) {
      const lastOrder = orders[orders.length - 1];
      setOrderId(lastOrder.id);
    }
  }, []);

  return (
    <div className="flex-1 pt-36 pb-16">
      <div className="max-w-2xl mx-auto px-8 md:px-16 lg:px-20 text-center">
        <div className="border border-gray-200 rounded-lg p-8 mb-8">
          <h1 className="text-3xl font-semibold mb-4">Order Confirmed!</h1>
          <p className="text-lg mb-2">Thank you for your purchase.</p>
          {orderId && (
            <p className="text-sm text-gray-600 mb-6">
              Order ID: <span className="font-semibold">{orderId}</span>
            </p>
          )}
          <p className="text-sm text-gray-600 mb-8">
            You will receive an email confirmation shortly with your order details.
          </p>

          <div className="space-y-4">
            <button
              onClick={() => router.push('/')}
              className="w-full bg-black text-white py-3 text-sm font-medium hover:bg-gray-800 transition-colors rounded-lg"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => router.push('https://chat.whatsapp.com/Cb22N7qdbKBI1daglO2o8E')}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 border border-gray-300 font-medium hover:bg-gray-100 transition-colors rounded-lg"
            >
              Join Our WhatsApp Community
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
          <p className="text-sm text-gray-600 mb-4">
            If you have any questions about your order, please contact us through our WhatsApp community.
          </p>
          <a
            href="https://chat.whatsapp.com/Cb22N7qdbKBI1daglO2o8E"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 border border-gray-300 font-medium hover:bg-gray-100 transition-colors rounded-lg"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
