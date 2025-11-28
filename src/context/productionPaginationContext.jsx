'use client';

import { createContext, useContext, useState } from 'react';

const ProductPaginationContext = createContext(null);

export function ProductPaginationProvider({ children }) {
    const [offsetShopturbo, setOffsetShopturbo] = useState(0);
    const [offsetShopee, setOffsetShopee] = useState(0);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);
    const [hasNextPageShopturbo, setHasNextPageShopturbo] = useState(true);
    const [hasNextPageShopee, setHasNextPageShopee] = useState(true);
    const [pageSizeShopturbo, setPageSizeShopturbo] = useState(3);
    const [pageSizeShopee, setPageSizeShopee] = useState(3);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalNumbersPages, setTotalNumbersPages] = useState(0);
    const [totalCountShopturbo, setTotalCountShopturbo] = useState(0);
    const [totalCountShopee, setTotalCountShopee] = useState(0);

    return (
        <ProductPaginationContext.Provider
            value={{
                offsetShopturbo,
                offsetShopee,
                hasPreviousPage,
                hasNextPageShopturbo,
                hasNextPageShopee,
                pageSizeShopturbo,
                pageSizeShopee,
                currentPage,
                totalNumbersPages,
                totalCountShopturbo,
                totalCountShopee,
                setOffsetShopturbo,
                setOffsetShopee,
                setHasPreviousPage,
                setHasNextPageShopturbo,
                setHasNextPageShopee,
                setPageSizeShopturbo,
                setPageSizeShopee,
                setCurrentPage,
                setTotalNumbersPages,
                setTotalCountShopturbo,
                setTotalCountShopee,
            }}
        >
            {children}
        </ProductPaginationContext.Provider>
    );
}

export function useProductPagination() {
    const context = useContext(ProductPaginationContext);
    if (!context) {
        throw new Error('useProductPagination deve ser usado dentro de ShopProvider');
    }
    return context;
}
