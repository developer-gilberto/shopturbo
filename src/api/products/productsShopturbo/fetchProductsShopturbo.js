'use server';

import { cookies } from 'next/headers';

export async function fetchProductsShopturbo(offset, page_size) {
  const cookie = await cookies();

  const shopturboAuthToken = cookie.get('shopturboAuthToken')?.value;
  const shopturboShopId = cookie.get('shopturboShopId')?.value;

  if (!shopturboAuthToken || !shopturboShopId) {
    return { status: 401, data: null };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/shop/${shopturboShopId}/products?offset=${offset}&page_size=${page_size}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${shopturboAuthToken}`,
        },
      }
    );

    if (!response.ok)
      return {
        status: response.status,
        message:
          'There was a problem trying to fetch the list of product IDs in fetchProductsShopturbo()',
        data: null,
      };

    const products = await response.json();

    return {
      status: 200,
      data: products.data,
      pagination: products.pagination,
    };
  } catch (err) {
    return {
      status: 500,
      message:
        'There was a problem trying to fetch the list of product IDs in fetchListAllProductsIDs()',
      data: err,
    };
  }
}
