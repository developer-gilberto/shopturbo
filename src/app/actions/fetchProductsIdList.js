'use server';

import { cookies } from 'next/headers';

export async function fetchProductsIdList() {
    const cookie = await cookies();

    const shopturboAuthToken = cookie.get('shopturboAuthToken')?.value;
    const shopturboShopId = cookie.get('shopturboShopId')?.value;

    if (!shopturboAuthToken || !shopturboShopId) {
        return { status: 401, data: null };
    }

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/shopee/shop/${shopturboShopId}/products/id-list?offset=0&page_size=20&item_status=NORMAL`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${shopturboAuthToken}`,
                },
            }
        );

        if (!response.ok) return { status: response.status, data: null };

        const productsID = await response.json();

        return { status: 200, data: productsID.data.item };
    } catch (err) {
        return { status: 500, data: null };
    }
}
