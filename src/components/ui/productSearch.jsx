'use client';

import { fetchProductsInfo } from '@/api/products/productsShopee/fetchProductsInfo';
import { useProducts } from '@/context/productContext';
import { useShop } from '@/context/shopContext';
import { useState } from 'react';
import { Button } from './buttons/btn';
import { IsLoading } from './isLoading';
import { ProductSearchTable } from './tables/products/productSearchTable';

export function ProductSearch() {
  const [loading, setLoading] = useState(false);
  const [inputProductID, setInputProductID] = useState('');
  const { shop } = useShop();
  const { productsFound, setProductsFound, setInitialProductsFound } =
    useProducts();

  async function handleProductSeach(event) {
    event.preventDefault();

    if (inputProductID.trim() === '') {
      alert('⚠️ Você não digitou nada!');
      return;
    }

    const productId = Number(inputProductID);

    if (Number.isNaN(productId)) {
      return alert('⚠️ DIGITE SOMENTE NÚMEROS!');
    }

    try {
      setLoading(true);
      const response = await fetchProductsInfo(productId);

      setInputProductID('');

      if (!response.data?.item_list) {
        return alert('Nenhum produto encontrado com o ID informado!');
      }

      setInitialProductsFound(response.data.item_list);
      setProductsFound(response.data.item_list);
    } catch (err) {
      console.log('Ocorreu um erro ao tentar buscar o produto informado.', err);
      alert('Ocorreu um erro ao tentar buscar o produto informado.');
    } finally {
      setLoading(false);
    }
  }

  if (!shop) return null;

  return (
    <>
      <form
        className="flex justify-start items-center gap-2 my-4"
        onSubmit={handleProductSeach}
      >
        <input
          className="bg-[--bg_4] p-1"
          type="search"
          name="product-id"
          value={inputProductID}
          onChange={(e) => setInputProductID(e.target.value)}
          placeholder="Digite o ID do produto"
        />

        {!loading && <Button type="submit">Buscar produto</Button>}

        {loading && <IsLoading width="w-80" />}
      </form>

      <ProductSearchTable />

      {productsFound && productsFound.length > 0 && (
        <button
          className="bg-[--bg_3] py-1 px-4 my-4 rounded-md hover:bg-[--bg_4]"
          onClick={() => setProductsFound([])}
        >
          Limpar busca
        </button>
      )}
    </>
  );
}
