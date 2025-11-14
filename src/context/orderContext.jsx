'use client';

import { createContext, useContext, useState } from 'react';

const OrderContext = createContext(null);

export function OrderProvider({ children }) {
    const [orders, setOrders] = useState([]);

    return (
        <OrderContext.Provider value={{ orders, setOrders }}>
            {children}
        </OrderContext.Provider>
    );
}

export function useOrder() {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrder deve ser usado dentro de OrderProvider');
    }
    return context;
}
