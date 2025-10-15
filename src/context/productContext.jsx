'use client';

import { createContext, useContext, useState } from 'react';

const ProductsContext = createContext(null);

export function ProductsProvider({ children }) {
    const [products, setProducts] = useState([]);

    return (
        <ProductsContext.Provider value={{ products, setProducts }}>
            {children}
        </ProductsContext.Provider>
    );
}

export function useProducts() {
    const context = useContext(ProductsContext);
    if (!context) {
        throw new Error(
            'useProducts deve ser usado dentro de um ProductsProvider'
        );
    }
    return context;
}
