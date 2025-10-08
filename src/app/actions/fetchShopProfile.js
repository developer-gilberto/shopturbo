'use server';

import { cookies } from 'next/headers';

export async function fetchShopProfile() {
    const cookie = await cookies();

    const shopturboAuthToken = cookie.get('shopturboAuthToken')?.value;
    const shopturboShopId = cookie.get('shopturboShopId')?.value;

    if (!shopturboAuthToken || !shopturboShopId) return { status: 401 };

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/shopee/shop/profile/${shopturboShopId}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${shopturboAuthToken}`,
                },
            }
        );

        if (!response.ok) return { status: response.status };

        const shopData = await response.json();

        return { status: 200, data: shopData.data };
    } catch (err) {
        return { status: 500 };
    }
}
