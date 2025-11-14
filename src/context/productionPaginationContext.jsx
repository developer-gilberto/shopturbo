'use client';

import { createContext, useContext, useState } from 'react';

const ProductPaginationContext = createContext(null);

export function ProductPaginationProvider({ children }) {
  const [offsetShopturbo, setOffsetShopturbo] = useState(0);
  const [offsetShopee, setOffsetShopee] = useState(0);
  const [hasNextPageShopturbo, setHasNextPageShopturbo] = useState(true);
  const [hasNextPageShopee, setHasNextPageShopee] = useState(true);

  return (
    <ProductPaginationContext.Provider
      value={{
        offsetShopturbo,
        offsetShopee,
        hasNextPageShopturbo,
        hasNextPageShopee,
        setOffsetShopturbo,
        setOffsetShopee,
        setHasNextPageShopturbo,
        setHasNextPageShopee,
      }}
    >
      {children}
    </ProductPaginationContext.Provider>
  );
}

export function useProductPagination() {
  const context = useContext(ProductPaginationContext);
  if (!context) {
    throw new Error(
      'useProductPagination deve ser usado dentro de ShopProvider'
    );
  }
  return context;
}
