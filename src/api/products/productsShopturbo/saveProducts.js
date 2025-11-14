'use server';

import { cookies } from 'next/headers';

export async function saveProducts(productsData) {
    const cookie = await cookies();

    const shopturboAuthToken = cookie.get('shopturboAuthToken')?.value;
    const shopturboShopId = cookie.get('shopturboShopId')?.value;

    if (!shopturboAuthToken || !shopturboShopId) {
        return { status: 401, data: null };
    }

    try {
        const url = encodeURI(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/shop/${shopturboShopId}/products`,
        );

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${shopturboAuthToken}`,
            },
            body: JSON.stringify(productsData),
        });

        if (!response.ok) {
            return {
                status: response.status,
                message:
                    'It was not possible to save the products in saveProducts()',
                data: null,
            };
        }

        return {
            status: response.status,
            message: 'Products successfully saved to the database.',
            data: null,
        };
    } catch (err) {
        return {
            status: 500,
            message:
                'It was not possible to save the products in saveProducts()',
            data: err,
        };
    }
}
