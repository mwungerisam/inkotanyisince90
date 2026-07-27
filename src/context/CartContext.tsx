'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Cart, CartItem, Product } from '@/types';

interface CartContextType {
  cart: Cart;
  itemCount: number;
  addToCart: (product: Product, size: string, quantity: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  toggleCart: () => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [], isOpen: false });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('inkotanyi-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        setCart({ items: [], isOpen: false });
      }
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem('inkotanyi-cart', JSON.stringify(cart));
  }, [cart]);

  const itemCount = useMemo(() => {
    return cart.items.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }, [cart.items]);

  const addToCart = (product: Product, size: string, quantity: number) => {
    console.log('addToCart called with:', product.id, size, quantity);
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
        console.log('Cart updated (existing item):', newCart);
        return newCart;
      }

      const newCart = {
        ...prev,
        items: [...prev.items, { product, quantity, size }],
      };
      console.log('Cart updated (new item):', newCart);
      return newCart;
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

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleCart,
        clearCart,
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
