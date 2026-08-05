'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartToast() {
  const router = useRouter();
  const { lastAdded, dismissToast, itemCount } = useCart();
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!lastAdded) {
      return;
    }

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      dismissToast();
    }, 3200);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [lastAdded, dismissToast]);

  const handleViewCart = () => {
    dismissToast();
    router.push('/cart');
  };

  return (
    <AnimatePresence>
      {lastAdded && (
        <motion.div
          key={lastAdded.timestamp}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ type: 'spring', damping: 24, stiffness: 320 }}
          className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 w-[calc(100%-2rem)] max-w-md"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white px-4 py-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.14)]">
            {/* Success icon */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black">
              <Check className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>

            {/* Message */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-black leading-tight">
                Added to cart
              </p>
<p className="mt-0.5 truncate text-xs text-gray-500">
                {lastAdded.code} · {lastAdded.size} × {lastAdded.quantity}
              </p>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-2">
              <button
                onClick={handleViewCart}
                className="rounded-lg bg-black px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-gray-800"
              >
                View Cart ({itemCount})
              </button>
              <button
                onClick={dismissToast}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                aria-label="Dismiss notification"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
