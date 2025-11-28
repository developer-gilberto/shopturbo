'use client';

import { saveProducts } from '@/api/products/productsShopturbo/saveProducts';
import { useState } from 'react';
import { useProducts } from '@/context/productContext';
import { Button } from './btn';
import { IsLoading } from './isLoading';

export function SaveChangesButton() {
  const [loading, setLoading] = useState(false);
  const {
    productsShopee,
    productsShopturbo,
    setHasEditedProduct,
    productsFound,
    setInitialProductsShopee,
    setInitialProductsShopturbo,
    setProductsShopee,
    setProductsShopturbo,
    setProductsFound,
  } = useProducts();

  async function handleSaveProducts() {
    const editedProductsFromProductsSearch = productsFound.filter(
      (product) => product.edited_product,
    );

    const editedProductsFromShopee = productsShopee.filter(
      (product) => product.edited_product,
    );
    const uneditedProductsFromShopee = productsShopee.filter(
      (product) => !product.edited_product,
    );

    const editedProductsFromShopturbo = productsShopturbo.filter(
      (product) => product.edited_product,
    );
    const uneditedProductsFromShopturbo = productsShopturbo.filter(
      (product) => !product.edited_product,
    );

    const editedProductsFromProductsSearchInCamelCase =
      editedProductsFromProductsSearch.map((product) => ({
        id: product.item_id,
        sku: product.item_sku,
        categoryId: product.category_id,
        name: product.item_name,
        stock: product.stock_info_v2.summary_info.total_available_stock,
        sellingPrice: product.price_info[0].current_price,
        costPrice: product?.costPrice ? product.costPrice : 0,
        governmentTaxes: product?.governmentTaxes ? product.governmentTaxes : 0,
        imageUrl: product.image?.image_url_list[0],
      }));

    const editedProductsFromShopeeInCamelCase = editedProductsFromShopee.map(
      (product) => ({
        id: product.item_id,
        sku: product.item_sku,
        categoryId: product.category_id,
        name: product.item_name,
        stock: product.stock_info_v2.summary_info.total_available_stock,
        sellingPrice: product.price_info[0].current_price,
        costPrice: product?.item_cost_price ? product.item_cost_price : 0,
        governmentTaxes: product?.governmentTaxes ? product.governmentTaxes : 0,
        imageUrl: product.image?.image_url_list[0],
      }),
    );

    const productsToSave = [
      ...editedProductsFromShopeeInCamelCase,
      ...editedProductsFromShopturbo,
      ...editedProductsFromProductsSearchInCamelCase,
    ];

    try {
      setLoading(true);

      const response = await saveProducts(productsToSave);

      if (response.status != 201) {
        console.log(response?.message);
        alert('Ocorreu um erro ao tentar salvar os dados!');
        return;
      }

      setProductsShopturbo([
        ...uneditedProductsFromShopturbo,
        ...editedProductsFromShopturbo,
        ...editedProductsFromShopeeInCamelCase,
      ]);
      setInitialProductsShopturbo(
        JSON.parse(
          JSON.stringify([
            ...uneditedProductsFromShopturbo,
            ...editedProductsFromShopturbo,
            ...editedProductsFromShopeeInCamelCase,
          ]),
        ),
      );

      setInitialProductsShopee(
        JSON.parse(JSON.stringify(uneditedProductsFromShopee)),
      );
      setProductsFound([]);
      setProductsShopee(uneditedProductsFromShopee);
      setHasEditedProduct(false);

      alert('Dados salvos com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao tentar salvar os dados!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {loading && <IsLoading label="Salvando" width="w-80" />}

      {!loading && (
        <Button onClick={handleSaveProducts}>Salvar alterações</Button>
      )}
    </>
  );
}
