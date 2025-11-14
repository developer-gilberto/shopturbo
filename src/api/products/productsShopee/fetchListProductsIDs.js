'use server';

import { cookies } from 'next/headers';

export async function fetchListProductsIDs(offset, pagesize) {
  const cookie = await cookies();

  const shopturboAuthToken = cookie.get('shopturboAuthToken')?.value;
  const shopturboShopId = cookie.get('shopturboShopId')?.value;

  if (!shopturboAuthToken || !shopturboShopId) {
    return { status: 401, data: null };
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/shopee/shop/${shopturboShopId}/products/id-list?offset=${offset}&page_size=${pagesize}&item_status=NORMAL`,
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
          'There was a problem trying to fetch the list of product IDs in fetchListAllProductsIDs()',
        data: null,
      };

    const productsID = await response.json();

    return { status: 200, data: productsID.data };
  } catch (err) {
    return {
      status: 500,
      message:
        'There was a problem trying to fetch the list of product IDs in fetchListAllProductsIDs()',
      data: err,
    };
  }
}
