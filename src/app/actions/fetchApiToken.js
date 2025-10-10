'use server';

import { cookies } from 'next/headers';

export async function fetchApiToken(code, shop_id) {
    const cookie = await cookies();
    const token = cookie.get('shopturboAuthToken')?.value;

    if (!token) return { status: 401 };

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/shopee/access-token?code=${code}&shop_id=${shop_id}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) return { status: response.status };

        const accessTokenData = await response.json();

        cookie.set('shopturboShopId', accessTokenData.data.shopId, {
            httpOnly: true,
            secure: true,
            sameSite: 'lax',
            path: '/',
            expires: new Date(accessTokenData.data.expireIn),
            domain: '.gilbertolopes.dev',
        });

        return { status: 200, shopId: accessTokenData.data.shopId };
    } catch (err) {
        return { status: 500, message: err.message, erro: err };
    }
}
