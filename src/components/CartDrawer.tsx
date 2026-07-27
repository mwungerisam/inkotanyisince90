'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const router = useRouter();
  const { cart, toggleCart, removeFromCart, updateQuantity } = useCart();

  const subtotal = cart.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <AnimatePresence>
      {cart.isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Your Cart</h2>
              <button
                onClick={toggleCart}
                className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                aria-label="Close cart"
              >
                <X className="w-4 h-4 text-gray-900" strokeWidth={2} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cart.items.length === 0 ? (
                <div className="text-center mt-16">
                  <p className="text-sm font-semibold text-gray-900 mb-3">Your cart is empty</p>
                  <button
                    onClick={toggleCart}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-900 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.items.map((item) => (
                    <div key={`${item.product.id}-${item.size}`} className="border border-gray-200 rounded-lg p-3 shadow-sm">
                      <div className="flex gap-3 mb-3">
                        <div className="relative w-14 h-14 bg-white rounded-md overflow-hidden shrink-0 border border-gray-100">
                          {item.product.images[0] ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              fill
                              sizes="56px"
                              quality={70}
                              className="object-contain"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-300">
                                {item.product.code}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1">
                          <h3 className="text-xs font-semibold text-gray-900 mb-0.5">
                            {item.product.name}
                          </h3>
                          <p className="text-[10px] text-gray-500 mb-0.5">
                            {item.product.code}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            Size: {item.size}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.size, item.quantity - 1)
                            }
                            className="w-6 h-6 border border-gray-300 flex items-center justify-center rounded-md hover:bg-gray-50 transition-colors text-gray-900"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" strokeWidth={2} />
                          </button>
                          <span className="w-6 text-center text-xs font-medium text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.size, item.quantity + 1)
                            }
                            className="w-6 h-6 border border-gray-300 flex items-center justify-center rounded-md hover:bg-gray-50 transition-colors text-gray-900"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" strokeWidth={2} />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-xs font-semibold text-gray-900">
                            {(item.product.price * item.quantity).toLocaleString()} RWF
                          </p>
                          <button
                            onClick={() => removeFromCart(item.product.id, item.size)}
                            className="text-[10px] text-red-600 hover:text-red-800 font-medium uppercase mt-0.5 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.items.length > 0 && (
              <div className="border-t border-gray-200 p-4 space-y-3">
                <div className="flex justify-between text-sm font-bold text-gray-900">
                  <span className="uppercase tracking-wide">Subtotal</span>
                  <span>{subtotal.toLocaleString()} RWF</span>
                </div>

                <p className="text-[10px] text-gray-500 text-center">
                  Shipping and taxes calculated at checkout
                </p>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-black text-white py-3 text-xs font-semibold hover:bg-gray-800 transition-colors rounded-lg"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
