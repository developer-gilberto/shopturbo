'use server';

import { cookies } from 'next/headers';

export async function fetchOrdersDetails(ordersIdList) {
  const cookie = await cookies();

  const shopturboAuthToken = cookie.get('shopturboAuthToken')?.value;
  const shopturboShopId = cookie.get('shopturboShopId')?.value;

  if (!shopturboAuthToken || !shopturboShopId) {
    return { status: 401, data: null };
  }

  try {
    const url = encodeURI(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/shopee/shop/${shopturboShopId}/orders/details?order_id_list=${ordersIdList}`
    );

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${shopturboAuthToken}`,
      },
    });

    if (!response.ok)
      return {
        status: response.status,
        message:
          'There was a problem trying to fetch order details in fetchOrdersDetails()',
        data: null,
      };

    const ordersData = await response.json();

    return { status: 200, data: ordersData.data };
  } catch (err) {
    return {
      status: 500,
      message:
        'There was a problem trying to fetch order details in fetchOrdersDetails()',
      data: err,
    };
  }
}
