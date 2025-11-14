'use server';

import { fetchListProductsIDs } from './fetchListProductsIDs';
import { fetchProductsInfo } from './fetchProductsInfo';

export async function fetchProductsShopee(offset, pagesize) {
  try {
    const response = await fetchListProductsIDs(offset, pagesize);

    if (response.status !== 200) {
      console.log(response);
      return;
    }
    const pagination = {
      totalProducts: response.data.total_count,
      hasNextPage: response.data.has_next_page,
      nextOffset: response.data.next_offset,
      next: response.data.next,
    };

    const productsIdList = response.data.item.map((product) => product.item_id);

    const productsData = await fetchProductsInfo(productsIdList);

    if (productsData.status !== 200) return;

    const products = productsData.data.item_list;

    return { products, pagination };
  } catch (err) {
    console.error(err);
  }
}
