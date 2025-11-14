'use server';

import { cookies } from 'next/headers';

export async function fetchOrdersIdList(status) {
  const cookie = await cookies();

  const shopturboAuthToken = cookie.get('shopturboAuthToken')?.value;
  const shopturboShopId = cookie.get('shopturboShopId')?.value;

  if (!shopturboAuthToken || !shopturboShopId) {
    return { status: 401, data: null };
  }
  // "UNPAID", "READY_TO_SHIP", "PROCESSED", "SHIPPED", "COMPLETED", "IN_CANCEL", "CANCELLED", "INVOICE_PENDING"
  // "NÃO PAGO", "PRONTO_PARA_ENVIO", "PROCESSADO", "ENVIADO", "CONCLUÍDO", "CANCELADO", "CANCELADO", "FATURA_PENDENTE"
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/shopee/shop/${shopturboShopId}/orders/id-list?page_size=100&interval_days=15&time_range_field=create_time&order_status=${status}`,
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
          'There was a problem trying to fetch the list of order IDs in fetchOrdersIdList()',
        data: null,
      };

    const ordersID = await response.json();

    return { status: 200, data: ordersID.data };
  } catch (err) {
    return {
      status: 500,
      message:
        'There was a problem trying to fetch the list of order IDs in fetchOrdersIdList()',
      data: err,
    };
  }
}
