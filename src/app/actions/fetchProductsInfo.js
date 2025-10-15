'use server';

import { cookies } from 'next/headers';

export async function fetchProductsInfo(itemIdList) {
    const cookie = await cookies();

    const shopturboAuthToken = cookie.get('shopturboAuthToken')?.value;
    const shopturboShopId = cookie.get('shopturboShopId')?.value;

    if (!shopturboAuthToken || !shopturboShopId) {
        return { status: 401, data: null };
    }

    try {
        const url = encodeURI(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/shopee/shop/${shopturboShopId}/products/full-info?item_id_list=${itemIdList}`
        );

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${shopturboAuthToken}`,
            },
        });

        if (!response.ok) return { status: response.status, data: null };

        const productsData = await response.json();

        return { status: 200, data: productsData.data };
    } catch (err) {
        return { status: 500, data: null };
    }
}
