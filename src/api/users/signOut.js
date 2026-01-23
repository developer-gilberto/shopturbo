'use server';

import { cookies } from 'next/headers';

export async function signOut() {
  const cookie = await cookies();
  const isProduction = process.env.NODE_ENV === 'production';

  const cookieOptions = {
    path: '/',
    domain: isProduction ? process.env.COOKIES_DOMAIN : 'localhost',
  };

  cookie.delete('shopturboAuthToken', cookieOptions);
  cookie.delete('shopturboShopId', cookieOptions);
}
