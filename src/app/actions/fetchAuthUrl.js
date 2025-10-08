'use server';

import { cookies } from 'next/headers';

export async function fetchAuthUrl() {
    const cookie = await cookies();
    const token = cookie.get('shopturboAuthToken')?.value;

    if (!token) return { status: 401 };

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/shopee/auth-url`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) return { status: response.status };

        const data = await response.json();

        return { status: 200, url: data.authorizationUrl };
    } catch (err) {
        return { status: 500 };
    }
}
