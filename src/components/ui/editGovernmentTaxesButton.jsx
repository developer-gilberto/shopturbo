'use client';

import { useProducts } from '@/context/productContext';
import { FaRegEdit } from 'react-icons/fa';

export function EditGovernmentTaxesButton({ editedProductId, fromShopturbo }) {
  const { productsShopee, productsShopturbo, hasEditedProduct, setProductsShopee, setProductsShopturbo, setHasEditedProduct } = useProducts();

  function handleInputGovernmentTaxes() {
    const inputTaxes = prompt('Digite o valor do imposto %: ');

    if (inputTaxes === null) return;

    if (inputTaxes.trim() === '') {
      alert('⚠️ Você não digitou nada!');
      return;
    }

    const inputGovernmentTaxes = Number(inputTaxes);

    if (Number.isNaN(inputGovernmentTaxes)) {
      return alert('⚠️ DIGITE SOMENTE NÚMEROS!');
    }

    if (fromShopturbo) {
      const newProductsShopturbo = productsShopturbo.map((product) =>
        String(product.id) === String(editedProductId)
          ? {
              ...product,
              governmentTaxes: inputGovernmentTaxes,
              edited_product: true,
            }
          : product,
      );

      setProductsShopturbo(newProductsShopturbo);
      setHasEditedProduct(true);
      return;
    }

    const newProducts = productsShopee.map((product) =>
      String(product.item_id) === String(editedProductId)
        ? {
            ...product,
            item_government_taxes: inputGovernmentTaxes,
            edited_product: true,
          }
        : product,
    );

    setProductsShopee(newProducts);
    setHasEditedProduct(true);
  }

  return <FaRegEdit className="text-xl text-gray-100 hover:text-[--bg_2] hover:cursor-pointer" onClick={handleInputGovernmentTaxes} />;
}
