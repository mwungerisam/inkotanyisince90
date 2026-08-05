'use client';

import { createContext, useContext, useState } from 'react';

interface ProductViewContextType {
  isExpanded: boolean;
  toggleProductView: () => void;
}

const ProductViewContext = createContext<ProductViewContextType | undefined>(undefined);

export function ProductViewProvider({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleProductView = () => {
    setIsExpanded((currentView) => !currentView);
  };

  return (
    <ProductViewContext.Provider value={{ isExpanded, toggleProductView }}>
      {children}
    </ProductViewContext.Provider>
  );
}

export function useProductView() {
  const context = useContext(ProductViewContext);

  if (!context) {
    throw new Error('useProductView must be used within a ProductViewProvider');
  }

  return context;
}
