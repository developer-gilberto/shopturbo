'use client';

import { createContext, useContext, useState } from 'react';

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [hasEditedProduct, setHasEditedProduct] = useState(false);
  const [initialProductsShopee, setInitialProductsShopee] = useState([]);
  const [initialProductsShopturbo, setInitialProductsShopturbo] = useState([]);
  const [productsShopee, setProductsShopee] = useState([]);
  const [productsShopturbo, setProductsShopturbo] = useState([]);
  const [productsFound, setProductsFound] = useState([]);

  return (
    <ProductsContext.Provider
      value={{
        hasEditedProduct,
        productsShopee,
        initialProductsShopee,
        initialProductsShopturbo,
        productsShopturbo,
        productsFound,
        setHasEditedProduct,
        setInitialProductsShopee,
        setInitialProductsShopturbo,
        setProductsShopee,
        setProductsShopturbo,
        setProductsFound,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts deve ser usado dentro de um ProductsProvider');
  }
  return context;
}
