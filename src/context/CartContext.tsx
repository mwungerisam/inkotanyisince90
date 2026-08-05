'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Cart, Product } from '@/types';
import { getStoredCart, saveCart } from '@/lib/storage';

export interface LastAddedItem {
  code: string;
  name: string;
  size: string;
  quantity: number;
  timestamp: number;
}

interface CartContextType {
  cart: Cart;
  itemCount: number;
  lastAdded: LastAddedItem | null;
  addToCart: (product: Product, size: string, quantity: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  toggleCart: () => void;
  clearCart: () => void;
  dismissToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // Hydration-safe: start with an empty cart on the server, then load the
  // persisted cart from localStorage inside useEffect to avoid hydration mismatches.
  const [cart, setCart] = useState<Cart>({ items: [], isOpen: false });
  const [lastAdded, setLastAdded] = useState<LastAddedItem | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCart(getStoredCart());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveCart(cart);
    }
  }, [cart, hydrated]);

  const itemCount = useMemo(() => {
    return cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }, [cart.items]);

  const addToCart = (product: Product, size: string, quantity: number) => {
    setCart((prev) => {
      const existingItem = prev.items.find(
        (item) => item.product.id === product.id && item.size === size
      );

      if (existingItem) {
        const newCart = {
          ...prev,
          items: prev.items.map((item) =>
            item.product.id === product.id && item.size === size
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
        return newCart;
      }

      const newCart = {
        ...prev,
        items: [...prev.items, { product, quantity, size }],
      };
      return newCart;
    });

    setLastAdded({
      code: product.code,
      name: product.name,
      size,
      quantity,
      timestamp: Date.now(),
    });
  };

  const removeFromCart = (productId: string, size: string) => {
    setCart((prev) => ({
      ...prev,
      items: prev.items.filter(
        (item) => !(item.product.id === productId && item.size === size)
      ),
    }));
  };

  const updateQuantity = (productId: string, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size);
      return;
    }

    setCart((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.product.id === productId && item.size === size
          ? { ...item, quantity }
          : item
      ),
    }));
  };

  const toggleCart = () => {
    setCart((prev) => ({ ...prev, isOpen: !prev.isOpen }));
  };

  const clearCart = () => {
    setCart({ items: [], isOpen: false });
  };

  const dismissToast = () => {
    setLastAdded(null);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        lastAdded,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleCart,
        clearCart,
        dismissToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
