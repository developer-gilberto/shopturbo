"use client";

import { createContext, useContext, useState } from "react";

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
  const [hasEditedProduct, setHasEditedProduct] = useState(false);
  const [productsFoundEdited, setProductsFoundEdited] = useState(false);
  const [initialProductsShopee, setInitialProductsShopee] = useState([]);
  const [initialProductsShopturbo, setInitialProductsShopturbo] = useState([]);
  const [productsShopee, setProductsShopee] = useState([]);
  const [productsShopturbo, setProductsShopturbo] = useState([]);
  const [productsFound, setProductsFound] = useState([]);
  const [initialProductsFound, setInitialProductsFound] = useState([]);

  return (
    <ProductsContext.Provider
      value={{
        hasEditedProduct,
        setHasEditedProduct,
        productsFoundEdited,
        setProductsFoundEdited,
        productsShopee,
        setProductsShopee,
        productsShopturbo,
        setProductsShopturbo,
        initialProductsShopee,
        setInitialProductsShopee,
        initialProductsShopturbo,
        setInitialProductsShopturbo,
        initialProductsFound,
        setInitialProductsFound,
        productsFound,
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
    throw new Error("useProducts deve ser usado dentro de um ProductsProvider");
  }
  return context;
}
