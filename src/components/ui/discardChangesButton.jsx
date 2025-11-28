'use client';

import { useProducts } from '@/context/productContext';

export function DiscardChangesButton() {
  const { initialProductsShopee, initialProductsShopturbo, setHasEditedProduct, setProductsShopee, setProductsShopturbo } = useProducts();

  function handleDiscardChanges() {
    setProductsShopturbo(initialProductsShopturbo);
    setProductsShopee(initialProductsShopee);
    setHasEditedProduct(false);
  }

  return (
    <button
      className="bg-[--bg_3] flex justify-center items-center gap-2
               text-white text-nowrap px-2 py-1 rounded-md font-extrabold hover:bg-[--bg_2]"
      onClick={handleDiscardChanges}
    >
      Desfazer alterações
    </button>
  );
}
