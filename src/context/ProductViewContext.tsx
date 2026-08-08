'use client';

import { createContext, useContext, useState } from 'react';

interface ProductViewContextType {
  viewState: 0 | 1 | 2;
  nextViewState: () => void;
  resetViewState: () => void;
}

const ProductViewContext = createContext<ProductViewContextType | undefined>(undefined);

export function ProductViewProvider({ children }: { children: React.ReactNode }) {
  const [viewState, setViewState] = useState<0 | 1 | 2>(0);

  const nextViewState = () => {
    setViewState((currentState) => (currentState < 2 ? (currentState + 1) as 1 | 2 : currentState));
  };

  const resetViewState = () => {
    setViewState(0);
  };

  return (
    <ProductViewContext.Provider value={{ viewState, nextViewState, resetViewState }}>
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
